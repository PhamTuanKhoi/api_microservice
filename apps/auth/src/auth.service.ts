import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getusers() {
    return this.userRepository.find();
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'password'],
    });
  }

  async postUser() {
    return this.userRepository.save({ firstName: 'mercdess' });
  }

  async register(createUserDto: Readonly<CreateUserDto>) {
    let { password, email } = createUserDto;

    const user = await this.findByEmail(email);

    if (user) throw new ConflictException('email already exists!');

    password = await bcrypt.hashSync(password, 10);

    const created = await this.userRepository.save({
      ...createUserDto,
      password,
    });

    delete created.password;

    return created;
  }

  async validation(loginRequest: LoginUserDto) {
    const { email, password } = loginRequest;

    const user = await this.findByEmail(email);

    if (!user) throw new HttpException(`user incorrect`, HttpStatus.NOT_FOUND);

    const match = await bcrypt.compareSync(password, user.password);

    if (match && user.password) {
      return { ...user };
    }

    return null;
  }

  async login(loginRequest: LoginUserDto) {
    const user = await this.validation(loginRequest);

    const incorrect = !!user;

    if (!incorrect) throw new UnauthorizedException();

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }

  async verifyJwt(jwt: string) {
    if (!jwt) throw new UnauthorizedException();

    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);
      return { user, exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
