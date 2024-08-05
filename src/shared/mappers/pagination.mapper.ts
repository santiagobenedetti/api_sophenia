export const mapGetPaginationDto = (limit, offset, total) => {
  return {
    limit,
    offset,
    total,
    previousOffset: offset - limit >= 0 ? offset - limit : null,
    nextOffset: offset + limit < total ? offset + limit : null,
    totalPages: Math.ceil(total / limit),
  };
};
