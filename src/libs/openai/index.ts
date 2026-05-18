import OpenAI from 'openai';
import { envs } from '../../config/envs';

const openai = new OpenAI({
  apiKey: envs.openai.apiKey,
});

export const openaiLib = {
  async createCompletion(prompt: string, systemMessage?: string): Promise<string> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.1,
    });

    return completion.choices[0]?.message?.content || '';
  },
};