import { getSentiment } from './utils/get-sentiment.js';

const main = async ()  => {
    const text = 'Mam dwie siostry';

    const sentiment = await getSentiment(text);

    console.log(sentiment);
}

await main();