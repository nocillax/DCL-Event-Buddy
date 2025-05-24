import { Body, Controller, Get, Post, UseGuards, Request, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingService } from './booking.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}


  @Post()
  async create(@Body() dto: CreateBookingDto, @Request() req) {
    await this.bookingService.createBooking(dto, req.user);
    return { message: 'Booking created successfully' };
    
  }

  @Get('me')
  async getMyBookings(@Request() req) {
    return this.bookingService.getMyBookings(req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.bookingService.cancelBooking(id, req.user.userId);
  }

}