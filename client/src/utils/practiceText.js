const PARAGRAPH_ONE =
  'Jackdaws love my big sphinx of quartz while quirky zebras vex five jumping wolves near the blazing canyon. Bright programmers analyze complex algorithms and debug mysterious code beneath glowing neon skylines.';

const PARAGRAPH_TWO =
  'Every wizard quickly mixed jovial potions for the brave knight who explored forgotten valleys beyond the ancient kingdom. Pack my box with five dozen liquor jugs as explorers travel through windy forests, chasing hidden treasures and unraveling cryptic puzzles under the shimmering moonlight.';

const WORD_POOL = `${PARAGRAPH_ONE} ${PARAGRAPH_TWO}`
  .toLowerCase()
  .replace(/[^a-z\s]/g, ' ')
  .split(/\s+/)
  .filter(Boolean);

const shuffle = (items) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const pickWords = (count) => shuffle(WORD_POOL).slice(0, count);

const WORD_COUNTS = {
  beginner: { words: 10, sentenceWords: 14, paragraph: 28, code: 8 },
  intermediate: { words: 14, sentenceWords: 20, paragraph: 38, code: 10 },
  advanced: { words: 18, sentenceWords: 28, paragraph: 52, code: 12 },
};

const buildMeaninglessParagraph = (wordCount) => {
  const words = pickWords(wordCount);
  const sentences = [];
  let i = 0;

  while (i < words.length) {
    const len = 6 + Math.floor(Math.random() * 7);
    const chunk = words.slice(i, i + len);
    if (chunk.length === 0) break;
    const sentence = capitalize(chunk.join(' ')) + '.';
    sentences.push(sentence);
    i += len;
  }

  return sentences.join(' ');
};

const buildSentences = (totalWords) => {
  const words = pickWords(totalWords);
  const mid = Math.ceil(words.length / 2);
  const first = capitalize(words.slice(0, mid).join(' ')) + '.';
  const second = capitalize(words.slice(mid).join(' ')) + '.';
  return `${first} ${second}`;
};

const buildWords = (count) => pickWords(count).join(' ');

const buildCode = (count) => {
  const words = pickWords(count);
  const types = shuffle(['const', 'let', 'var', 'function', 'return']);
  return words
    .map((word, index) => {
      const keyword = types[index % types.length];
      const value = pickWords(1)[0];
      if (keyword === 'function') {
        return `function ${word}() {\n  return "${value}";\n}`;
      }
      return `${keyword} ${word} = "${value}";`;
    })
    .join('\n');
};

export const generatePracticeText = (mode, difficulty = 'intermediate') => {
  const counts = WORD_COUNTS[difficulty] || WORD_COUNTS.intermediate;

  switch (mode) {
    case 'words':
      return buildWords(counts.words);
    case 'sentences':
      return buildSentences(counts.sentenceWords);
    case 'code':
      return buildCode(counts.code);
    case 'paragraph':
    default:
      return buildMeaninglessParagraph(counts.paragraph);
  }
};

export const MODE_LABELS = {
  words: 'Words',
  sentences: 'Sentences',
  paragraph: 'Paragraph',
  code: 'Code',
};
