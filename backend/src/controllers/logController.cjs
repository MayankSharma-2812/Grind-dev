const Log = require("../models/ProblemLog.cjs");

const createLog = async (req, res) => {
  try {
    const log = await Log.create({ ...req.body, userId: req.userId });
    res.json(log);
  } catch (error) {
    res.status(500).json("Error creating log");
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.userId }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json("Error fetching logs");
  }
};
const updateLog = async (req, res) => {
  try {
    const updated = await Log.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json("Log not found or unauthorized");
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json("Error updating log");
  }
};


const deleteLog = async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!log) {
      return res.status(404).json("Log not found or unauthorized");
    }
    res.json("Deleted");
  } catch (error) {
    res.status(500).json("Error deleting log");
  }
};

const getStats = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.userId });

    const total = logs.length;

    const difficulty = logs.reduce((acc, l) => {
      acc[l.difficulty] = (acc[l.difficulty] || 0) + 1;
      return acc;
    }, {});

    res.json({ total, difficulty });
  } catch (error) {
    res.status(500).json("Error fetching stats");
  }
};

const getStreak = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.userId }).sort({ date: -1 });

    if (logs.length === 0) {
      return res.json({ currentStreak: 0, longestStreak: 0, missedDays: [], lastMissedDay: null });
    }

    const dates = logs.map(log => new Date(log.date).toDateString());
    const uniqueDates = [...new Set(dates)];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let missedDays = [];
    let lastMissedDay = null;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if there's a log for today or yesterday to continue streak
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;
      tempStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i - 1]);
        const prevDate = new Date(uniqueDates[i]);
        const dayDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          tempStreak++;
          if (i === 1 || uniqueDates[0] === today) {
            currentStreak++;
          }
        } else if (dayDiff > 1) {
          // Record missed days
          for (let j = 1; j < dayDiff; j++) {
            const missedDate = new Date(prevDate);
            missedDate.setDate(missedDate.getDate() + j);
            missedDays.push(missedDate.toDateString());
            if (!lastMissedDay) {
              lastMissedDay = missedDate.toDateString();
            }
          }

          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (i > 1) break; // Break if streak is broken for current streak
        }
      }
    } else {
      // Check for missed days from today/yesterday to the last log
      const lastLogDate = new Date(uniqueDates[0]);
      const checkDate = uniqueDates[0] === yesterday ? new Date() : new Date(Date.now() - 86400000);

      while (checkDate > lastLogDate) {
        missedDays.push(checkDate.toDateString());
        if (!lastMissedDay) {
          lastMissedDay = checkDate.toDateString();
        }
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    // Limit missed days to last 30 for performance
    missedDays = missedDays.slice(0, 30);

    res.json({ currentStreak, longestStreak, missedDays, lastMissedDay });
  } catch (error) {
    res.status(500).json("Error calculating streak");
  }
};

module.exports = { createLog, getLogs, deleteLog, getStats, updateLog, getStreak };
