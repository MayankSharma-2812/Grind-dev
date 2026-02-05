require("dotenv").config();
const mongoose = require("mongoose");
const githubService = require("./src/services/githubService.cjs");

// Test GitHub sync functionality
async function testGitHubSync() {
  try {
    console.log("🚀 Testing GitHub Sync Service...\n");

    // Check environment variables
    console.log("📋 Checking environment variables:");
    console.log("GITHUB_TOKEN:", process.env.GITHUB_TOKEN ? "✅ Set" : "❌ Missing");
    console.log("GITHUB_USERNAME:", process.env.GITHUB_USERNAME || "❌ Missing");
    console.log("GITHUB_REPO:", process.env.GITHUB_REPO || "❌ Missing");
    console.log("");

    // Test GitHub service initialization
    try {
      console.log("🔧 Testing GitHub service initialization...");
      // This will throw if environment variables are missing
      const testService = require("./src/services/githubService.cjs");
      console.log("✅ GitHub service initialized successfully\n");
    } catch (error) {
      console.log("❌ GitHub service initialization failed:", error.message);
      return;
    }

    // Test commit fetching
    console.log("📥 Testing commit fetching...");
    try {
      const commits = await githubService.fetchCommits();
      console.log(`✅ Successfully fetched ${commits.length} commits`);
      
      if (commits.length > 0) {
        console.log("📝 Sample commit:");
        console.log(`  SHA: ${commits[0].sha.substring(0, 7)}...`);
        console.log(`  Message: ${commits[0].message}`);
        console.log(`  Date: ${commits[0].date}`);
        console.log(`  Author: ${commits[0].author}`);
      }
    } catch (error) {
      console.log("❌ Failed to fetch commits:", error.message);
      return;
    }

    // Test commit message parsing
    console.log("\n🔍 Testing commit message parsing...");
    const testMessages = [
      "leetcode: solved Two Sum (Easy)",
      "leetcode: solved Add Two Numbers (Medium)",
      "leetcode: solved Merge K Sorted Lists (Hard)",
      "fix: typo in readme",
      "feat: add new feature",
      "leetcode: solved Invalid Format (Invalid)"
    ];

    testMessages.forEach(message => {
      const parsed = githubService.parseCommitMessage(message);
      if (parsed) {
        console.log(`✅ "${message}" → ${parsed.title} (${parsed.difficulty})`);
      } else {
        console.log(`❌ "${message}" → Invalid format`);
      }
    });

    // Test LeetCode commit filtering
    console.log("\n🎯 Testing LeetCode commit filtering...");
    try {
      const commits = await githubService.fetchCommits();
      const leetcodeCommits = githubService.filterLeetCodeCommits(commits);
      console.log(`✅ Found ${leetcodeCommits.length} LeetCode commits out of ${commits.length} total commits`);
      
      if (leetcodeCommits.length > 0) {
        console.log("📊 Sample LeetCode commits:");
        leetcodeCommits.slice(0, 3).forEach(commit => {
          console.log(`  ${commit.title} (${commit.difficulty}) - ${commit.date}`);
        });
      }
    } catch (error) {
      console.log("❌ Failed to filter commits:", error.message);
    }

    console.log("\n🎉 GitHub sync service test completed!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Test database models (optional - requires MongoDB connection)
async function testDatabaseModels() {
  try {
    console.log("\n🗄️ Testing database models...");
    
    // Connect to MongoDB if URI is provided
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Connected to MongoDB");
      
      // Test User model
      const User = require("./src/models/User.cjs");
      console.log("✅ User model loaded");
      
      // Test ProblemLog model
      const ProblemLog = require("./src/models/ProblemLog.cjs");
      console.log("✅ ProblemLog model loaded");
      
      await mongoose.disconnect();
      console.log("✅ Disconnected from MongoDB");
    } else {
      console.log("⚠️ MONGO_URI not set, skipping database tests");
    }
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
  }
}

// Run tests
async function runTests() {
  await testGitHubSync();
  await testDatabaseModels();
  
  console.log("\n🏁 All tests completed!");
  process.exit(0);
}

runTests().catch(error => {
  console.error("💥 Test suite failed:", error);
  process.exit(1);
});
