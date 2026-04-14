export class RegisterUserDto {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  isChangePassword: boolean = false;
  contactID: number = 0;
}
