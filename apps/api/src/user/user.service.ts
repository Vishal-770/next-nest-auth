import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hash } from 'argon2';
import * as crypto from 'crypto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    const verificationCode = crypto.randomBytes(32).toString('hex');

    const newUser = new this.userModel({
      password: hashedPassword,
      ...user,
      verificationCode,
    });
    return newUser.save();
  }
  async upsertUserWithVerification(createUserDto: CreateUserDto) {
    const { password, email, name } = createUserDto;
    const hashedPassword = await hash(password);
    const verificationCode = crypto.randomBytes(32).toString('hex');

    // Find existing user by email
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser && !existingUser.verified) {
      // Update unverified user with new data
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.verificationCode = verificationCode;
      return existingUser.save();
    } else if (existingUser && existingUser.verified) {
      // If user is already verified, return null or throw error
      return null;
    }

    // Create new user if doesn't exist
    const newUser = new this.userModel({
      email,
      name,
      password: hashedPassword,
      verificationCode,
    });
    return newUser.save();
  }
  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserByVerificationCode(verificationCode: string) {
    return this.userModel.findOne({ verificationCode }).exec();
  }

  async verifyUser(verificationCode: string) {
    const user = await this.userModel.findOne({ verificationCode }).exec();

    if (!user) {
      return null;
    }

    if (user.verified) {
      return { alreadyVerified: true, user };
    }

    user.verified = true;
    // Optional: Clear the verification code after successful verification
    user.verificationCode = '';
    await user.save();

    return { alreadyVerified: false, user };
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }, // Return the updated document
      )
      .exec();
  }
}
