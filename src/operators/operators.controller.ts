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
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-objectId.pipe';
import { JwtPayload } from 'src/auth/auth.service';

@UseGuards(AccessTokenGuard)
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createOperatorDto: CreateOperatorDto,
  ) {
    return this.operatorsService.create(
      req.user as JwtPayload,
      createOperatorDto,
    );
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.operatorsService.findByAdmin(req.user as JwtPayload);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return this.operatorsService.findOneById(req.user as JwtPayload, id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateOperatorDto: UpdateOperatorDto,
  ) {
    return this.operatorsService.findOneByIdAndUpdate(
      req.user as JwtPayload,
      id,
      updateOperatorDto,
    );
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id', ParseMongoIdPipe) id: string) {
    return this.operatorsService.deleteOneById(req.user as JwtPayload, id);
  }
}
