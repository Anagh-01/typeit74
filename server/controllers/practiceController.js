const Content = require('../models/Content');
const TestResult = require('../models/TestResult');
const User = require('../models/User');

// Get random text for practice
const getContent = async (req, res) => {
  try {
    const { mode = 'words', difficulty = 'intermediate', limit = 1 } = req.query;
    
    // Simple matching, in a real app you might use aggregation to get random samples
    const content = await Content.aggregate([
      { $match: { category: mode, difficulty } },
      { $sample: { size: parseInt(limit) } }
    ]);
    
    // If no content found, return a fallback text
    if (!content || content.length === 0) {
      return res.json([{
        text: 'Jackdaws love my big sphinx of quartz while quirky zebras vex five jumping wolves near the blazing canyon.',
      }]);
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save a test result
const saveResult = async (req, res) => {
  try {
    const { wpm, accuracy, errors, duration, mode, difficulty, keyStats } = req.body;
    
    const resultData = {
      wpm, accuracy, errors, duration, mode, difficulty, keyStats
    };
    
    if (req.user) {
      resultData.userId = req.user._id;
      const xpGain = Math.max(10, Math.round(wpm / 2));
      const newXp = req.user.xp + xpGain;
      const newLevel = Math.floor(newXp / 200) + 1;
      await User.findByIdAndUpdate(req.user._id, { xp: newXp, level: newLevel, lastActive: new Date() });
    }

    const result = await TestResult.create(resultData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContent, saveResult };
