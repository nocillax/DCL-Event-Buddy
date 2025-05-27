import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
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


  async findAll(
  upcoming: boolean | null = null,
  page: number = 1,
  limit: number = 5,
) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];       // 'YYYY-MM-DD'
  const currentTime = now.toTimeString().split(' ')[0]; // 'HH:mm:ss'

  const query = this.eventRepo.createQueryBuilder('event');

  if (upcoming === true) {
    query.where('event.eventDate > :today', { today })
      .orWhere('event.eventDate = :today AND event.startTime > :now', {
        today,
        now: currentTime,
      });
  } else if (upcoming === false) {
    query.where('event.eventDate < :today', { today })
      .orWhere('event.eventDate = :today AND event.startTime <= :now', {
        today,
        now: currentTime,
      });
  }

  const [events, total] = await query
    .orderBy('event.eventDate', 'DESC')
    .addOrderBy('event.startTime', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    events,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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

  async searchEvents(query: string) {
    return this.eventRepo.find({
      where: [
        { title: ILike(`%${query}%`) },
        { location: ILike(`%${query}%`) },
        { tags: ILike(`%${query}%`) },
      ],
      order: {
        eventDate: 'DESC',
      },
    });
  }


}
