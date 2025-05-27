import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  eventDate: string;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column()
  location: string;

  @Column()
  imageUrl: string;

  @Column()
  maxSeats: number;

  @Column({ default: 0 })
  bookedSeats: number;

  @Column()
  tags: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
