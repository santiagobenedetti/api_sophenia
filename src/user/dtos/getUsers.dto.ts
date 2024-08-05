import { Pagination } from 'src/shared/types/tables';
import { GetUserDto } from './getUser.dto';

export class GetUsersDto {
  data: GetUserDto[];
  pagination: Pagination;
}
