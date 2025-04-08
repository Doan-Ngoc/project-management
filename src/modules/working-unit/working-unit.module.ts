import { Module } from '@nestjs/common';
import { WorkingUnitService } from './working-unit.service';
import { WorkingUnitController } from './working-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import WorkingUnit from './working-unit.entity';

@Module({
  controllers: [WorkingUnitController],
  providers: [WorkingUnitService],
})
export class WorkingUnitModule {}
