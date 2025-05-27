import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(100, { message: 'Title must be less than 100 characters' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'Event date is required' })
  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD' })
  eventDate: string;

  @IsNotEmpty({ message: 'Event time is required' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Invalid time format. Use HH:mm:ss (24-hour)',
  })
  startTime: string;

  @IsNotEmpty({ message: 'Event time is required' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Invalid time format. Use HH:mm:ss (24-hour)',
  })
  endTime: string;

  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsInt({ message: 'Max seats must be a number' })
  @Min(1, { message: 'Max seats must be at least 1' })
  maxSeats: number;

  @IsNotEmpty({ message: 'Tags are required' })
  tags: string;
}
