import { Pagination } from './tables';

// TODO: Add additional properties to the GetCardsQueryParams type if needed
export type GetUsersQueryParams = Pagination & {
  role?: string;
};
