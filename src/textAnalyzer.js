const natural = require("natural");
const syl = require('syllabificate');
const syllables = require('syllables');

const textGrading = [
  "Very easy to read. Easily understood by an average 11-year-old student. (Grade 5 and below)",
  "Easy to read. Conversational English for consumers. (Grades 6)",
  "Fairly easy to read. (Grades 7)",
  "Plain English. Easily understood by 13 to 15 year-old students. (Grades 8-9)",
  "Fairly difficult to read. (Grade 10-12)",
  "College - difficult to read (Grade 13-15)",
  "College graduate - very difficult to read. Best understood by university graduates. (Grade 15+)",
  "Professional extremely difficult to read. Best understood by university graduates (Grade 16+)",
];

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


  const flesch = 206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords));
  const flesch_kincaid = (0.39 * (totalWords / totalSentences)) + (11.8 * (totalSyllables / totalWords)) - 15.59;

  return {
    flesch,
    flesch_kincaid,
    sentences: totalSentences,
    words: totalWords,
    syllables: totalSyllables,
    syllables_per_word: totalSyllables / totalWords,
    text_grading: getScoreTextGrading({flesch, flesch_kincaid})
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

function getScoreTextGrading(score) {
  const finalLevel = Math.round((getFleschLevel(score) + getKincaidLevel(score)) / 2);
  return textGrading[finalLevel];
}

function getFleschLevel(score) {
  if (score.flesch >= 90)
    return 0;
  else if (score.flesch >= 80)
    return 1;
  else if (score.flesch >= 70)
    return 2;
  else if (score.flesch >= 60)
    return 3;
  else if (score.flesch >= 50)
    return 4;
  else if (score.flesch >= 30)
    return 5;
  else if (score.flesch >= 10)
    return 6;
  else
    return 7;
}

function getKincaidLevel(score) {
  if (score.flesch_kincaid <= 5.5)
    return 0;
  else if (score.flesch_kincaid <= 6.5)
    return 1;
  else if (score.flesch_kincaid <= 7.5)
    return 2;
  else if (score.flesch_kincaid <= 8.5)
    return 2.75;
  else if (score.flesch_kincaid <= 9.5)
    return 3.25;
  else if (score.flesch_kincaid <= 10.5)
    return 3.75;
  else if (score.flesch_kincaid <= 11.5)
    return 4;
  else if (score.flesch_kincaid <= 12.5)
    return 4.25;
  else if (score.flesch_kincaid <= 13.5)
    return 4.75;
  else if (score.flesch_kincaid <= 14.5)
    return 5;
  else if (score.flesch_kincaid <= 15.5)
    return 5.25;
  else if (score.flesch_kincaid <= 16.5)
    return 6;
  else
    return 7;
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

