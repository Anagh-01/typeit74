const TestResult = require('../models/TestResult');

const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await TestResult.find({ userId }).sort({ createdAt: -1 });

    if (results.length === 0) {
      return res.json({
        highestWpm: 0,
        avgAccuracy: 0,
        testsTaken: 0,
        timeTypedMinutes: 0,
        level: req.user.level,
        xp: req.user.xp,
        chartData: [],
        recentTests: [],
      });
    }

    const highestWpm = Math.max(...results.map((r) => r.wpm));
    const avgAccuracy = Math.round(
      results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
    );
    const timeTypedMinutes = Math.round(
      results.reduce((sum, r) => sum + r.duration, 0) / 60
    );

    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const dayResults = results.filter(
        (r) => r.createdAt >= dayStart && r.createdAt <= dayEnd
      );

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      if (dayResults.length > 0) {
        last7.push({
          name: dayNames[d.getDay()],
          wpm: Math.round(dayResults.reduce((s, r) => s + r.wpm, 0) / dayResults.length),
          accuracy: Math.round(dayResults.reduce((s, r) => s + r.accuracy, 0) / dayResults.length),
        });
      } else {
        last7.push({ name: dayNames[d.getDay()], wpm: 0, accuracy: 0 });
      }
    }

    res.json({
      highestWpm,
      avgAccuracy,
      testsTaken: results.length,
      timeTypedMinutes,
      level: req.user.level,
      xp: req.user.xp,
      chartData: last7,
      recentTests: results.slice(0, 10).map((r) => ({
        wpm: r.wpm,
        accuracy: r.accuracy,
        mode: r.mode,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserStats };
