/**
 * DTO for registering a new car.  Name and number are required.  The file
 * upload (if any) is handled separately via Multer and does not appear
 * within this DTO.
 */
export class RegisterCarDto {
  carNm!: string;
  carNo!: string;
}