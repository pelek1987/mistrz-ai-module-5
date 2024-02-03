import { ChatCompletionAssistantMessageParam } from 'openai/resources/chat/completions';
import { WeatherService } from './lib/weather';

enum CallableFunctions {
  AnswerSentiment = 'AnswerSentiment',
  Geocode = 'Geocode',
  GetCurrentWeather = 'GetCurrentWeather'
}

enum Sentiment {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral'
}

interface AnswerSentimentArgs {
  sentiment: Sentiment;
}

interface GeocodeArgs {
  cityNameOrZipCode: string;
}

interface GetCurrentWeatherArgs {
  latitude: number;
  longitude: number;
}

const answerSentiment = (args: AnswerSentimentArgs) => {
  console.log(`Sentiment is ${args.sentiment}`);
  return 'ok';
}

const geocode = async (args: GeocodeArgs): Promise<string> => {
  const ws = new WeatherService();
  const geo = await ws.geocode(args.cityNameOrZipCode);
  return JSON.stringify(geo);
}

const getCurrentWeather = async (args: GetCurrentWeatherArgs): Promise<string> => {
  const ws = new WeatherService();
  const weather = await ws.getCurrentWeather(args);
  return JSON.stringify(weather)
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

export const handleCalledFunctionAsync = async (call: ChatCompletionAssistantMessageParam.FunctionCall): Promise<string> => {
  try {
    switch(call.name as CallableFunctions) {
      case CallableFunctions.Geocode:
        return await geocode(JSON.parse(call.arguments));
      case CallableFunctions.GetCurrentWeather:
        return await getCurrentWeather(JSON.parse(call.arguments));
      default:
        throw new Error('Unknown function name');
    }
  } catch (err) {
    console.error(err);
    return (err as Error).message
  }
}