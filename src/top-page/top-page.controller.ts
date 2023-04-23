import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TopPageModel } from "./top-page.model";
import { FindTopPageDto } from "./dto/find-top-page.dto";
import { CreateTopPageDto } from "./dto/create-top-page.dto";
import { TopPageService } from "./top-page.service";
import { IdValidationPipe } from "src/pipes/id-validation.pipe";
import { NOT_FOUND_TOP_PAGE_ERROR } from "./top-page.constants";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { HhService } from "src/hh/hh.service";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly topPageService: TopPageService,
    private readonly hhService: HhService,
    private readonly scheduleRegistry: SchedulerRegistry,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.findById(id);

    if (!topPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }

    return topPage;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const topPage = await this.topPageService.findByAlias(alias);

    if (!topPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }

    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string, 
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedTopPage = await this.topPageService.updateById(id, dto);

    if (!updatedTopPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }

    return updatedTopPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedTopPage = await this.topPageService.deleteById(id);

    if (!deletedTopPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }

    return deletedTopPage;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'test' })
  @Post('test')
  private async test() {
    const job = this.scheduleRegistry.getCronJob('test');

    const data = await this.topPageService.findForHhUpdate(new Date());

    for (let page of data) {
      const hhData = await this.hhService.getData(page.category);
      page.hh = hhData;
      await this.topPageService.updateById(page._id, page);
    }
  }

}
