import {RichTextClient} from "./src/textFetcher";
import { getScoring, getSentences, getSyllableCountInWord, getWordsInSentence} from "./src/textAnalyzer";


const client = new RichTextClient('37c18c01-6a77-4f04-bbfb-2a262469b629');
let text = await client.getRichTextValue("39296026-6cfd-4543-bf4f-c402aa7b4749", "rt");

const sentences = getSentences(text);

sentences.forEach(s => {
    const sentence = getWordsInSentence(s);
    const wordsWithSyllables = sentence.map(w => {
        return w + " - " + getSyllableCountInWord(w);
    });
    console.log(wordsWithSyllables);
});

console.log(getScoring(text));