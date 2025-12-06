import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface User {
  mberId: string;
  mberPassword: string;
  mberNm: string;
}

/**
 * Simple in-memory authentication service.  In a production environment
 * credentials would be hashed and stored in a database.  Here we mimic
 * behaviour sufficient for the competition: user accounts can be created
 * once, tokens can be issued on sign‑in, and token validation is
 * supported.
 */
@Injectable()
export class AuthenticateService {
  private users = new Map<string, User>();
  private tokens = new Map<string, string>(); // token -> mberId

  /**
   * Register a new user.  Throws if the ID already exists.
   */
  async signup(dto: { mberId: string; mberPassword: string; mberNm: string }) {
    if (this.users.has(dto.mberId)) {
      throw new Error('User already exists');
    }
    this.users.set(dto.mberId, {
      mberId: dto.mberId,
      mberPassword: dto.mberPassword,
      mberNm: dto.mberNm,
    });
    return { mberId: dto.mberId };
  }

  /**
   * Authenticate a user and issue a token.  Token is a random uppercase
   * hex string derived from a UUID.  Credentials are checked verbatim.
   */
  async signin(dto: { mberId: string; mberPassword: string }) {
    const user = this.users.get(dto.mberId);
    if (!user || user.mberPassword !== dto.mberPassword) {
      throw new Error('Invalid credentials');
    }
    const token = uuidv4().replace(/-/g, '').toUpperCase();
    this.tokens.set(token, user.mberId);
    return { tkn: token };
  }

  /**
   * Sign a user out by invalidating their token.
   */
  async signout(token: string) {
    if (this.tokens.has(token)) {
      this.tokens.delete(token);
    }
  }

  /**
   * Validate a bearer token.  Returns the associated member ID if valid,
   * otherwise null.
   */
  validateToken(token: string): string | null {
    return this.tokens.get(token) ?? null;
  }
}