import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { PasswordDto } from './dto/password.dto';
import { RegisterDto } from './dto/register.dto';
import { IAccessToken } from './interfaces/access-token.interface';
import { IMessage } from './interfaces/message.interface';
import { IUserResponse } from './interfaces/user-response.interface';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<IAccessToken> {
    return {
      token: await this.authService.register(dto),
    };
  }

  @Public()
  @Post('login')
  public async login(@Body() dto: LoginDto): Promise<IAccessToken> {
    return {
      token: await this.authService.login(dto),
    };
  }

  @Delete('account')
  public async deleteAccount(
    @CurrentUser() userId: string,
    @Body() dto: PasswordDto,
  ): Promise<IMessage> {
    return {
      message: await this.authService.remove(userId, dto.password),
    };
  }

  @Get('account')
  public async findAccount(
    @CurrentUser() userId: string,
  ): Promise<IUserResponse> {
    const { name, email, entityId, createdAt } =
      await this.authService.userById(userId);

    return {
      name,
      email,
      id: entityId,
      createdAt,
    };
  }
}
