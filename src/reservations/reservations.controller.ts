import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BearerAuthGuard } from '../auth/auth.guard';
import { Reservation } from './entities/reservation.entity';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
@UseGuards(BearerAuthGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * Create a new reservation
   */
  @Post()
  @ApiBody({
    type: CreateReservationDto,
    examples: {
      reservation: {
        value: {
          date: '2030-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation created',
    type: CreateReservationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'User already has a reservation',
  })
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    const date = new Date(createReservationDto.date);

    const userId = req.user.id;

    return this.reservationsService.create(userId, date);
  }

  /**
   * Get all reservations from user.
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'User reservations',
    type: [Reservation],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  findAll(@Request() req) {
    const userId = req.user.id;

    return this.reservationsService.findAll(userId);
  }

  /**
   * Get reservation details.
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Reservation ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation details',
    type: Reservation,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;

    return this.reservationsService.findOne(userId, +id);
  }

  /**
   * Update reservation. (Only for workers)
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Reservation ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated',
    type: Reservation,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const role = req.user.role as 'USER' | 'WORKER';
    if (role !== 'WORKER') {
      throw new ForbiddenException(
        "You don't have permission to update a reservation",
      );
    }

    const userId = req.user.id;
    return this.reservationsService.update(userId, +id, updateReservationDto);
  }

  /**
   * Delete reservation. (Only for workers)
   */
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Reservation ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation deleted',
    type: Reservation,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  remove(@Request() req, @Param('id') id: string) {
    const role = req.user.role as 'USER' | 'WORKER';
    if (role !== 'WORKER') {
      throw new ForbiddenException(
        "You don't have permission to delete a reservation",
      );
    }

    return this.reservationsService.remove(+id);
  }
}
