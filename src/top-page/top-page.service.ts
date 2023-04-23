import { Injectable } from '@nestjs/common';
import { ModelType } from "@typegoose/typegoose/lib/types";
import { addDays } from "date-fns";
import { Types } from "mongoose";
import { InjectModel } from "nestjs-typegoose";
import { CreateTopPageDto } from "./dto/create-top-page.dto";
import { FindTopPageDto } from "./dto/find-top-page.dto";
import { TopLevelCategory, TopPageModel } from "./top-page.model";

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findByText(text: string) {
    return this.topPageModel.find({
      $text: {
        $search: text,
        $caseSensitive: false,
      },
    }).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate()
      .match({
        firstCategory,
      })
      .group({
        _id: {
          secondCategory: '$secondCategory',
        },
        pages: {
          $push: {
            alias: '$alias',
            title: '$title',
          }
        },
      })
      .exec();
  }

  async findAll() {
    return this.topPageModel.find({}).exec();
  }
  
  async findForHhUpdate(date: Date) {
    return this.topPageModel.find({
      firstCategory: TopLevelCategory.COURSES,
      $or: [
        {
          'hh.updatedAt': {
            $lt: addDays(date, -1),
          },
        },
        {
          'hh.updatedAt': {
            $exists: false,
          },
        }
      ],
    }).exec();
  }

  async updateById(id: string | Types.ObjectId, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }
}
