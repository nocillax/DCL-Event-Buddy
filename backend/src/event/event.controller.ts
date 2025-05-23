import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, Request, Put, Delete, BadRequestException, Patch } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/auth.jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}


  @Get()
  getAll(@Query('upcoming') upcoming: string) {
    if (upcoming === 'true') return this.eventService.findAll(true);
    if (upcoming === 'false') return this.eventService.findAll(false);
    return this.eventService.findAll();
  }


  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findOne(id);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateEventDto, 
    @Request() req) {
    if (req.user.role !== 'admin') {
      throw new Error('Only admins can create events');
    }
    return this.eventService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateEventDto,
      @Request() req
    ) {
      if (req.user.role !== 'admin') {
        throw new BadRequestException('Only admins can update events');
      }
      return this.eventService.update(id, dto);
    }



  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.role !== 'admin') {
      throw new Error('Only admins can delete events');
    }
    return this.eventService.delete(id);
  }
}