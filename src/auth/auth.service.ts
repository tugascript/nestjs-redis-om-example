import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'redis-om';
import { IJwt } from '../config/interfaces/jwt.interface';
import { RedisClientService } from '../redis-client/redis-client.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { User, userSchema } from './entities/user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly usersRepository: Repository<User>;
  private readonly jwt: IJwt;

  constructor(
    private readonly redisClient: RedisClientService,
    private readonly configService: ConfigService,
  ) {
    this.usersRepository = redisClient.fetchRepository(userSchema);
    this.jwt = configService.get<IJwt>('jwt');
  }

  public async register({
    email,
    name,
    password1,
    password2,
  }: RegisterDto): Promise<string> {
    // Check if passwords match
    if (password1 !== password2)
      throw new BadRequestException('Passwords do not match');

    email = email.toLowerCase(); // so its always consistent and lowercase.
    const count = await this.usersRepository
      .search()
      .where('email')
      .equals(email)
      .count();

    // We use the count to check if the email is already in use.
    if (count > 0) throw new BadRequestException('Email already in use');

    // Create the user with a hashed password
    const user = await this.usersRepository.createAndSave({
      email,
      name: name // Capitalize and trim the name
        .trim()
        .replace(/\n/g, ' ')
        .replace(/\s\s+/g, ' ')
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase())),
      password: await hash(password1, 10),
      createdAt: new Date(),
    });
    return this.generateToken(user); // Generate an access token for the user
  }

  public async login({ email, password }: LoginDto): Promise<string> {
    // Find the first user with a given email
    const user = await this.usersRepository
      .search()
      .where('email')
      .equals(email.toLowerCase())
      .first();

    // Check if the user exists and the password is valid
    if (!user || (await compare(password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user); // Generate an access token for the user
  }

  public async remove(id: string, password: string): Promise<string> {
    const user = await this.userById(id);
    if (!(await compare(password, user.password)))
      throw new BadRequestException('Invalid password');
    await this.usersRepository.remove(id);
    return 'User deleted successfully';
  }

  public async userById(id: string): Promise<User> {
    const user = await this.usersRepository.fetch(id);
    if (!user || !user.email) throw new NotFoundException('User not found');
    return user;
  }

  public async onModuleInit() {
    await this.usersRepository.createIndex();
  }

  private async generateToken(user: User): Promise<string> {
    return new Promise((resolve) => {
      sign(
        { id: user.entityId },
        this.jwt.secret,
        { expiresIn: this.jwt.time },
        (error, token) => {
          if (error)
            throw new InternalServerErrorException('Something went wrong');

          resolve(token);
        },
      );
    });
  }
}
