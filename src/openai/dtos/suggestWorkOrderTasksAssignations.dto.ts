export class SuggestWorkOrderTasksAssignationsDto {
  workers: {
    id: string;
    fullname: string;
  }[];
  tasks: {
    id: string;
    title: string;
    description: string;
    requiresTaskReport: boolean;
    estimatedHours?: number;
  }[];
}
