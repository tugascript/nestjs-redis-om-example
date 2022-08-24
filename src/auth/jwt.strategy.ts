import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';
import { IAccessIdResponse } from './interfaces/access-id.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.secret'),
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  public async validate(
    { id, iat }: IAccessIdResponse,
    done: VerifiedCallback,
  ) {
    const user = await this.authService.userById(id);
    return done(null, user.entityId, iat);
  }
}
