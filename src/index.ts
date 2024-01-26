import { OpenAiChat } from './open-ai.js';

const main = async ()  => {
    const systemMessage = 'Jestem klasyfikatorem sentymentu tekstu podanego przez użytkownika. Sentyment tekstu może być `pozytywny`, `negatywny` lub `neutralny`. Zwracam tylko sentyment pisany małymi literami i nic więcej'

    const chat = new OpenAiChat(systemMessage);

    const sentiment = await chat.say('Dzisiaj jest piękny dzień');
    console.log(sentiment);

}

main();