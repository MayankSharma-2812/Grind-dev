const { Router } = require("express");
const auth = require("../middleware/auth.cjs");
const { syncGitHubCommits, getSyncStatus } = require("../controllers/githubController.cjs");

const router = Router();

// All GitHub routes require authentication
router.use(auth);

// Sync GitHub commits
router.post("/sync", syncGitHubCommits);

// Get sync status
router.get("/status", getSyncStatus);

module.exports = router;
