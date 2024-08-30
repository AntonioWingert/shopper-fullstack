import {
  type GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private model: GenerativeModel | null = null;
  private fileManager: GoogleAIFileManager | null = null;
  constructor(
    private readonly genAi: GoogleGenerativeAI,
    private readonly genFileAi: GoogleAIFileManager,
  ) {}

  async onModuleInit() {
    await this.createGenerativeModel();
  }

  private async createGenerativeModel() {
    try {
      this.genAi.apiKey = process.env.GEMINI_API_KEY;
      this.genFileAi.apiKey = process.env.GEMINI_API_KEY;
      this.model = this.genAi.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      this.fileManager = this.genFileAi;
    } catch (error) {
      console.error('Failed to create generative model:', error);
    }
  }

  async readImage(imagePath: string, mimeType: string) {
    if (!this.model) {
      throw new Error('Generative model not initialized');
    }
    try {
      const { file } = await this.fileManager.uploadFile(imagePath, {
        mimeType,
      });

      const content = await this.model.generateContent([
        'Extract the total value from this invoice, usually located near a text in uppercase saying total value, and return only the numerical value as an integer, ignoring anything after the comma.',
        {
          fileData: {
            mimeType: mimeType,
            fileUri: file.uri,
          },
        },
      ]);

      return {
        value: content.response?.text().replace(',', '.'),
        uri: file.uri,
      };
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }
}
