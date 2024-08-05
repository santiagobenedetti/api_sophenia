import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../constants/tables';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any) {
    const {
      limit = DEFAULT_PAGINATION_LIMIT,
      offset = DEFAULT_PAGINATION_OFFSET,
      ...otherQueryParams
    } = value;

    if (limit && isNaN(limit)) {
      throw new BadRequestException('Limit must be a number.');
    }

    if (offset && isNaN(offset)) {
      throw new BadRequestException('Offset must be a number.');
    }

    return {
      limit: parseInt(limit),
      offset: parseInt(offset),
      ...otherQueryParams,
    };
  }
}
