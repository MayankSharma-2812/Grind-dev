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

module.exports = { createLog, getLogs, deleteLog, getStats, updateLog };
