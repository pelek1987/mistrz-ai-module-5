import { getSentiment } from './utils/get-sentiment.js';

const main = async ()  => {
    const text = 'Mam dwie siostry';

    await getSentiment(text);
}

await main();