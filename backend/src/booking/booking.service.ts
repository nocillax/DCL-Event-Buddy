import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from 'src/user/user.entity';
import { Event } from 'src/event/event.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Event)
    private eventRepo: Repository<Event>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createBooking(dto: CreateBookingDto, user: any) {
    const usr = await this.userRepo.findOneBy({ id: user.userId });
    if (!usr) throw new NotFoundException('User not found');

    const event = await this.eventRepo.findOneBy({ id: dto.eventId });
    if (!event) throw new NotFoundException('Event not found');

    const now = new Date();
    const eventDate = new Date(`${event.eventDate}T${event.startTime}`);
    if (eventDate <= now) {
      throw new BadRequestException('Cannot book a past event');
    }

    if (event.bookedSeats + dto.seats > event.maxSeats) {
      throw new BadRequestException('Not enough seats available');
    }

    event.bookedSeats += dto.seats;
    await this.eventRepo.save(event);

    const booking = this.bookingRepo.create({
      event,
      user: usr,
      seats: dto.seats,
    });

    await this.bookingRepo.save(booking);
  }

  async cancelBooking(bookingId: number, userId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['event', 'user'],
    });

    if (!booking || booking.user.id !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings.');
    }

    booking.event.bookedSeats -= booking.seats;
    await this.eventRepo.save(booking.event);

    return this.bookingRepo.remove(booking);
  }

  async getMyBookings(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }
}
