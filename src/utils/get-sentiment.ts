import { OpenAiChat } from '../open-ai.js';

type Sentiment = 'pozytywny' | 'negatywny' | 'neutralny';

export const getSentiment = async (text: string): Promise<Sentiment> => {
  const systemField = 'Jestem klasyfikatorem sentymentu tekstu podanego przez użytkownika. Sentyment tekstu może być `pozytywny`, `negatywny` lub `neutralny`. Zwracam tylko sentyment pisany małymi literami i nic więcej'

  const chat = new OpenAiChat(systemField);

  const s = await chat.say(text);
  if(s === 'pozytywny' || s === 'negatywny' || s === 'neutralny') {
    return s;
  } else {
    throw new Error(`Unexpected sentiment: ${s}`);
  }
}