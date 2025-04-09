import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientRepository } from './client.repository';
import { JwtModule } from '../jwt/jwt.module';
@Module({
  imports: [TypeOrmModule.forFeature([Client]), JwtModule],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
  exports: [ClientService],
})
export class ClientModule {}
