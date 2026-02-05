const Log = require("../models/ProblemLog.cjs");
const User = require("../models/User.cjs");

export const exportCSV = async (req, res) => {
  try {
    const userId = req.userId;
    const logs = await Log.find({ userId }).sort({ date: -1 });
    
    if (logs.length === 0) {
      return res.status(404).json({ message: "No data to export" });
    }

    // Create CSV header
    const csvHeader = [
      'Date',
      'Platform',
      'Title',
      'Difficulty',
      'Topic',
      'Notes'
    ].join(',');

    // Create CSV rows
    const csvRows = logs.map(log => [
      new Date(log.date).toLocaleDateString(),
      log.platform || '',
      `"${log.title}"`, // Wrap title in quotes to handle commas
      log.difficulty || '',
      log.topic || '',
      `"${(log.notes || '').replace(/"/g, '""')}"` // Escape quotes in notes
    ]);

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="problem_solving_progress_${new Date().toISOString().split('T')[0]}.csv"`);
    
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: "Error exporting CSV" });
  }
};

export const exportPDF = async (req, res) => {
  try {
    const userId = req.userId;
    const [user, logs] = await Promise.all([
      User.findById(userId).select('name email createdAt'),
      Log.find({ userId }).sort({ date: -1 })
    ]);
    
    if (logs.length === 0) {
      return res.status(404).json({ message: "No data to export" });
    }

    // Calculate statistics
    const stats = {
      totalProblems: logs.length,
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
      dateRange: {
        start: new Date(Math.min(...logs.map(l => new Date(l.date)))),
        end: new Date(Math.max(...logs.map(l => new Date(l.date))))
      }
    };

    // Generate HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Problem Solving Progress Report</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333;
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #6366f1; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .user-info { 
            margin-bottom: 30px; 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px;
        }
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px;
        }
        .stat-card { 
            background: #ffffff; 
            padding: 20px; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            text-align: center;
        }
        .stat-value { 
            font-size: 2rem; 
            font-weight: bold; 
            color: #6366f1; 
            margin-bottom: 8px;
        }
        .stat-label { 
            font-size: 0.9rem; 
            color: #6b7280; 
            text-transform: uppercase;
        }
        .section { 
            margin-bottom: 30px;
        }
        .section h3 { 
            color: #6366f1; 
            border-left: 3px solid #6366f1; 
            padding-left: 12px; 
            margin-bottom: 15px;
        }
        .list-item { 
            display: flex; 
            justify-content: space-between; 
            padding: 8px 0; 
            border-bottom: 1px solid #f3f4f6;
        }
        .recent-activity { 
            margin-top: 30px;
        }
        .activity-item { 
            margin-bottom: 15px; 
            padding: 15px; 
            background: #f8f9fa; 
            border-radius: 8px;
        }
        .activity-title { 
            font-weight: bold; 
            margin-bottom: 5px;
        }
        .activity-meta { 
            font-size: 0.9rem; 
            color: #6b7280;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Problem Solving Progress Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="user-info">
        <h2>User Information</h2>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">${stats.totalProblems}</div>
            <div class="stat-label">Total Problems</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${Object.keys(stats.difficulty).length}</div>
            <div class="stat-label">Difficulty Levels</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${Object.keys(stats.topics).length}</div>
            <div class="stat-label">Topics Covered</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${Object.keys(stats.platforms).length}</div>
            <div class="stat-label">Platforms Used</div>
        </div>
    </div>

    <div class="section">
        <h3>Difficulty Breakdown</h3>
        ${Object.entries(stats.difficulty).map(([difficulty, count]) => `
            <div class="list-item">
                <span>${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                <span><strong>${count}</strong></span>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h3>Popular Topics</h3>
        ${Object.entries(stats.topics)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([topic, count]) => `
            <div class="list-item">
                <span>${topic}</span>
                <span><strong>${count}</strong></span>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h3>Platforms Used</h3>
        ${Object.entries(stats.platforms).map(([platform, count]) => `
            <div class="list-item">
                <span>${platform}</span>
                <span><strong>${count}</strong></span>
            </div>
        `).join('')}
    </div>

    <div class="recent-activity">
        <h3>Recent Activity (Last 10 Problems)</h3>
        ${logs.slice(0, 10).map(log => `
            <div class="activity-item">
                <div class="activity-title">${log.title}</div>
                <div class="activity-meta">
                    ${log.platform} • ${log.difficulty} • ${log.topic} • ${new Date(log.date).toLocaleDateString()}
                </div>
                ${log.notes ? `<p style="margin-top: 8px; font-style: italic; color: #6b7280;">${log.notes}</p>` : ''}
            </div>
        `).join('')}
    </div>

    <div class="footer">
        <p>Report generated from Problem Solving Tracker</p>
        <p>Date Range: ${stats.dateRange.start.toLocaleDateString()} - ${stats.dateRange.end.toLocaleDateString()}</p>
    </div>
</body>
</html>
    `;

    // Set response headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="problem_solving_progress_${new Date().toISOString().split('T')[0]}.html"`);
    
    res.send(htmlContent);
  } catch (error) {
    res.status(500).json({ message: "Error exporting PDF" });
  }
};

export const getWeeklySummary = async (req, res) => {
  try {
    const userId = req.userId;
    const logs = await Log.find({ userId }).sort({ date: -1 });
    
    if (logs.length === 0) {
      return res.json({
        message: "No data available",
        weeklyStats: {
          problemsSolved: 0,
          difficultyTrend: [],
          topTopics: [],
          platformsUsed: [],
          streakInfo: { currentStreak: 0, longestStreak: 0 }
        }
      });
    }

    // Calculate weekly stats
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyLogs = logs.filter(log => new Date(log.date) >= oneWeekAgo);
    
    // Difficulty trend for the week
    const difficultyTrend = weeklyLogs.reduce((acc, log) => {
      const difficulty = log.difficulty || 'unknown';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    // Top topics for the week
    const topTopics = weeklyLogs.reduce((acc, log) => {
      const topic = log.topic || 'unknown';
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {});

    // Platforms used this week
    const platformsUsed = weeklyLogs.reduce((acc, log) => {
      const platform = log.platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    // Calculate streak info
    const calculateStreak = (logs) => {
      if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };
      
      const dates = logs.map(log => new Date(log.date).toDateString());
      const uniqueDates = [...new Set(dates)];
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
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
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
            if (i > 1) break;
          }
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      return { currentStreak, longestStreak };
    };

    const streakInfo = calculateStreak(logs);

    res.json({
      message: `You solved ${weeklyLogs.length} problems this week!`,
      weeklyStats: {
        problemsSolved: weeklyLogs.length,
        difficultyTrend: Object.entries(difficultyTrend).map(([difficulty, count]) => ({
          difficulty,
          count,
          percentage: Math.round((count / weeklyLogs.length) * 100)
        })),
        topTopics: Object.entries(topTopics)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([topic, count]) => ({ topic, count })),
        platformsUsed: Object.entries(platformsUsed).map(([platform, count]) => ({
          platform,
          count
        })),
        streakInfo,
        weekRange: {
          start: oneWeekAgo.toLocaleDateString(),
          end: new Date().toLocaleDateString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching weekly summary" });
  }
};
