import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  async create(data: CreateEventDto & { imageUrl: string }) {
    const event = this.eventRepo.create(data);
    return this.eventRepo.save(event);
  }

  async findAll(upcoming: boolean | null = null) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];       // 'YYYY-MM-DD'
  const currentTime = now.toTimeString().split(' ')[0]; // 'HH:mm:ss'

  const query = this.eventRepo.createQueryBuilder('event');

  if (upcoming === true) {
    // Upcoming = date > today OR same day but time > now
    query.where('event.eventDate > :today', { today })
         .orWhere('event.eventDate = :today AND event.eventTime > :now', {
           today,
           now: currentTime,
         });
  } else if (upcoming === false) {
    // Past = date < today OR same day but time <= now
    query.where('event.eventDate < :today', { today })
         .orWhere('event.eventDate = :today AND event.eventTime <= :now', {
           today,
           now: currentTime,
         });
  }

  return query
    .orderBy('event.eventDate', 'ASC')
    .addOrderBy('event.eventTime', 'ASC')
    .getMany();
}


  async findOne(id: number) {
    const event = await this.eventRepo.findOneBy({ id });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

async update(id: number, data: Partial<Event>) {
  if (!data || Object.keys(data).length === 0) {
    throw new BadRequestException('Update payload cannot be empty');
  }

  const event = await this.eventRepo.findOneBy({ id });
  if (!event) throw new NotFoundException('Event not found');


  if (
    data.maxSeats !== undefined &&
    data.maxSeats < event.bookedSeats
  ) {
    throw new BadRequestException(
      `maxSeats (${data.maxSeats}) cannot be less than currently booked (${event.bookedSeats})`,
    );
  }

  await this.eventRepo.update(id, data);
  return this.findOne(id);
}


  async delete(id: number) {
    return this.eventRepo.delete(id);
  }
}
