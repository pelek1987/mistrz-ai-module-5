import OpenAI from 'openai';
import { Chat, ChatCompletionMessageParam } from 'openai/resources/index';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import ChatCompletion = Chat.ChatCompletion;

const parameters: ChatCompletionCreateParamsBase = {
  n: 1,
  temperature: 0.7,
  max_tokens: 1000,
  messages: [],
  stream: false,
  model: 'gpt-4-1106-preview',
  // response_format: {type: 'json_object'},
}

export const extractFirstChoiceMessage = (message: ChatCompletion): string | null => message?.choices?.[0]?.message?.content ?? null;

export class OpenAiChat {
  private readonly openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
  });

  private readonly messages: ChatCompletionMessageParam[];

  constructor(private system: string) {
    this.messages = [{ role: 'system', content: system }];
  }

  async say(prompt: string): Promise<string | null> {
    this.messages.push({ role: 'user', content: prompt });
    const data  = await this.openai.chat.completions.create({
      ...parameters
      , messages: this.messages
    }) as ChatCompletion
    const s = extractFirstChoiceMessage(data);
    if(s) {
      this.messages.push({ role: 'assistant', content: s });
    }
    return s
  }
  get history(): ChatCompletionMessageParam[] {
    return this.messages;
  }

  clearHistory(): void {
    this.messages.splice(1, this.messages.length);
  }
}