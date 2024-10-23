import { PartialType } from '@nestjs/swagger';
import { CreateMenegerDto } from './create-meneger.dto';

export class UpdateMenegerDto extends PartialType(CreateMenegerDto) {}
