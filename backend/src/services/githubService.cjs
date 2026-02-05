const axios = require("axios");

class GitHubService {
  constructor() {
    this.baseURL = "https://api.github.com";
    this.token = process.env.GITHUB_TOKEN;
    this.username = process.env.GITHUB_USERNAME;
    this.repo = process.env.GITHUB_REPO;

    if (!this.token || !this.username || !this.repo) {
      throw new Error("Missing required GitHub environment variables");
    }

    this.axios = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Coding-Progress-Tracker"
      },
      timeout: 30000
    });
  }

  /**
   * Fetch commits from the GitHub repository
   * @param {string} sinceSha - Optional SHA to fetch commits after
   * @param {number} page - Page number for pagination
   * @param {number} perPage - Number of commits per page
   * @returns {Promise<Array>} Array of commits
   */
  async fetchCommits(sinceSha = null, page = 1, perPage = 100) {
    try {
      const params = {
        page,
        per_page: perPage
      };

      if (sinceSha) {
        params.sha = sinceSha;
      }

      const response = await this.axios.get(`/repos/${this.username}/${this.repo}/commits`, {
        params
      });

      return response.data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        date: commit.commit.author.date,
        author: commit.commit.author.name
      }));
    } catch (error) {
      console.error("Error fetching commits:", error.response?.data || error.message);
      throw new Error(`Failed to fetch commits: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Fetch all commits with pagination support
   * @param {string} sinceSha - Optional SHA to fetch commits after
   * @returns {Promise<Array>} Array of all commits
   */
  async fetchAllCommits(sinceSha = null) {
    const allCommits = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const commits = await this.fetchCommits(sinceSha, page, 100);
      
      if (commits.length === 0) {
        hasMore = false;
      } else {
        allCommits.push(...commits);
        page++;
      }

      // Stop if we found the sinceSha commit (when not using sha parameter)
      if (sinceSha && allCommits.some(commit => commit.sha === sinceSha)) {
        break;
      }
    }

    return allCommits;
  }

  /**
   * Parse commit message to extract problem information
   * @param {string} message - Commit message
   * @returns {Object|null} Parsed problem data or null if invalid format
   */
  parseCommitMessage(message) {
    const regex = /^leetcode:\s+solved\s+(.*)\s+\((Easy|Medium|Hard)\)$/i;
    const match = message.trim().match(regex);

    if (!match) {
      return null;
    }

    return {
      title: match[1].trim(),
      difficulty: match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
    };
  }

  /**
   * Filter commits that match the LeetCode format
   * @param {Array} commits - Array of commits
   * @returns {Array} Filtered and parsed commits
   */
  filterLeetCodeCommits(commits) {
    return commits
      .map(commit => ({
        ...commit,
        parsed: this.parseCommitMessage(commit.message)
      }))
      .filter(commit => commit.parsed !== null)
      .map(commit => ({
        sha: commit.sha,
        title: commit.parsed.title,
        difficulty: commit.parsed.difficulty,
        date: commit.date,
        author: commit.author,
        message: commit.message
      }));
  }

  /**
   * Get new commits since the last sync
   * @param {string} lastSyncedSha - SHA of last synced commit
   * @returns {Promise<Array>} Array of new LeetCode commits
   */
  async getNewLeetCodeCommits(lastSyncedSha = null) {
    try {
      const commits = await this.fetchAllCommits(lastSyncedSha);
      const leetcodeCommits = this.filterLeetCodeCommits(commits);

      // If we have a last synced SHA, filter to only newer commits
      if (lastSyncedSha) {
        const lastSyncIndex = commits.findIndex(commit => commit.sha === lastSyncedSha);
        if (lastSyncIndex !== -1) {
          return leetcodeCommits.slice(0, lastSyncIndex);
        }
      }

      return leetcodeCommits;
    } catch (error) {
      console.error("Error getting new LeetCode commits:", error);
      throw error;
    }
  }
}

module.exports = new GitHubService();
