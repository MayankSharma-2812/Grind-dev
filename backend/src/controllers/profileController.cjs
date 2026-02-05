const User = require("../models/User.cjs");
const Log = require("../models/ProblemLog.cjs");

export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ email: username }).select("-password -__v");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's logs for stats
    const logs = await Log.find({ userId: user._id }).sort({ date: -1 });
    
    // Calculate stats
    const stats = {
      totalProblems: logs.length,
      currentStreak: 0, // You can implement streak logic here
      longestStreak: 0, // You can implement streak logic here
      difficulty: logs.reduce((acc, log) => {
        const difficulty = log.difficulty || 'unknown';
        acc[difficulty] = (acc[difficulty] || 0) + 1;
        return acc;
      }, {}),
      topics: logs.reduce((acc, log) => {
        const topic = log.topic || 'unknown';
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {}),
      platforms: logs.reduce((acc, log) => {
        const platform = log.platform || 'unknown';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {}),
      recentActivity: logs.slice(0, 10).map(log => ({
        title: log.title,
        platform: log.platform,
        difficulty: log.difficulty,
        topic: log.topic,
        date: log.date
      }))
    };
    
    // Calculate streak (simplified version)
    const calculateStreak = (logs) => {
      if (logs.length === 0) return 0;
      
      let streak = 1;
      const sortedDates = logs.map(log => new Date(log.date).toDateString()).sort((a, b) => new Date(b) - new Date(a));
      
      for (let i = 1; i < sortedDates.length; i++) {
        const current = new Date(sortedDates[i]);
        const previous = new Date(sortedDates[i - 1]);
        const dayDiff = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    };
    
    stats.currentStreak = calculateStreak(logs);
    stats.longestStreak = calculateStreak(logs);
    
    res.json({
      user: {
        name: user.name,
        email: user.email,
        joinedAt: user.createdAt,
        totalProblems: stats.totalProblems
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};
