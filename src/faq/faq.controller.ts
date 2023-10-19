import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@UseGuards()
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  findAll(@Query('channel') channelId: string) {
    return this.faqService.findAll(channelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('channel') channelId: string) {
    return this.faqService.findOne(id, channelId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('channel') channelId: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    return this.faqService.update(id, channelId, updateFaqDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Query('channel') channelId: string) {
    return this.faqService.delete(id, channelId);
  }
}
