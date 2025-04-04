import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BearerAuthGuard } from '../auth/auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(BearerAuthGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  private validateWorkerRole(userRole: 'USER' | 'WORKER') {
    if (userRole !== 'WORKER') {
      throw new ForbiddenException(
        "You don't have permission to perform this action",
      );
    }
  }

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
    type: Reservation,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'User already has an active reservation',
  })
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    const { id: userId } = req.user;
    const date = new Date(createReservationDto.date);
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    const { id: userId } = req.user;
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  findOne(@Request() req, @Param('id') id: string) {
    const { id: userId } = req.user;
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: "You don't have permission to perform this action",
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    this.validateWorkerRole(req.user.role);
    return this.reservationsService.update(+id, updateReservationDto);
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
  @ApiResponse({ status: 200, description: 'Reservation deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: "You don't have permission to perform this action",
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  remove(@Request() req, @Param('id') id: string) {
    this.validateWorkerRole(req.user.role);
    return this.reservationsService.remove(+id);
  }
}
