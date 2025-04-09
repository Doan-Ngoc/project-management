import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './client.entity';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    return this.clientService.createClient(createClientDto);
  }
}
