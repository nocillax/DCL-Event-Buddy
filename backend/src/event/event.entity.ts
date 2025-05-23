import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  eventDate: string; // format: 'YYYY-MM-DD'

  @Column({ type: 'time' })
  eventTime: string; // format: 'HH:mm:ss'


  @Column()
  location: string;

  @Column()
  imageUrl: string;

  @Column()
  maxSeats: number;

  @Column({ default: 0 })
  bookedSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
