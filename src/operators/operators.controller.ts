import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { Request } from 'express';
import { User } from 'src/users/models/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/http-jwt.guard';
import { ParseMongoIdPipe } from 'src/common/parse-objectId.pipe';

@UseGuards(JwtAuthGuard)
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createOperatorDto: CreateOperatorDto,
  ) {
    return this.operatorsService.create(req.user as User, createOperatorDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.operatorsService.findAllByUser(req.user as User);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return this.operatorsService.findOne(req.user as User, id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateOperatorDto: UpdateOperatorDto,
  ) {
    return this.operatorsService.update(
      req.user as User,
      id,
      updateOperatorDto,
    );
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id', ParseMongoIdPipe) id: string) {
    return this.operatorsService.remove(req.user as User, id);
  }
}
