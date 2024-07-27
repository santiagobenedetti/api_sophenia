import { Global, Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Global()
@Module({
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
