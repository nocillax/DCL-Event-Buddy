import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Request,
  Put,
  Delete,
  BadRequestException,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/auth.jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getAll(
    @Query('upcoming') upcoming: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const isUpcoming =
      upcoming === 'true' ? true : upcoming === 'false' ? false : null;

    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 5;

    return this.eventService.findAll(isUpcoming, currentPage, perPage);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(@UploadedFile() image: Express.Multer.File, @Body() raw: any) {
    const dto: CreateEventDto = {
      ...raw,
      maxSeats: Number(raw.maxSeats),
    };

    const imageUrl = image ? `/uploads/${image.filename}` : '';

    return this.eventService.create({ ...dto, imageUrl });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() raw: any,
    @Request() req,
  ) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException('Only admins can update events');
    }

    if (!raw || Object.keys(raw).length === 0) {
      throw new BadRequestException('Update payload cannot be empty');
    }

    const dto: any = {
      ...raw,
      maxSeats: raw.maxSeats ? parseInt(raw.maxSeats) : undefined,
    };

    if (image) {
      dto.imageUrl = `/uploads/${image.filename}`;
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

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('upcoming') upcoming?: string,
  ) {
    const isUpcoming =
      upcoming === 'true' ? true : upcoming === 'false' ? false : null;

    if (search) {
      return this.eventService.searchEvents(search);
    }

    return this.eventService.findAll(isUpcoming);
  }
}
