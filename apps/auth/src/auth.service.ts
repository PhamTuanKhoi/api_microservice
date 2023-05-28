import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import {
  FriendRequestRepositoryInterface,
  UserJwt,
  UserRepositoryInterface,
} from '@app/shared';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    @Inject('FriendRequestServiceInterface')
    private readonly friendRequestRepository: FriendRequestRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async getusers() {
    return this.usersRepository.findAll();
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByCondition({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'password'],
    });
  }

  async postUser() {
    return this.usersRepository.save({ firstName: 'mercdess' });
  }

  async register(createUserDto: Readonly<CreateUserDto>) {
    let { password, email } = createUserDto;

    const user = await this.findByEmail(email);

    if (user) throw new ConflictException('email already exists!');

    password = await bcrypt.hashSync(password, 10);

    const created = await this.usersRepository.save({
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

  // Decode: Giải mã chuỗi JWT để truy xuất thông tin bên trong, nhưng không xác thực tính hợp lệ của JWT.
  // Verify: Kiểm tra tính hợp lệ của JWT bằng cách xác minh chữ ký và các điều kiện khác, đảm bảo rằng JWT không
  // chỉ đúng về cú pháp mà còn là một JWT hợp lệ và chưa bị sửa đổi.

  async getUserFromHeader(jwt: string) {
    if (!jwt) return;
    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createFriend(userId: number, friendId: number) {
    try {
      const creator = await this.usersRepository.findOneById(userId);
      const receiver = await this.usersRepository.findOneById(friendId);

      if (creator === null || receiver === null)
        throw new Error('user not found');

      return this.friendRequestRepository.save({ creator, receiver });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getFriend(userId: number) {
    const creator = await this.usersRepository.findOneById(userId);

    return this.friendRequestRepository.findWithRelations({
      where: [{ creator }, { receiver: creator }],
      relations: ['creator', 'receiver'],
    });
  }
}
