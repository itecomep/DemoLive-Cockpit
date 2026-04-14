using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MyCockpitView.WebApi.AuthModule.Extensions;

public static class JwtExtensions
{
    public static IServiceCollection AddJwtBearerAuthentication(
       this IServiceCollection services,
       JwtSettings jwtSettings)
    {
        services
            .AddAuthorization(options =>
            {
                options.AddPolicy("OnlyTest", policy => policy.RequireUserName("test@test.com"));
            })
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true, // validate the server
                    ValidateAudience = true, // Validate the recipient of token is authorized to receive
                    ValidateLifetime = true, // Check if token is not expired and the signing key of the issuer is valid
                    ValidateIssuerSigningKey = true, // Validate signature of the token

                    //Issuer and audience values are same as defined in generating Token
                    ValidIssuer = jwtSettings.Issuer, //_config.GetSection("Jwt")["Issuer"].ToString(), // stored in appsetting file
                    ValidAudience = jwtSettings.Audience, //_config["Jwt:Issuer"], // stored in appsetting file
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.AccessTokenSecret)), // stored in appsetting file
                    ClockSkew = TimeSpan.Zero
                };
            });

        return services;
    }
}