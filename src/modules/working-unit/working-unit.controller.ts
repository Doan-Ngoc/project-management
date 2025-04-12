import { Controller } from '@nestjs/common';
import { WorkingUnitService } from './services/working-unit.service';

@Controller('working-unit')
export class WorkingUnitController {
  constructor(private readonly workingUnitService: WorkingUnitService) {}
}
