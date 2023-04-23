import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { AuthController } from "./auth.controller";
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getJwtConfig } from "src/configs/jwt.config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  controllers: [AuthController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      }
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    PassportModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
