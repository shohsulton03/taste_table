import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { Admin, AdminDocument } from '../admin/schemas/admin.schema';
import { Meneger, MenegerDocument } from '../meneger/schemas/meneger.schema';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import { MailService } from '../mail/mail.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { CreateMenegerDto } from '../meneger/dto/create-meneger.dto';
import { AdminService } from '../admin/admin.service';
import { MenegerService } from '../meneger/meneger.service';
import { ClientService } from '../client/client.service';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { SignInMenegerDto } from './dto/signIn-meneger.dto';
import { SignInAdminDto } from './dto/signIn-admin.dto';
import { SignInClientDto } from './dto/signIn-client.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Meneger.name) private menegerModel: Model<MenegerDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly adminService: AdminService,
    private readonly menegerService: MenegerService,
    private readonly clientService: ClientService,
  ) {}

  // Admin uchun token generatsiyasi
  async generateTokensAdmin(admin: AdminDocument) {
    const payload = {
      sub: admin._id,
      email: admin.email,
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

    return { access_token, refresh_token };
  }

  // Admin ro'yxatdan o'tishi
  async signUpAdmin(createAdminDto: CreateAdminDto, res: Response) {
    const candidate = await this.adminService.findAdminByEmail(
      createAdminDto.email,
    );
    if (candidate) {
      throw new BadRequestException('Bunday admin mavjud!');
    }

    const { password, confirm_password } = createAdminDto;
    if (password !== confirm_password) {
      throw new BadRequestException('Parollar mos emas');
    }

    const hashed_password = await bcrypt.hash(password, 7);

    const newAdmin = await this.adminModel.create({
      ...createAdminDto,
      hashed_password,
    });

    const tokens = await this.generateTokensAdmin(newAdmin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    newAdmin.hashed_refresh_token = hashed_refresh_token;
    await newAdmin.save();

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF himoyasi
      maxAge: Number(process.env.REFRESH_TIME_MS),
    });

    return {
      message: 'Admin registered successfully',
      access_token: tokens.access_token,
      admin: newAdmin,
    };
  }

  // Admin tizimga kirishi
  async signInAdmin(signInAdminDto: SignInAdminDto, res: Response) {
    const { email, password } = signInAdminDto;
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, admin.hashed_password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokensAdmin(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    await this.adminModel.findByIdAndUpdate(admin._id, {
      hashed_refresh_token,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF hujumlariga qarshi
      maxAge: Number(process.env.REFRESH_TIME_MS),
    });

    return {
      admin,
      access_token: tokens.access_token,
    };
  }

  // Admin tizimdan chiqishi
  async signOutAdmin(refreshToken: string, res: Response) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const admin = await this.adminModel.findById(payload.id);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const validRefreshToken = await bcrypt.compare(
      refreshToken,
      admin.hashed_refresh_token,
    );
    if (!validRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.adminModel.findByIdAndUpdate(admin._id, {
      hashed_refresh_token: null,
    });

    res.clearCookie('refresh_token');

    return {
      message: 'Admin successfully logged out',
    };
  }

  // Admin uchun tokenlarni yangilash
  async refreshTokensAdmin(refresh_token: string, res: Response) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const admin = await this.adminModel.findById(payload.id);
      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      const valid_refresh_token = await bcrypt.compare(
        refresh_token,
        admin.hashed_refresh_token,
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException('Unauthorized admin');
      }

      const tokens = await this.generateTokensAdmin(admin);
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

      await this.adminModel.findByIdAndUpdate(admin._id, {
        hashed_refresh_token,
      });

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // CSRF himoyasi uchun
        maxAge: Number(process.env.REFRESH_TIME_MS),
      });

      return {
        access_token: tokens.access_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // Menegerlar uchun JWT tokenlarini generatsiya qilish
  async generateTokensMeneger(meneger: any) {
    const payload = {
      id: meneger._id,
      is_active: meneger.is_active,
      is_owner: meneger.is_owner,
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

    return { access_token, refresh_token };
  }

  // Menegerlarni ro'yxatdan o'tkazish (Admin emas)
  async signUpMeneger(createMenegerDto: CreateMenegerDto, res: Response) {
    const meneger = await this.menegerService.findMenegerByEmail(
      createMenegerDto.email,
    );
    if (meneger) {
      throw new BadRequestException('Meneger already exists');
    }

    const { password, confirm_password } = createMenegerDto;
    if (password !== confirm_password) {
      throw new BadRequestException('Parollar mos emas');
    }

    const hashed_password = await bcrypt.hash(password, 7);

    const newMeneger = new this.clientModel({
      ...createMenegerDto,
      hashed_password,
      activation_link: uuidv4(),
    });

    const tokens = await this.generateTokensMeneger(newMeneger);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    newMeneger.hashed_refresh_token = hashed_refresh_token;

    await this.clientModel.findByIdAndUpdate(newMeneger._id, {
      hashed_refresh_token,
    });
    await newMeneger.save();

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(process.env.REFRESH_TIME_MS),
    });

    // // Email yuborish
    // try {
    //   await this.mailService.sendMenegerConfirmation(newMeneger._id);
    // } catch (error) {
    //   console.error(error);
    //   throw new InternalServerErrorException('Error sending email');
    // }

    const response = {
      message: 'Meneger registered successfully',
      access_token: tokens.access_token,
      user: newMeneger,
    };

    return response;
  }

  // Umumiy foydalanuvchini tizimga kiritish
  async signInMeneger(signInMenegerDto: SignInMenegerDto, res: Response) {
    const { email, password } = signInMenegerDto;
    const meneger = await this.menegerModel.findOne({ email });
    if (!meneger) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, meneger.hashed_password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokensMeneger(meneger);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    await this.menegerModel.findByIdAndUpdate(meneger._id, {
      hashed_refresh_token,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF hujumlariga qarshi himoya
      maxAge: Number(process.env.REFRESH_TIME_MS),
    });

    return {
      meneger,
      access_token: tokens.access_token,
    };
  }

  // Tizimdan chiqish
  async signOutMeneger(refreshToken: string, res: Response) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const meneger = await this.menegerModel.findById(payload.sub);
    if (!meneger) {
      throw new BadRequestException('Meneger not found');
    }

    const validRefreshToken = await bcrypt.compare(
      refreshToken,
      meneger.hashed_refresh_token,
    );
    if (!validRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.menegerModel.findByIdAndUpdate(meneger._id, {
      hashed_refresh_token: null,
    });
    res.clearCookie('refresh_token');

    return {
      message: 'meneger successfully logged out',
    };
  }

  // Client Tokenlarni yangilash
  async refreshTokensMeneger(refresh_token: string, res: Response) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const meneger = await this.clientModel.findById(payload.sub);
      if (!meneger) {
        throw new UnauthorizedException('meneger not found');
      }

      const valid_refresh_token = await bcrypt.compare(
        refresh_token,
        meneger.hashed_refresh_token,
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException('Unauthorized meneger');
      }

      const tokens = await this.generateTokensMeneger(meneger);
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

      await this.clientModel.findByIdAndUpdate(meneger._id, {
        hashed_refresh_token,
      });

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // CSRF himoyasi uchun
        maxAge: Number(process.env.REFRESH_TIME_MS),
      });

      return {
        access_token: tokens.access_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // Client uchun JWT tokenlarini generatsiya qilish
  async generateTokensClient(client: any) {
    const payload = {
      id: client._id,
      is_active: client.is_active,
      is_owner: client.is_owner,
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

    return { access_token, refresh_token };
  }

  // Umumiy foydalanuvchini ro'yxatdan o'tkazish (Admin emas)
  async signUpClient(createClientDto: CreateClientDto, res: Response) {
    const meneger = await this.clientService.findClientByEmail(
      createClientDto.email,
    );
    if (meneger) {
      throw new BadRequestException('Meneger already exists');
    }

    const { password, confirm_password } = createClientDto;
    if (password !== confirm_password) {
      throw new BadRequestException('Parollar mos emas');
    }

    const hashed_password = await bcrypt.hash(password, 7);

    const newClient = new this.clientModel({
      ...createClientDto,
      hashed_password,
      activation_link: uuidv4(),
    });

    const tokens = await this.generateTokensClient(newClient);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    newClient.hashed_password = hashed_refresh_token;
    await this.clientModel.findByIdAndUpdate(newClient._id, {
      hashed_refresh_token,
    });
    await newClient.save();

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: Number(process.env.REFRESH_TIME_MS),
    });

    // // Email yuborish
    // try {
    //   await this.mailService.sendMenegerConfirmation(newClient._id);
    // } catch (error) {
    //   console.error(error);
    //   throw new InternalServerErrorException('Error sending email');
    // }

    const responce = {
      message: 'Meneger registered successfully',
      access_token: tokens.access_token,
      user: newClient,
    };

    return responce;
  }

  // Client foydalanuvchini tizimga kiritish
  async signInClient(signInClientDto: SignInClientDto, res: Response) {
    const { email, password } = signInClientDto;
    const client = await this.clientModel.findOne({ email });
    if (!client) {
      throw new BadRequestException('client not found');
    }

    const isMatch = await bcrypt.compare(password, client.hashed_password);
    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    const tokens = await this.generateTokensClient(client);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    await this.adminModel.findByIdAndUpdate(client._id, {
      hashed_refresh_token,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF hujumlariga qarshi
      maxAge: Number(process.env.REFRESH_TIME_MS),
    });

    return {
      client,
      access_token: tokens.access_token,
    };
  }

  // Tizimdan chiqish
  async signOutClient(refreshToken: string, res: Response) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const client = await this.clientModel.findById(payload.sub);
    if (!client) {
      throw new BadRequestException('client not found');
    }

    const validRefreshToken = await bcrypt.compare(
      refreshToken,
      client.hashed_refresh_token,
    );
    if (!validRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.clientModel.findByIdAndUpdate(client._id, {
      hashed_refresh_token: null,
    });
    res.clearCookie('refresh_token');

    return {
      message: 'client successfully logged out',
    };
  }

  // Tokenlarni yangilash
  async refreshTokensClient(refresh_token: string, res: Response) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const client = await this.clientModel.findById(payload.sub);
      if (!client) {
        throw new UnauthorizedException('client not found');
      }

      const valid_refresh_token = await bcrypt.compare(
        refresh_token,
        client.hashed_refresh_token,
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException('Unauthorized client');
      }

      const tokens = await this.generateTokensClient(client);
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 3);

      await this.clientModel.findByIdAndUpdate(client._id, {
        hashed_refresh_token,
      });

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // CSRF himoyasi uchun
        maxAge: Number(process.env.REFRESH_TIME_MS),
      });

      return {
        access_token: tokens.access_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
