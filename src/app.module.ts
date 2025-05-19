import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { configJwtModule, configModuleOptions } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/postgresql.config';
import { JwtModule } from '@nestjs/jwt';
import { ResourcesModule } from './modules/resources/resources.module';
import { ReservationModule } from './modules/reservations/reservation.module';
import { PaymentModule } from './modules/payments/payment.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AwsModule } from './modules/aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'images'),
      serveRoot: '/resources/images',
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    JwtModule.registerAsync({
      inject: [configJwtModule.KEY],
      useFactory: async (
        configService: ConfigType<typeof configJwtModule>,
      ) => ({
        secret: configService.JWT_SECRET,
        signOptions: {
          expiresIn: configService.JWT_EXPIRES_IN,
        },
      }),
    }),
    AuthModule,
    UsersModule,
    ResourcesModule,
    ReservationModule,
    PaymentModule,
    NotificationModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
