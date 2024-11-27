export enum TasksRoutesEnum {
  tasks = '/tasks',

  backlog = '/backlog',
  uploadImage = '/upload-image',
  taskById = '/:id',
  taskStatus = '/:id/status',
  completeTask = '/:id/complete',
  rateTask = '/:id/rate',
  suggestTasks = '/suggest',
  getTasksAssignedToWorker = '/worker/:workerId',
  assignTasksToWorker = '/assign',
}
