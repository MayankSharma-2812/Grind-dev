const User = require("../models/User.cjs");
const ProblemLog = require("../models/ProblemLog.cjs");
const githubService = require("../services/githubService.cjs");

const syncGitHubCommits = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user with GitHub sync info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get new commits from GitHub
    const newCommits = await githubService.getNewLeetCodeCommits(user.lastSyncedCommitSha);

    if (newCommits.length === 0) {
      return res.json({
        message: "No new commits to sync",
        syncedCount: 0,
        commits: []
      });
    }

    // Get existing problem logs to prevent duplicates
    const existingLogs = await ProblemLog.find({
      userId,
      platform: "LeetCode"
    }).select("title date");

    const existingLogsSet = new Set(
      existingLogs.map(log => `${log.title}-${new Date(log.date).toISOString().split('T')[0]}`)
    );

    // Create new problem logs for unique commits
    const newLogs = [];
    const syncedCommits = [];

    for (const commit of newCommits) {
      const logKey = `${commit.title}-${new Date(commit.date).toISOString().split('T')[0]}`;
      
      if (!existingLogsSet.has(logKey)) {
        const newLog = new ProblemLog({
          userId,
          platform: "LeetCode",
          title: commit.title,
          difficulty: commit.difficulty,
          topic: "Unknown",
          notes: "",
          date: new Date(commit.date)
        });

        newLogs.push(newLog);
        syncedCommits.push({
          sha: commit.sha,
          title: commit.title,
          difficulty: commit.difficulty,
          date: commit.date,
          message: commit.message
        });
      }
    }

    // Save new logs to database
    if (newLogs.length > 0) {
      await ProblemLog.insertMany(newLogs);
    }

    // Update user's last synced commit SHA
    const latestCommitSha = newCommits[0]?.sha || user.lastSyncedCommitSha;
    if (latestCommitSha !== user.lastSyncedCommitSha) {
      await User.findByIdAndUpdate(userId, {
        lastSyncedCommitSha: latestCommitSha
      });
    }

    res.json({
      message: `Successfully synced ${newLogs.length} new problem(s)`,
      syncedCount: newLogs.length,
      totalCommits: newCommits.length,
      skippedDuplicates: newCommits.length - newLogs.length,
      commits: syncedCommits,
      lastSyncedCommitSha: latestCommitSha
    });

  } catch (error) {
    console.error("Error in GitHub sync:", error);
    
    // Handle specific GitHub API errors
    if (error.message.includes("Failed to fetch commits")) {
      return res.status(503).json({ 
        message: "Unable to fetch commits from GitHub. Please check your GitHub token and repository settings.",
        error: error.message 
      });
    }

    if (error.message.includes("Missing required GitHub environment variables")) {
      return res.status(500).json({ 
        message: "GitHub service is not properly configured. Please check environment variables.",
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: "Internal server error during GitHub sync",
      error: error.message 
    });
  }
};

const getSyncStatus = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("githubUsername lastSyncedCommitSha");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const syncStatus = {
      githubUsername: user.githubUsername,
      lastSyncedCommitSha: user.lastSyncedCommitSha,
      hasSyncedBefore: !!user.lastSyncedCommitSha,
      configured: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME && process.env.GITHUB_REPO)
    };

    res.json(syncStatus);

  } catch (error) {
    console.error("Error getting sync status:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

module.exports = {
  syncGitHubCommits,
  getSyncStatus
};
