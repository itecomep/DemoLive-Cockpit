export class ResetPasswordDto
{
  username!: string;
  password!: string;
  confirmPassword!: string;
  isChangePassword: boolean = false;
}
