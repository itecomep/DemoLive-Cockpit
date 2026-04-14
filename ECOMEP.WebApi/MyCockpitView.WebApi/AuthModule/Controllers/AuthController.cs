using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.AuthModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MyCockpitView.WebApi.Settings;
using Microsoft.Extensions.Options;

namespace MyCockpitView.WebApi.AuthModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    private readonly RoleManager<Role> _roleManager;
    private readonly SignInManager<User> _signInManager;
    private readonly EntitiesContext _context;
    private readonly ILogger<AuthController> _logger;
    private readonly ISharedService sharedService;
    private readonly ILoginSessionService loginSessionService;
    private readonly IContactService contactService;
    private readonly IRefreshTokenService refreshTokenService;
    private readonly IAccessTokenService accessTokenService;
    private readonly ICurrentUserService _currentUserService;
    private readonly JwtSettings _jwtSettings;
    private readonly IConfiguration _configuration;
    private readonly ssoSettings _ssoSettings;

    public AuthController(
        IOptions<ssoSettings> ssoSettings,
        IMapper mapper,
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        SignInManager<User> signInManager,
        EntitiesContext context,
        ILogger<AuthController> logger,
        ISharedService sharedService,
        ILoginSessionService loginSessionService,
        IContactService contactService,
        IRefreshTokenService refreshTokenService,
        IAccessTokenService accessTokenService,
        ICurrentUserService currentUserService,
        JwtSettings jwtSettings,
        IConfiguration configuration
        )
    {
        _ssoSettings = ssoSettings.Value;
        _mapper = mapper;
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _context = context;
        this._logger = logger;
        this.sharedService = sharedService;
        this.loginSessionService = loginSessionService;
        this.contactService = contactService;
        this.refreshTokenService = refreshTokenService;
        this.accessTokenService = accessTokenService;
        _currentUserService = currentUserService;
        _jwtSettings = jwtSettings;
        _configuration = configuration;
    }

    [Authorize]
    [HttpPost("Register")]
    public async Task<IActionResult> SignUp(UserSignUpDto userSignUpResource)
    {
        if (userSignUpResource == null || string.IsNullOrEmpty(userSignUpResource.Password))
            return BadRequest("User sign up data or password is missing.");
        var user = _mapper.Map<UserSignUpDto, User>(userSignUpResource);
        var userCreateResult = await _userManager.CreateAsync(user, userSignUpResource.Password);
        if (!userCreateResult.Succeeded) throw new BadRequestException(userCreateResult.Errors.First().Description);
        _logger.LogInformation($"New User signed up: {user.UserName}");
        return Created(string.Empty, string.Empty);
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto request, CancellationToken cancellationToken)
    {

        if (string.IsNullOrEmpty(request.Username)) throw new BadRequestException("Username is required.");
        if (string.IsNullOrEmpty(request.Password)) throw new BadRequestException("Password is required.");
        var user = await _userManager.FindByNameAsync(request.Username);
        if (user is null) throw new BadRequestException($"We were not able to find any user with that username. Please enter a valid username.");
        var _devmode = Convert.ToBoolean(await sharedService.GetPresetValue(McvConstant.DEVMODE));
        var ipAddress = _currentUserService.GetRemoteIpAddress();
        var isBypassUser = await _context.BypassAllowedUsers
            .AnyAsync(x =>
                x.IsActive &&
                x.Username.ToLower() == request.Username.ToLower(),
                cancellationToken
            );

        var allowedIps = new List<string>();
        if (!_devmode && !isBypassUser)
        {
            allowedIps = await _context.AllowedIpAddresses
                .Where(x => x.IsActive)
                .Select(x => x.IpAddress)
                .ToListAsync(cancellationToken);

            // if (!allowedIps.Contains(ipAddress))
            // {
            //     _logger.LogWarning($"Blocked login | User: {request.Username} | IP: {ipAddress}");
            //     throw new BadRequestException("Login is not allowed from this IP address.");
            // }
        } else {
            if (_devmode)
            {
                _logger.LogInformation(
                    $"IP check skipped (DEV MODE) | User: {request.Username} | IP: {ipAddress}"
                );
            }
            else
            {
                _logger.LogInformation(
                    $"IP check bypassed for user: {request.Username}"
                );
            }
        }

        bool? isOutsideIP = null;
        if (!_devmode && !isBypassUser && !allowedIps.Contains(ipAddress))
        {
            isOutsideIP = true;
            _logger.LogWarning($"User logged in from outside IP | User: {request.Username} | IP: {ipAddress}");
        }
        else
        {
            _logger.LogInformation($"IP check passed for user: {request.Username}");
        }

        var signInResult = await _signInManager.PasswordSignInAsync(user, request.Password, false, false);
        if (!signInResult.Succeeded) throw new BadRequestException($"User login failed. Please check the username or password and try again.");


        var _contact = await contactService.Get().Include(x=>x.Appointments)
            .SingleOrDefaultAsync(x => x.Username == request.Username);

        if (_contact == null) throw new BadRequestException("Contact details not found!");

        var refreshToken = refreshTokenService.Generate(user);
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.RefreshTokenExpirationMinutes);
        await _context.RefreshTokens.AddAsync(new RefreshToken() { UserID = user.Id, Token = refreshToken, ExpiresAt = expiresAt }, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        List<string> allowedModules = new List<string>();
        if (isOutsideIP == true)
        {
            allowedModules = new List<string> { "leave-edit" };
        }

        var result = new AuthenticateResponse
        {
            AccessToken = accessTokenService.Generate(user),
            RefreshToken = refreshToken,
            IsChangePassword = user.IsChangePassword,
            UserId = _contact.ID,
            AllowedModules = allowedModules,
            IsOutsideIP = isOutsideIP ?? false
        };


        //var roles = await _userManager.GetRolesAsync(user);
        //if (          !roles.Any(x => x.Equals(McvConstant.ROLE_MASTER, StringComparison.OrdinalIgnoreCase))                )
        //{

        //    var _sessionCount = await loginSessionService.Get().Where(x=>x.Username==request.Username).CountAsync();

        //    var _allowedLoginCount = Convert.ToInt32(await sharedService.GetPresetValue(McvConstant.LOGIN_ALLOWED_COUNT));
        //    if (_sessionCount >= _allowedLoginCount)
        //    {
        //        _logger.LogInformation("Login limit reached! You have already logged in from " + _allowedLoginCount + " devices. Please log out from other devices or contact Admin.");

        //        throw new BadRequestException("Login limit reached! You have already logged in from " + _allowedLoginCount + " devices. Please log out from other devices or contact Admin.");
        //    }
        //}
        var userAgent = _currentUserService.GetUserAgent();

        // Device Info
        var os = _currentUserService.GetHeaderValue("os");
        var browserName = _currentUserService.GetHeaderValue("browser");
        var device = _currentUserService.GetHeaderValue("device");
        var deviceType = _currentUserService.GetHeaderValue("devicetype");
        var otp = _currentUserService.GetHeaderValue("otp");

            var session = new LoginSession();
            session.ContactID = _contact.ID;
            session.Username = _contact.Username;
            session.Person = $"{_contact.Name}";
            session.IpAddress = ipAddress;
            session.UserAgent = !request.UserAgent.IsNullOrEmpty() ? request.UserAgent: userAgent;
            session.OS = !request.OS.IsNullOrEmpty() ? request.OS : os;
            session.BrowserName = !request.Browser.IsNullOrEmpty() ? request.Browser: browserName ;
            session.Device = !request.Device.IsNullOrEmpty()? request.Device :device;
            session.DeviceType = !request.DeviceType.IsNullOrEmpty() ? request.DeviceType  :deviceType;
            session.GeoLocation = !request.GeoLocation.IsNullOrEmpty() ? request.GeoLocation : "";
            session.OTP = !request.OTP.IsNullOrEmpty() ? request.OTP : otp;
            session.IsOutsideIP = isOutsideIP ?? false;

            var activeAppointment = _contact.Appointments.FirstOrDefault(x => x.StatusFlag == McvConstant.APPOINTMENT_STATUSFLAG_APPOINTED);

            // var _devmode = Convert.ToBoolean(await sharedService.GetPresetValue(McvConstant.DEVMODE));

            var _otpEnabled = Convert.ToBoolean(await sharedService.GetPresetValue(McvConstant.LOGIN_OTP_ENABLED));


            session.Token = refreshToken;
            session.IsActive = true;

            session.IsOTPRequired = activeAppointment!=null && _otpEnabled && !_devmode && _contact.Username != "nit@newarchllp.com";
            //session.IsOTPRequired = activeAppointment == null && _otpEnabled && !_devmode && _contact.Username != "nit@newarchllp.com";
            //session.IsOTPRequired = true;

        await loginSessionService.Create(session);

            result.SessionID = session.UID;
            result.IsOTPRequired = session.IsOTPRequired;
            _logger.LogInformation($"User session started: {user.UserName}");


        _logger.LogInformation($"User logged in: {user.UserName}");
        return Ok(result);

    }

    [HttpGet("client-ip")]
    [AllowAnonymous]
    public IActionResult GetClientIp()
    {
        var ipAddress = _currentUserService.GetRemoteIpAddress();
        return Ok(new { ip = ipAddress });
    }

    [Authorize]
    [HttpPost]
    [Route("Logout")]
    public async Task<IActionResult> Logout([FromBody] UserLogOutDto dto)
    {

        if (dto == null || string.IsNullOrEmpty(dto.Username))
            return BadRequest("Username is required for logout.");
        await loginSessionService.LogoutUser(dto.Username, dto.Token);
        return Ok();

    }

    [HttpPost("Refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto request, CancellationToken cancellationToken)
    {

        if (string.IsNullOrEmpty(request.Token)) throw new BadRequestException("Refresh token is required.");
        var isValidRefreshToken = refreshTokenService.Validate(request.Token);
        if (!isValidRefreshToken)
            throw new BadRequestException("Refresh token is not valid.");
        var previousToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == request.Token, cancellationToken);
        if (previousToken is null)
            throw new BadRequestException("Refresh token failed to generate.");

        _context.RefreshTokens.Remove(previousToken);
        await _context.SaveChangesAsync(cancellationToken);

        var user = await _userManager.FindByIdAsync(previousToken.UserID.ToString());
        if (user is null) throw new NotFoundException($"User not found!");

        var refreshToken = refreshTokenService.Generate(user);
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.RefreshTokenExpirationMinutes);
        await _context.RefreshTokens.AddAsync(new RefreshToken() { UserID = user.Id, Token = refreshToken, ExpiresAt = expiresAt }, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        await loginSessionService.UpdateRefreshToken(refreshToken);

        var result = new AuthenticateResponse
        {
            AccessToken = accessTokenService.Generate(user),
            RefreshToken = refreshToken,
            IsChangePassword = user.IsChangePassword,
        };
        return Ok(result);
    }


    [Authorize]
    [HttpDelete("{username}")]
    public async Task<IActionResult> DeleteUser(string username)
    {
        //Only SuperAdmin or Admin can delete users (Later when implement roles)

        if (string.IsNullOrEmpty(username))
            return BadRequest("Username is required for delete.");
        var appUser = await _userManager.FindByNameAsync(username);
        if (appUser == null) return NotFound("User not found.");
        IdentityResult result = await _userManager.DeleteAsync(appUser);
        if (!result.Succeeded) throw new BadRequestException(result.Errors.First().Description);
        var contacts = await contactService.Get().Where(x => x.Username == username).ToListAsync();
        foreach (var contact in contacts)
        {
            contact.Username = null;
            await contactService.Update(contact);
        }
        return Ok();
    }

    [Authorize]
    [HttpPut("Change")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto Dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        if (Dto == null || string.IsNullOrEmpty(Dto.Username) || string.IsNullOrEmpty(Dto.OldPassword) || string.IsNullOrEmpty(Dto.NewPassword))
            return BadRequest("Username, old password, and new password are required.");
        var user = await _userManager.FindByNameAsync(Dto.Username);
        if (user == null) return NotFound("User not found.");
        user.IsChangePassword = false;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) throw new BadRequestException(result.Errors.First().Description);
        result = await _userManager.ChangePasswordAsync(user, Dto.OldPassword, Dto.NewPassword);
        if (!result.Succeeded) throw new BadRequestException(result.Errors.First().Description);
        return Ok();

    }

    [Authorize]
    [HttpPut("Reset")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto Dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        if (Dto == null || string.IsNullOrEmpty(Dto.Username) || string.IsNullOrEmpty(Dto.Password))
            return BadRequest("Username and password are required.");
        var user = await _userManager.FindByNameAsync(Dto.Username);
        if (user == null) return NotFound("User not found.");
        var result = await _userManager.RemovePasswordAsync(user);
        result = await _userManager.AddPasswordAsync(user, Dto.Password);
        if (!result.Succeeded) throw new BadRequestException(result.Errors.First().Description);
        user.IsChangePassword = Dto.IsChangePassword;
        await _userManager.UpdateAsync(user);
        return Ok();
    }

    [Authorize]
    [HttpGet("Roles")]
    public async Task<IActionResult> GetRoles()
    {


        var _query = _roleManager.Roles.Where(x => !x.IsHidden);
        var results = await _query.ToListAsync();

        return Ok(results);
    }

    [Authorize]
    [HttpGet("RolesByUsername")]
    public async Task<IActionResult> GetRolesByUser(string username)
    {

        if (string.IsNullOrEmpty(username))
            return BadRequest("Username is required.");
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.UserName == username);
        if (user == null) return NotFound("User not found.");
        var results = await _userManager.GetRolesAsync(user);
        return Ok(results);
    }

    [Authorize]
    [HttpGet("RoleOptionsByUsername")]
    public async Task<IActionResult> GetRoleOptionsByUsername(string username)
    {

        if (string.IsNullOrEmpty(username))
            return BadRequest("Username is required.");
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.UserName == username);
        if (user == null) return NotFound("User not found.");
        var results = await _userManager.GetRolesAsync(user);
        var _appRoles = await _roleManager.Roles.ToListAsync();
        var _result = new HashSet<RoleDto>();
        foreach (var r in _appRoles.Where(x => !x.IsHidden))
        {
            _result.Add(new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Title = r.Title,
                Description = r.Description,
                Module = r.Module,
                IsSpecial = r.IsSpecial,
                IsDefault = r.IsDefault,
                IsHidden = r.IsHidden,
                OrderFlag = r.OrderFlag,
                Group = r.Group,
                IsAssigned = results.Any(x => x == r.Name)
            });
        }
        return Ok(_result.OrderBy(x => x.Module).ThenBy(x => x.Name));
    }

    [Authorize]
    [HttpPut("AddRoles")]
    public async Task<IActionResult> AddRolesToUser(AddRemoveRoleDto dto)
    {

        if (dto == null || string.IsNullOrEmpty(dto.Username) || dto.Roles == null)
            return BadRequest("Username and roles are required.");
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.UserName == dto.Username);
        if (user == null) return NotFound("User not found.");
        var result = await _userManager.AddToRolesAsync(user, dto.Roles);
        if (!result.Succeeded) throw new BadRequestException(result.Errors.First().Description);
        foreach (var role in dto.Roles)
            _logger.LogInformation(user.UserName + " | " + role + " role added!");
        return Ok();


    }

    [Authorize]
    [HttpPut("RemoveRoles")]
    public async Task<IActionResult> RemoveRolesFromUser(AddRemoveRoleDto dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.Username) || dto.Roles == null)
            return BadRequest("Username and roles are required.");
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.UserName == dto.Username);
        if (user == null) return NotFound("User not found.");
        var result = await _userManager.RemoveFromRolesAsync(user, dto.Roles);
        if (!result.Succeeded) throw new BadRequestException(result.Errors.First().Description);
        foreach (var role in dto.Roles)
            _logger.LogInformation($"User: {user.UserName} role:{role} removed!");
        return Ok();

    }

    [Authorize]
    [HttpPost("Email/verifyOTP")]
    public async Task<IActionResult> VerifyEmailOTP(EmailOTPVerificationDto dto)
    {
            await loginSessionService.VerifyEmailOTP(dto);
            return Ok(new OTPResult("success"));

    }

    [Authorize]
    [HttpPost("GenerateTaskSsoToken")]
    public async Task<IActionResult> GenerateTaskSsoToken()
    {
        var username = _currentUserService.GetCurrentUsername();
        if (string.IsNullOrEmpty(username))
            return Unauthorized("Invalid user context");

        var taskUserExists = await _context.Users
            .AnyAsync(u => u.UserName.ToLower() == username.ToLower());

        if (!taskUserExists)
        {
            return Ok(new
            {
                message = "User does not exist in Task. Redirect to Task login.",
                redirectUrl = "https://task.pointcloudengg.com/login"
            });
        }

        var claims = new List<Claim>
        {
            new Claim("username", username),
            new Claim("source", "cockpit")
        };

        // var secret = "THIS_IS_A_SUPER_SECURE_32_CHAR_SECRET_123456";
        // var secret = Environment.GetEnvironmentVariable("TASK_SSO_SECRET");

        // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_ssoSettings.TASK_SSO_SECRET));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            // issuer: "cockpit.com",
            // audience: "task.pointcloudengg.com",
            issuer: _ssoSettings.TaskSsoIssuer,
            audience: _ssoSettings.TaskSsoAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(45),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        var taskUrl = $"https://task.pointcloudengg.com/sso-login?token={jwt}";
        return Ok(new
        {
            token = jwt,
            taskUrl = taskUrl
        });
    }
}

public class OTPResult
{
    public OTPResult(string status)
    {
        this.Status = status;
    }
    public string? Status { get; set; }
}