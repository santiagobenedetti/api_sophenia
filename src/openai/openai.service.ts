import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { zodResponseFormat } from 'openai/helpers/zod';
import { PROMPTS_TO_SUGGEST_TASKS_TO_BE_CREATED } from 'src/shared/constants/prompts';

import { z } from 'zod';
import { SuggestWorkOrderTasksAssignationsDto } from './dtos/suggestWorkOrderTasksAssignations.dto';
import { mapTasksAssignationPrompts } from 'src/shared/models/prompts';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async suggestTasksToBeCreated(seasonMoment: string) {
    const Task = z.object({
      title: z.string(),
      description: z.string(),
      requiresTaskReport: z.boolean(),
      estimatedHours: z.number(),
    });

    const Tasks = z.object({
      tasks: z.array(Task),
    });

    const { SYSTEM_CONTENT, USER_CONTENT } =
      PROMPTS_TO_SUGGEST_TASKS_TO_BE_CREATED[seasonMoment];

    const completion = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_CONTENT,
        },
        { role: 'user', content: USER_CONTENT },
      ],
      response_format: zodResponseFormat(Tasks, 'tasks'),
    });

    const parsedData = completion.choices[0].message.parsed;

    return parsedData.tasks;
  }

  async suggestWorkOrderTasksAssignations({
    workers,
    tasks,
  }: SuggestWorkOrderTasksAssignationsDto) {
    const TaskAssignation = z.object({
      taskId: z.string(),
      workerId: z.string(),
    });

    const TaskAssignations = z.object({
      taskAssignations: z.array(TaskAssignation),
    });

    const { systemContent, userContent } = mapTasksAssignationPrompts({
      workers,
      tasks,
    });

    const completion = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemContent,
        },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(TaskAssignations, 'taskAssignations'),
    });

    const parsedData = completion.choices[0].message.parsed;

    return parsedData.taskAssignations;
  }
}
