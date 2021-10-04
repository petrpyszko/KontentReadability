const natural = require("natural");
const syl = require('syllabificate');
const syllables = require('syllables');

const logPerformance = false;

function getScoring(text) {

  logPerformance && console.time("sentences")
  const sentences = getSentences(text);
  const totalSentences = sentences.length;
  logPerformance && console.timeEnd("sentences");


  logPerformance && console.time("words");
  let words = [];
  sentences.forEach(s => words = words.concat(getWordsInSentence(s)));
  const totalWords = words.length;
  logPerformance && console.timeEnd("words")

  logPerformance && console.time("syll");
  const totalSyllables = words.reduce((prev, word) => prev + getSyllableCountInWord(word), 0);
  logPerformance && console.timeEnd("syll");

  return {
    flesch: 206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords)),
    flesch_kincaid: (0.39 * (totalWords / totalSentences)) + (11.8 * (totalSyllables / totalWords)) - 15.59,
    sentences: totalSentences,
    words: totalWords,
    syllables: totalSyllables,
    syllables_per_word: totalSyllables / totalWords
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
  const byDictionary = syllables(word);
  if (byDictionary) {
    return byDictionary;
  }

  const bySyllableMatchingLibrary = syl.countSyllables(word);
  if (bySyllableMatchingLibrary) {
    return bySyllableMatchingLibrary;
  }

  const byRegex = getSyllablesCountByRegex(word);

  if (byRegex) {
    return byRegex;
  } else return 1;
}

function getSyllablesCountByRegex(word) {
  word = word.toLowerCase();
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

