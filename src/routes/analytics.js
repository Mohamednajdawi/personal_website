const express = require('express');
const router = express.Router();
const { readAnalytics } = require('../middleware/analytics');
const logger = require('../utils/logger');

// Get analytics data
router.get('/api/analytics/data', async (req, res) => {
  try {
    const analytics = await readAnalytics();
    
    // Convert Set to Array for response
    const data = {
      ...analytics,
      uniqueVisitors: Array.from(analytics.uniqueVisitors || []),
      uniqueVisitorsCount: (analytics.uniqueVisitors || new Set()).size
    };
    
    res.json(data);
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;

