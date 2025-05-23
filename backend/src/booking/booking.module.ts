import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/event/event.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Event, User])],
  providers: [BookingService],
  controllers: [BookingController]

})
export class BookingModule {}
