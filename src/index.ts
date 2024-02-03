import { ChatResponse, OpenAiChat } from './open-ai';
import { handleCalledFunctionAsync } from './callable-functions';

const main = async ()  => {
    const text = 'What weather is in Katowice city?';

    // await getSentiment(text);

    const systemField = 'You are helpful AI Assistant.'

    const chat = new OpenAiChat(systemField);

    const answer = await chat.say(text);

    console.log(answer);
    const functionCallLoop = async (answear: ChatResponse): Promise<ChatResponse | void>  => {
        if(answear?.functionCall) {
            const res = await handleCalledFunctionAsync(answear.functionCall);
            const answer2 = await chat.say(res, 'function', answear.functionCall.name);

            return await functionCallLoop(answer2);
        }
        console.log(answear);
    }

    await functionCallLoop(answer)
}

await main();