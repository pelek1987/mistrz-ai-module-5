import { OpenAiChat } from '../open-ai.js';
import { handleCalledFunction } from '../callable-functions.js';

type Sentiment = 'pozytywny' | 'negatywny' | 'neutralny';

export const getSentiment = async (text: string): Promise<void> => {
  const systemField = 'Jestem klasyfikatorem sentymentu tekstu podanego przez użytkownika. Zwracam odpowiedź w formacie JSON, wywołując funkcję.'

  const chat = new OpenAiChat(systemField);

  const answer = await chat.say(text);
  console.log(answer);
  if(answer?.functionCall) {
    const res = handleCalledFunction(answer.functionCall);
    await chat.say(res, 'function', answer.functionCall.name);
  }
}