import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'eventId is required' })
  @IsInt({ message: 'eventId must be an integer' })
  eventId: number;

  @IsNotEmpty({ message: 'seats is required' })
  @IsInt({ message: 'seats must be a number' })
  @Min(1, { message: 'Must book at least 1 seat' })
  @Max(4, { message: 'You can book up to 4 seats only' })
  seats: number;
}

