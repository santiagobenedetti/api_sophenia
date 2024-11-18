export enum WorkOrdersRoutesEnum {
  workOrders = '/work-orders',

  workOrderById = '/:id',

  workOrderCurrent = '/current',
  workOrderCurrentByWorker = '/current/worker/:workerId',

  workOrderTasksSuggest = '/suggest',
}
