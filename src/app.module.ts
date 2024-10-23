import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TablesModule } from './tables/tables.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { LanguageModule } from './language/language.module';
import { MenegerModule } from './meneger/meneger.module';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { WaiterModule } from './waiter/waiter.module';
import { ReservationModule } from './reservation/reservation.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order_detail/order_detail.module';
import { PaymentModule } from './payment/payment.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/qr-codes'),
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AdminModule,
    RestaurantModule,
    TablesModule,
    MenuModule,
    CategoryModule,
    LanguageModule,
    MenegerModule,
    ClientModule,
    AuthModule,
    MailModule,
    WaiterModule,
    ReservationModule,
    OrderModule,
    OrderDetailModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
