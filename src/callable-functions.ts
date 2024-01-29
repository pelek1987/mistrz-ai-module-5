import { ChatCompletionAssistantMessageParam } from 'openai/resources/chat/completions';

enum CallableFunctions {
  AnswerSentiment = 'AnswerSentiment'
}

enum Sentiment {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral'
}

interface AnswerSentimentArgs {
  sentiment: Sentiment;
}

const answerSentiment = (args: AnswerSentimentArgs) => {
  console.log(`Sentiment is ${args.sentiment}`);
  return 'ok';
}

export const handleCalledFunction = (call: ChatCompletionAssistantMessageParam.FunctionCall): string => {
  try {
    switch(call.name as CallableFunctions) {
      case CallableFunctions.AnswerSentiment:
        return answerSentiment(JSON.parse(call.arguments));
      default:
        throw new Error('Unknown function name');
    }
  } catch (err) {
    console.error(err);
    return (err as Error).message
  }
}