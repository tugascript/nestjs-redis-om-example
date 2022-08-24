import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export abstract class RegisterDto {
  @IsString()
  @IsEmail()
  @Length(7, 255)
  public email: string;

  @IsString()
  @Length(3, 100)
  public name: string;

  @IsString()
  @Length(8, 40)
  public password1: string;

  @IsString()
  @MinLength(1)
  public password2: string;
}
