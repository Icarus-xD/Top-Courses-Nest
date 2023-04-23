import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewModel } from "./review.model";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
import { REVIEW_NOT_FOUND } from "./review.constants";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { UserEmail } from "src/decorators/user-email.decorator";
import { IdValidationPipe } from "src/pipes/id-validation.pipe";

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);

    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}