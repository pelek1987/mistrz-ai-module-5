import OpenAI from 'openai';
import {
  // ChatCompletionAssistantMessageParam,
  // ChatCompletionMessageParam,
  // ChatCompletionRole,
} from 'openai/resources/index';
import { ChatCompletionCreateParamsBase, ChatCompletion, ChatCompletionRole, ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const parameters: ChatCompletionCreateParamsBase = {
  n: 1,
  temperature: 0.7,
  max_tokens: 1000,
  messages: [

  ],
  stream: false,
  model: 'gpt-4-1106-preview',
  // response_format: {type: 'json_object'},
  functions: [
    {
      name: 'AnswerSentiment',
      description: 'Always respond to sentiment questions using this function call',
      parameters: {
        type: 'object',
        properties: {
          sentiment: {
            type: 'string',
            description: 'Sentiment of the text',
            enum: ['positive', 'negative', 'neutral']
          }
        }
      }
    }
  ]
}

export type ChatResponse = null | {
  content: string | null;
  functionCall: ChatCompletionAssistantMessageParam.FunctionCall | null
}

export const extractFirstChoiceMessage = (message: ChatCompletion): ChatResponse => {
  const firstChoice = message?.choices?.[0]?.message
  if(!firstChoice) {
    return null
  }
  return {
    content: firstChoice.content ?? null,
    functionCall: firstChoice.function_call ?? null
  }
}

export class OpenAiChat {
  private readonly openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
  });

  private readonly messages: ChatCompletionMessageParam[];

  constructor(private system: string) {
    this.messages = [{ role: 'system', content: system }];
  }

  async say(prompt: string, role: ChatCompletionRole = 'user', functionName?: string): Promise<ChatResponse> {
    this.messages.push({ role, content: prompt, name : functionName} as ChatCompletionMessageParam);
    const data  = await this.openai.chat.completions.create({
      ...parameters
      , messages: this.messages
    }) as ChatCompletion
    const msg = extractFirstChoiceMessage(data);
    if(msg?.content) {
      this.messages.push({ role: 'assistant', content: msg.content });
    }
    return msg
  }
  get history(): ChatCompletionMessageParam[] {
    return this.messages;
  }

  clearHistory(): void {
    this.messages.splice(1, this.messages.length);
  }
}