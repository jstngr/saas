import { Strategy } from 'passport-magic-link';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private mailService: MailService,
  ) {
    super(
      {
        secret: configService.get('JWT_SECRET'),
        userFields: ['email'],
        tokenField: 'token',
        verifyUserAfterToken: true,
        ttl: 15 * 60, // 15 minutes in seconds
      },
      // Send token function
      async (user, token) => {
        await this.mailService.sendMagicLink(user, token);
        return true;
      },
      // Verify user function
      async (user) => {
        return this.authService.findOrCreateUserByEmail(user.email);
      },
    );
  }
}
