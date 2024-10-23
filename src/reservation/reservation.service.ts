import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tables, TablesDocument } from '../tables/schemas/table.schema';
import { Client, ClientDocument } from '../client/schemas/client.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(Tables.name)
    private tablesModel: Model<TablesDocument>,
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { table_id, client_id } = createReservationDto;
    const table = await this.tablesModel.findById(table_id);
    const client = await this.clientModel.findById(client_id);
    if (!table && !client) {
      throw new BadRequestException("Bunday Stol va Mijoz yo'q");
    }

    const newReservation =
      await this.reservationModel.create(createReservationDto);

    return newReservation;
  }

  async findAll() {
    return this.reservationModel
      .find()
      .populate('table_id')
      .populate('client_id');
  }

  async findOne(id: string) {
    return this.reservationModel
      .findById(id)
      .populate('table_id')
      .populate('client_id');
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, { new: true })
      .populate('table_id')
      .populate('client_id');
  }

  async remove(id: string) {
    return this.reservationModel.findByIdAndDelete(id);
  }
}
