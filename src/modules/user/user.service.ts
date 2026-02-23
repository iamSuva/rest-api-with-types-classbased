import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AppDataSource } from "../../database/data-source";
import bcrypt from "bcrypt";
import { IRegister, ILogin ,IRegisterResponse,ILoginResponse, IUpdateUser, IUpdateUserResponse} from "./user.types";
import { AppError } from "../../common/errors/AppError";
import { JwtUtil } from "../../common/utils/jwt";

export class UserService {

  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

   async getAllUsers(): Promise<IRegisterResponse[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    })) as IRegisterResponse[];
  }
  async register(data: IRegister): Promise<IRegisterResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(data: ILogin): Promise<ILoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = JwtUtil.generateToken({ id: user.id });

    return { accessToken: token };
  }

  async updateUser(data: IUpdateUser, userId: string): Promise<IUpdateUserResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (data.email) {
      user.email = data.email;
    }
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }
    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    await this.userRepository.delete(userId);
  }
}