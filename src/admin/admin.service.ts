import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(admin: AdminDocument) {
    const payload = {
      id: admin._id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  // async create(createAdminDto: CreateAdminDto, res: Response) {
  //   const { password, confirm_password } = createAdminDto;
  //   if (password !== confirm_password) {
  //     throw new BadRequestException('Parollar mos emas');
  //   }

  //   const hashed_password = await bcrypt.hash(password, 7);

  //   const newAdmin = await this.adminModel.create({
  //     ...createAdminDto,
  //     hashed_password,
  //   });

  //   const tokens = await this.generateTokens(newAdmin);
  //   const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
  //   newAdmin.hashed_password = hashed_refresh_token;
  //   await newAdmin.save();

  //   res.cookie('refresh_token', tokens.refresh_token, {
  //     httpOnly: true,
  //     maxAge: Number(process.env.REFRESH_TIME_MS),
  //   });

  //   const response = {
  //     message: 'Admin created successfully!',
  //     access_token: tokens.access_token,
  //     id: newAdmin._id,
  //   };

  //   return response;
  // }

  async create(createAdminDto: CreateAdminDto, res: Response) {
    const newAdmin = await this.adminModel.create(createAdminDto);
    return newAdmin;
  }

  async findAdminByEmail(login: string): Promise<Admin> {
    return this.adminModel.findOne({
      where: { login },
      include: {
        all: true,
        attributes: ['value'],
        through: { attributes: [] },
      },
    });
    // console.log(admin)
  }

  async findAll() {
    return this.adminModel.find();
  }

  async findOne(id: string) {
    return this.adminModel.findById(id);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      id,
      updateAdminDto,
      { new: true },
    );
    return updatedAdmin;
  }

  async remove(id: string) {
    return this.adminModel.findByIdAndDelete(id);
    // return this.adminModel.findOneAndDelete({_id: id});
    // return this.adminModel.deleteOne({_id: id});
  }
}
