import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { MailService } from '../../modules/mail/mail.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { API_MESSAGES } from '../../constants/api-messages';
import { MoreThan } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15 * 60 * 1000; // 15 minutes

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(API_MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = await this.hashPassword(registerDto.password);
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const user = this.userRepository.create({
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      email: registerDto.email,
      password: hashedPassword,
      isEmailVerified: true, // change this to false when emails are implemented
      // verificationCode,
      // verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      fullName: `${registerDto.firstname} ${registerDto.lastname}`.trim(),
    });

    await this.userRepository.save(user);
    // await this.mailService.sendVerificationCode(user, verificationCode);

    return {
      message:
        'Registration successful. Please check your email for the verification code.',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(API_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Check if email is verified first
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(API_MESSAGES.AUTH.EMAIL_NOT_VERIFIED);
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(API_MESSAGES.AUTH.ACCOUNT_LOCKED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + this.LOCK_TIME);
        await this.userRepository.save(user);
        throw new UnauthorizedException(API_MESSAGES.AUTH.ACCOUNT_LOCKED);
      }

      await this.userRepository.save(user);
      throw new UnauthorizedException(API_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Save refresh token hash
    user.refreshToken = await this.hashPassword(refreshToken);
    await this.userRepository.save(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async googleLogin(profile: any) {
    let user = await this.userRepository.findOne({
      where: { googleId: profile.id },
    });

    if (!user) {
      // Check if user exists with same email
      user = await this.userRepository.findOne({
        where: { email: profile.emails[0].value },
      });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.isEmailVerified = true;
      } else {
        // Create new user
        user = this.userRepository.create({
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatarUrl: profile.photos[0].value,
          isEmailVerified: true, // Google accounts are pre-verified
        });
      }

      await this.userRepository.save(user);
    }

    return this.login(user);
  }

  async sendMagicLink(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const token = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '15m' },
      );
      user.magicLinkToken = token;
      await this.userRepository.save(user);
      await this.mailService.sendMagicLink(user, token);
    }

    // Always return success to prevent email enumeration
    return { message: 'If an account exists, a magic link has been sent' };
  }

  async verifyEmail(code: string) {
    const user = await this.userRepository.findOne({
      where: {
        verificationCode: code,
        verificationCodeExpiresAt: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async resendVerificationCode(email: string) {
    const user = await this.userRepository.findOne({
      where: { email, isEmailVerified: false },
    });

    if (!user) {
      // Return success to prevent email enumeration
      return {
        message:
          'If your email is registered and not verified, you will receive a new verification code.',
      };
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.userRepository.save(user);
    await this.mailService.sendVerificationCode(user, verificationCode);

    return { message: 'A new verification code has been sent to your email.' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const token = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '15m' },
      );
      user.resetPasswordToken = token;
      await this.userRepository.save(user);
      await this.mailService.sendPasswordResetEmail(user, token);
    }

    // Always return success to prevent email enumeration
    return {
      message: 'If an account exists, a password reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
          resetPasswordToken: token,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      user.password = await this.hashPassword(newPassword);
      user.resetPasswordToken = undefined;
      await this.userRepository.save(user);

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await this.hashPassword(newPassword);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, email: user.email };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Save new refresh token hash
    user.refreshToken = await this.hashPassword(newRefreshToken);
    await this.userRepository.save(user);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async deleteAccount(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: 'Account deleted successfully' };
  }

  async findOrCreateUserByEmail(email: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        email,
        isEmailVerified: true, // Pre-verified for magic link
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
