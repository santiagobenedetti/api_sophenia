import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { zodResponseFormat } from 'openai/helpers/zod';
import { PROMPTS } from 'src/shared/constants/prompts';
import { z } from 'zod';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async suggestTasksToBeCreated(): Promise<
    {
      title?: string;
      description?: string;
      requiresTaskReport?: boolean;
      estimatedHours?: number;
    }[]
  > {
    const Task = z.object({
      title: z.string(),
      description: z.string(),
      requiresTaskReport: z.boolean(),
      estimatedHours: z.number(),
    });

    const Tasks = z.object({
      tasks: z.array(Task),
    });

    // TODO: Find a way to be able to use an argument to select the prompt
    const prompts = PROMPTS.GENERAL_MANAGEMENT;

    const systemContent = prompts.SYSTEM_CONTENT;

    const userContent = prompts.USER_CONTENT;

    const completion = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemContent,
        },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(Tasks, 'tasks'),
    });

    const parsedData = completion.choices[0].message.parsed;

    return parsedData.tasks;
  }
}
