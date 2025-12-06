import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

/**
 * The authenticate controller exposes sign‑up, sign‑in and sign‑out endpoints
 * matching the competition specification.  Request bodies are form encoded
 * by default when using Talend or similar tools.  Responses are wrapped in
 * the competition result format.
 */
@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly authService: AuthenticateService) {}

  /**
   * Register a new user.  Returns the member ID when successful.
   */
  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    const result = await this.authService.signup(dto);
    return { STATUS_CD: 'S0000', STATUS_MSG: 'SUCCESS', RESULT: result };
  }

  /**
   * Sign in an existing user.  Returns a token on success.
   */
  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    const result = await this.authService.signin(dto);
    return { STATUS_CD: 'S0000', STATUS_MSG: 'SUCCESS', RESULT: result };
  }

  /**
   * Sign out the currently authenticated user.  The token is read from the
   * Authorization header.  Always returns success.
   */
  @Get('signout')
  async signout(@Headers('authorization') authorization: string) {
    const token = authorization?.split(' ')[1];
    if (token) {
      await this.authService.signout(token);
    }
    return { STATUS_CD: 'S0000', STATUS_MSG: 'SUCCESS', RESULT: null };
  }
}