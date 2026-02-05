# GitHub Sync Setup Guide

This guide explains how to set up automatic LeetCode problem logging from GitHub commits.

## 🚀 Overview

The GitHub Sync feature automatically imports your LeetCode solutions from a dedicated GitHub repository, saving you manual data entry time.

## 📋 Prerequisites

1. **GitHub Repository**: A dedicated repository for your LeetCode solutions
2. **GitHub Fine-Grained Token**: Personal access token with repository access
3. **Consistent Commit Format**: All commits must follow the specified format

## 🔧 Environment Variables

Add these to your `.env` file in the backend directory:

```env
# GitHub Configuration
GITHUB_TOKEN=ghp_your_fine_grained_token_here
GITHUB_USERNAME=your_github_username
GITHUB_REPO=leetcode-solutions
```

### Getting GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Select these scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
4. Copy the token and add it to your `.env` file

## 📝 Commit Format Requirements

All LeetCode solution commits must follow this exact format:

```
leetcode: solved Problem Name (Difficulty)
```

### Examples:
```
leetcode: solved Two Sum (Easy)
leetcode: solved Add Two Numbers (Medium)
leetcode: solved Merge K Sorted Lists (Hard)
```

### Important Notes:
- Must start with `leetcode: solved `
- Problem name can contain spaces and special characters
- Difficulty must be exactly `(Easy)`, `(Medium)`, or `(Hard)`
- Case-insensitive for difficulty
- No extra characters before or after the format

## 🏗️ Architecture

### Backend Components

1. **User Model Extension** (`src/models/User.cjs`):
   - `githubUsername`: GitHub username
   - `lastSyncedCommitSha`: Last synced commit SHA

2. **GitHub Service** (`src/services/githubService.cjs`):
   - Fetches commits from GitHub API
   - Parses commit messages
   - Handles pagination and rate limiting

3. **Sync Controller** (`src/controllers/githubController.cjs`):
   - Orchestrates the sync process
   - Prevents duplicate entries
   - Updates sync status

4. **API Routes** (`src/routes/githubRoutes.cjs`):
   - `POST /api/github/sync` - Trigger sync
   - `GET /api/github/status` - Get sync status

### Frontend Components

1. **GitHubSync Component** (`src/components/GitHubSync.jsx`):
   - Displays sync status
   - Triggers sync operations
   - Shows sync results

2. **Dashboard Integration**:
   - Integrated into main dashboard
   - Responsive design
   - Loading and error states

## 🔄 Sync Process

1. **Authentication**: User JWT validated
2. **Status Check**: Get last synced commit SHA
3. **Commit Fetch**: Retrieve commits since last sync
4. **Message Parsing**: Extract problem details from commit messages
5. **Duplicate Prevention**: Check against existing logs
6. **Log Creation**: Insert new problem logs into database
7. **Status Update**: Update last synced commit SHA
8. **Response**: Return sync results to frontend

## 🛠️ API Endpoints

### POST /api/github/sync
Triggers the sync process.

**Response:**
```json
{
  "message": "Successfully synced 5 new problem(s)",
  "syncedCount": 5,
  "totalCommits": 8,
  "skippedDuplicates": 3,
  "commits": [
    {
      "sha": "abc123...",
      "title": "Two Sum",
      "difficulty": "Easy",
      "date": "2024-01-15T10:30:00Z",
      "message": "leetcode: solved Two Sum (Easy)"
    }
  ],
  "lastSyncedCommitSha": "abc123..."
}
```

### GET /api/github/status
Gets the current sync status.

**Response:**
```json
{
  "githubUsername": "john-doe",
  "lastSyncedCommitSha": "abc123...",
  "hasSyncedBefore": true,
  "configured": true
}
```

## 🎯 Data Mapping

| GitHub Field | ProblemLog Field | Value |
|-------------|------------------|-------|
| Parsed Title | title | Problem name from commit |
| Parsed Difficulty | difficulty | Easy/Medium/Hard |
| "LeetCode" | platform | Fixed value |
| "Unknown" | topic | Default value |
| "" | notes | Empty string |
| Commit Date | date | ISO date from commit |
| User ID | userId | Authenticated user ID |

## 🔒 Security Considerations

1. **Token Security**: Never commit GitHub tokens to version control
2. **Fine-Grained Access**: Use minimal required permissions
3. **Authentication**: All endpoints require JWT authentication
4. **Input Validation**: Strict regex validation for commit messages
5. **Error Handling**: No sensitive data leaked in responses

## 🚨 Troubleshooting

### Common Issues

1. **"GitHub Sync Not Configured"**
   - Check environment variables are set
   - Verify GitHub token has correct permissions

2. **"No new commits to sync"**
   - Check commit format matches requirements
   - Verify commits are newer than last sync

3. **"Failed to fetch commits"**
   - Check GitHub token is valid
   - Verify repository exists and is accessible
   - Check rate limits

4. **Duplicate entries**
   - Sync process automatically prevents duplicates
   - Check if same problem was logged manually

### Debug Mode

Add logging to troubleshoot:

```javascript
// In githubService.cjs
console.log("Fetching commits for:", `${this.username}/${this.repo}`);
console.log("Since SHA:", sinceSha);
```

## 📱 Frontend Usage

The GitHub Sync component appears in the dashboard sidebar and provides:

- **Status Display**: Shows current sync status
- **Sync Button**: Triggers manual sync
- **Progress Feedback**: Loading states and results
- **Error Handling**: User-friendly error messages

## 🔄 Automatic vs Manual Sync

Currently, the system supports manual sync via the dashboard button. Future enhancements could include:

- Automatic sync on login
- Scheduled sync (cron jobs)
- Webhook-based real-time sync

## 📊 Monitoring

Monitor sync health by checking:

- Sync frequency and success rates
- Number of problems imported per sync
- Error rates and types
- GitHub API rate limit usage

## 🎉 Best Practices

1. **Consistent Commits**: Always use the required format
2. **Regular Syncs**: Sync regularly to avoid large imports
3. **Token Rotation**: Rotate GitHub tokens periodically
4. **Backup Data**: Keep manual backups of problem logs
5. **Monitor Usage**: Watch GitHub API rate limits

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure commit format matches exactly
4. Check GitHub token permissions
5. Review browser console for frontend errors
6. Check backend logs for API errors
