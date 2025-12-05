import { IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(4)
  @Matches(/^\S+$/, { message: '공백 없이 입력해주세요.' })
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  displayName: string;
}
