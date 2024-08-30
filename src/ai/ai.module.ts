import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

@Module({
  providers: [AiService, GoogleGenerativeAI, GoogleAIFileManager],
  exports: [AiService, GoogleGenerativeAI, GoogleAIFileManager],
})
export class AiModule {}
