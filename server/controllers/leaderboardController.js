const TestResult = require('../models/TestResult');

const getDateFilter = (period) => {
  const now = new Date();
  if (period === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { createdAt: { $gte: start } };
  }
  if (period === 'this-week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { createdAt: { $gte: start } };
  }
  return {};
};

const getLeaderboard = async (req, res) => {
  try {
    const period = req.query.period || 'all-time';
    const dateFilter = getDateFilter(period);

    const entries = await TestResult.aggregate([
      { $match: { userId: { $ne: null }, ...dateFilter } },
      {
        $group: {
          _id: '$userId',
          bestWpm: { $max: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          tests: { $sum: 1 },
        },
      },
      { $sort: { bestWpm: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          wpm: { $round: ['$bestWpm', 0] },
          accuracy: { $round: ['$avgAccuracy', 0] },
          tests: 1,
        },
      },
    ]);

    const leaderboard = entries.map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      wpm: entry.wpm,
      accuracy: entry.accuracy,
      tests: entry.tests,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
