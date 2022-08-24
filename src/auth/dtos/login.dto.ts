import { IsEmail, IsString, Length } from 'class-validator';

export abstract class LoginDto {
  @IsString()
  @IsEmail()
  @Length(7, 255)
  public email: string;

  @IsString()
  @Length(1, 40)
  public password: string;
}
