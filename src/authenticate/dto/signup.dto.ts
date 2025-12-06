/**
 * Data transfer object for user registration.  Field names follow the
 * competition specification exactly.
 */
export class SignUpDto {
  mberId!: string;
  mberPassword!: string;
  mberNm!: string;
}