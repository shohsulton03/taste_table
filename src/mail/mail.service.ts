import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../admin/schemas/admin.schema';
import { Meneger, MenegerDocument } from '../meneger/schemas/meneger.schema';
import { Client, ClientDocument } from '../client/schemas/client.schema';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Meneger.name) private menegerModel: Model<MenegerDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  // URL yaratish funksiyasi
  private createActivationUrl(path: string, activationLink: string): string {
    const port = process.env.PORT ? `:${process.env.PORT}` : '';
    return `${process.env.API_URL}${port}${path}/${activationLink}`;
  }

  // Admin uchun tasdiqlash email jo'natish
  async sendAdminConfirmation(adminId: string): Promise<void> {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const url = this.createActivationUrl(
      '/api/admin/activate',
      admin.activation_link,
    );

    try {
      await this.mailerService.sendMail({
        to: admin.email,
        subject: 'Stadium App ga xush kelibsiz!',
        template: './confirm', // Handlebars shabloni nomi
        context: {
          full_name: admin.full_name, // Dinamik ma'lumotlar
          email: admin.email,
          url,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new InternalServerErrorException('Email yuborishda xatolik!');
    }
  }

  // Meneger uchun tasdiqlash email jo'natish
  async sendMenegerConfirmation(menegerId: string): Promise<void> {
    const meneger = await this.menegerModel.findById(menegerId);
    if (!meneger) {
      throw new NotFoundException('Meneger not found');
    }

    const url = this.createActivationUrl(
      '/api/meneger/activate',
      meneger.activation_link,
    );

    try {
      await this.mailerService.sendMail({
        to: meneger.email,
        subject: 'Stadium App ga xush kelibsiz!',
        template: './confirm', // Handlebars shabloni nomi
        context: {
          full_name: meneger.full_name, // Dinamik ma'lumotlar
          email: meneger.email,
          url,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new InternalServerErrorException('Email yuborishda xatolik!');
    }
  }

  // Client uchun tasdiqlash email jo'natish
  async sendClientConfirmation(clientId: string): Promise<void> {
    const client = await this.clientModel.findById(clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const url = this.createActivationUrl(
      '/api/client/activate',
      client.activation_link,
    );

    try {
      await this.mailerService.sendMail({
        to: client.email,
        subject: 'Stadium App ga xush kelibsiz!',
        template: './confirm', // Handlebars shabloni nomi
        context: {
          full_name: client.username, // Client uchun username
          email: client.email,
          url,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new InternalServerErrorException('Email yuborishda xatolik!');
    }
  }

  // Har xil foydalanuvchiga umumiy email yuborish
  async sendCustomEmail(
    email: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: template,
        context: context,
      });
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new InternalServerErrorException('Email yuborishda xatolik!');
    }
  }
}
