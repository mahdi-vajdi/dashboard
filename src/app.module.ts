import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ChannelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
