import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../admin/schemas/admin.schema';
import { Meneger, MenegerSchema } from '../meneger/schemas/meneger.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { MailModule } from '../mail/mail.module';
import { AdminModule } from '../admin/admin.module';
import { MenegerModule } from '../meneger/meneger.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Meneger.name, schema: MenegerSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    JwtModule.register({
      secret: process.env.MY_SECRET_KEY || 'MySecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    MailModule,
    AdminModule,
    MenegerModule,
    ClientModule,
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
