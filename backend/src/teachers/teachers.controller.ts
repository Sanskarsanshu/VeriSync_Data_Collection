import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() data: any) {
    return this.teachersService.create(data);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.teachersService.update(id, data);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
