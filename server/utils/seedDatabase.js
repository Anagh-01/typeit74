const bcrypt = require('bcrypt');
const Content = require('../models/Content');
const User = require('../models/User');

const contentSamples = [
  { text: 'Jackdaws love my big sphinx of quartz while quirky zebras vex five jumping wolves.', category: 'words', difficulty: 'beginner' },
  { text: 'Pack my box with five dozen liquor jugs near glowing neon skylines.', category: 'words', difficulty: 'intermediate' },
  { text: 'Bright programmers analyze complex algorithms beneath shimmering moonlight.', category: 'words', difficulty: 'advanced' },
  { text: 'Every wizard quickly mixed jovial potions for the brave knight.', category: 'sentences', difficulty: 'beginner' },
  { text: 'Explorers travel through windy forests chasing hidden treasures today.', category: 'sentences', difficulty: 'intermediate' },
  { text: 'Forgotten valleys beyond the ancient kingdom hide cryptic puzzles everywhere.', category: 'sentences', difficulty: 'advanced' },
  { text: 'Jackdaws love my big sphinx of quartz while quirky zebras vex five jumping wolves near the blazing canyon. Bright programmers analyze complex algorithms and debug mysterious code beneath glowing neon skylines.', category: 'paragraph', difficulty: 'beginner' },
  { text: 'Every wizard quickly mixed jovial potions for the brave knight who explored forgotten valleys beyond the ancient kingdom. Pack my box with five dozen liquor jugs as explorers travel through windy forests.', category: 'paragraph', difficulty: 'intermediate' },
  { text: 'function greet(name) {\n  return `Hello, ${name}!`;\n}', category: 'code', difficulty: 'beginner', language: 'javascript' },
  { text: 'const quartz = () => jackdaws.filter(w => w.vex);\nconsole.log(quartz());', category: 'code', difficulty: 'intermediate', language: 'javascript' },
];

const seedDatabase = async () => {
  const contentCount = await Content.countDocuments();
  if (contentCount === 0) {
    await Content.insertMany(contentSamples);
    console.log(`Seeded ${contentSamples.length} content documents`);
  }

  const demoEmail = 'demo@typeit74.local';
  const existingDemo = await User.findOne({ email: demoEmail });
  if (!existingDemo) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('demo1234', salt);
    await User.create({
      username: 'DemoTypist',
      email: demoEmail,
      passwordHash,
      level: 5,
      xp: 1200,
    });
    console.log('Created demo user: demo@typeit74.local / demo1234');
  }
};

module.exports = seedDatabase;
module.exports.contentSamples = contentSamples;
