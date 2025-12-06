/**
 * DTO for user login.  Only an ID and password are required.
 */
export class SignInDto {
  mberId!: string;
  mberPassword!: string;
}