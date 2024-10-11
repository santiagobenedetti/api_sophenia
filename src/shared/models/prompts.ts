import { SuggestWorkOrderTasksAssignationsDto } from 'src/openai/dtos/suggestWorkOrderTasksAssignations.dto';

export const mapTasksAssignationPrompts = ({
  workers,
  tasks,
}: SuggestWorkOrderTasksAssignationsDto) => {
  // Describimos las tareas y los operarios
  const workerDescriptions = workers
    .map((worker) => `${worker.fullname} (ID: ${worker.id})`)
    .join(', ');

  const taskDescriptions = tasks
    .map(
      (task, index) =>
        `${index + 1}. ${task.title} (ID: ${task.id}) - ${task.description} - Estimación de horas: ${
          task.estimatedHours || 'no disponible'
        }`,
    )
    .join('\n');

  const systemContent = `
    Eres un sistema de gestión inteligente para bodegas de vino. Tu objetivo es distribuir tareas entre los operarios de manera equilibrada, considerando la carga de trabajo y el tiempo estimado de cada tarea. Asegúrate de que cada operario reciba una carga de trabajo razonable, sin sobrecargar a nadie.
  `;

  const userContent = `
    Aquí tienes la lista de operarios: ${workerDescriptions}.

    A continuación, se describen las tareas que deben ser asignadas:

    ${taskDescriptions}

    Tu tarea es asignar las tareas a los operarios de manera equitativa, balanceando la cantidad de horas de trabajo asignadas entre todos. Para cada tarea, proporciona el ID del operario al que debe ser asignada.
  `;

  return { systemContent, userContent };
};
