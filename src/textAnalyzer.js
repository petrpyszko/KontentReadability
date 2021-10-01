const pronouncing = require("pronouncing");
const natural = require("natural");
const syl = require('syllabificate');


function getScoring(text) {
  const sentences = getSentences(text);
  const totalSentences = sentences.length;
  const sentencesOfWords = sentences.map(s => getWordsInSentence(s));
  const totalWords = sentencesOfWords.reduce((prev, words) => prev + words.length, 0);
  const totalSyllables = sentencesOfWords.reduce(
    (prev, words) => prev + words
      .reduce((prev, word) => prev + getSyllableCountInWord(word), 0),
    0);

  return {
    flesch: 206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords)),
    flesch_kincaid: (0.39 * (totalWords / totalSentences)) + (11.8 * (totalSyllables / totalWords)) - 15.59,
    sentences: totalSentences,
    words: totalWords,
    syllables: totalSyllables,
    syllables_per_word:  totalSyllables / totalWords
  };
}

function getSentences(str) {
  const tokenizer = new natural.SentenceTokenizer();
  return tokenizer.tokenize(str);
}

function getWordsInSentence(sentence) {
  return sentence.match(/\w+(?:'\w+)*/g);
}

function getSyllableCountInWord(word) {
  const phones = pronouncing.phonesForWord(word.toLowerCase());
  if (phones && phones.length) {

    const byDictionary = Math.min(phones.map(p => pronouncing.syllableCount(p)));
    if (byDictionary) {
      return byDictionary;
    }
  }

  const bySyllableLibrary = syl.countSyllables(word);
  if (bySyllableLibrary) {
    return bySyllableLibrary;
  }

  const byRegex = getSyllablesCountByRegex(word);

  if (byRegex) {
    return byRegex;
  } else return 1;
}

function getSyllablesCountByRegex(word) {
  word = word.toLowerCase();
  //if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
  const match = word.match(/[aeiouy]{1,2}/g);
  if (match) {
    return match.length;
  }
}

function logSyllablesInSentences(text) {
  const sentences = getSentences(text);

  sentences.forEach(s => {
    const sentence = getWordsInSentence(s);
    const wordsWithSyllables = sentence.map(w => {
      return w + " - " + getSyllableCountInWord(w);
    });
    console.log(wordsWithSyllables);
  });

  console.log(getScoring(text));
}

module.exports = {getScoring};

