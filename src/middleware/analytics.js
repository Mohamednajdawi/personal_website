const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

// Use Railway volume path or local data directory
const DATA_DIR = process.env.ANALYTICS_PATH || path.join(__dirname, '../../data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    logger.info(`Analytics data directory: ${DATA_DIR}`);
  } catch (error) {
    logger.error('Error creating data directory:', error);
  }
}

// Get visitor location from IP
async function getLocationFromIP(ip) {
  try {
    // Use ipapi.co for free IP geolocation
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (response.ok) {
      const data = await response.json();
      return {
        ip: ip,
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        timezone: data.timezone || 'Unknown',
        org: data.org || 'Unknown'
      };
    }
  } catch (error) {
    logger.error('Error fetching location:', error);
  }
  
  return {
    ip: ip,
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    countryCode: 'XX',
    latitude: 0,
    longitude: 0,
    timezone: 'Unknown',
    org: 'Unknown'
  };
}

// Read analytics data
async function readAnalytics() {
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty structure
    return {
      visits: [],
      totalVisits: 0,
      uniqueVisitors: new Set()
    };
  }
}

// Write analytics data
async function writeAnalytics(data) {
  try {
    // Convert Set to Array for JSON serialization
    const serializable = {
      ...data,
      uniqueVisitors: Array.from(data.uniqueVisitors)
    };
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(serializable, null, 2));
  } catch (error) {
    logger.error('Error writing analytics:', error);
  }
}

// Track visitor
async function trackVisitor(req, res, next) {
  try {
    await ensureDataDir();
    
    // Get IP address (handle proxy/cloudflare)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                req.headers['x-real-ip'] || 
                req.connection.remoteAddress || 
                req.socket.remoteAddress ||
                'Unknown';
    
    // Skip tracking for localhost and analytics page itself
    if (ip.includes('127.0.0.1') || ip.includes('::1') || req.path === '/analytics') {
      return next();
    }
    
    // Get location data
    const location = await getLocationFromIP(ip);
    
    // Read current analytics
    let analytics = await readAnalytics();
    
    // Ensure uniqueVisitors is a Set
    if (Array.isArray(analytics.uniqueVisitors)) {
      analytics.uniqueVisitors = new Set(analytics.uniqueVisitors);
    } else if (!(analytics.uniqueVisitors instanceof Set)) {
      analytics.uniqueVisitors = new Set();
    }
    
    // Add visit
    const visit = {
      timestamp: new Date().toISOString(),
      ip: ip,
      location: location,
      userAgent: req.headers['user-agent'] || 'Unknown',
      page: req.path,
      referrer: req.headers['referer'] || 'Direct'
    };
    
    analytics.visits.push(visit);
    analytics.totalVisits = (analytics.totalVisits || 0) + 1;
    analytics.uniqueVisitors.add(ip);
    
    // Keep only last 1000 visits to prevent file from growing too large
    if (analytics.visits.length > 1000) {
      analytics.visits = analytics.visits.slice(-1000);
    }
    
    // Save analytics
    await writeAnalytics(analytics);
    
    logger.info(`Visitor tracked: ${ip} from ${location.city}, ${location.country}`);
  } catch (error) {
    logger.error('Error tracking visitor:', error);
  }
  
  next();
}

module.exports = {
  trackVisitor,
  readAnalytics
};

