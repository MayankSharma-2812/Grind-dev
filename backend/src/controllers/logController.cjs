const Log = require("../models/ProblemLog.cjs");

const createLog = async (req, res) => {
  const log = await Log.create({ ...req.body, userId: req.userId });
  res.json(log);
};

const getLogs = async (req, res) => {
  const logs = await Log.find({ userId: req.userId }).sort({ date: -1 });
  res.json(logs);
};

const deleteLog = async (req, res) => {
  await Log.findByIdAndDelete(req.params.id);
  res.json("Deleted");
};

const getStats = async (req, res) => {
  const logs = await Log.find({ userId: req.userId });

  const total = logs.length;

  const difficulty = logs.reduce((acc, l) => {
    acc[l.difficulty] = (acc[l.difficulty] || 0) + 1;
    return acc;
  }, {});

  res.json({ total, difficulty });
};

module.exports = { createLog, getLogs, deleteLog, getStats };
