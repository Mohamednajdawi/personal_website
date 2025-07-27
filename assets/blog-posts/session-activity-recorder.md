# Building a Chrome Extension for Session Activity Recording

_Published: July 24, 2024 | Category: Web Development | Read Time: 8 min_

This project demonstrates how to build a sophisticated Chrome extension that records user activity during browser sessions. The extension captures mouse events, keyboard interactions, focus tracking, and more.

## Overview

The **Session Activity Recorder** is a Chrome extension designed for productivity analysis that records comprehensive user activity data during browser sessions. It's a perfect example of how modern web technologies can be leveraged to create powerful productivity tools.

![Chrome Extension Demo](https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)

## Key Features

### Real-time Activity Recording

- **Mouse Events**: Clicks, movements, window enter/leave
- **Keyboard Events**: Keystrokes, typing patterns, copy/paste detection
- **Focus Events**: Window focus/blur, page visibility changes
- **Form Interactions**: Input tracking, form submissions
- **Navigation**: URL changes, tab switches

### Database Integration

The extension automatically saves session data to a structured database when recording stops. The data is organized into multiple tables for efficient storage and analysis:

1. **recording_sessions** - Main session records
2. **session_events** - All captured events
3. **mouse_events** - Specific mouse interactions
4. **keyboard_events** - Specific keyboard interactions
5. **text_analysis** - Final text input analysis
6. **focus_tracking** - Window/tab focus events
7. **session_statistics** - Aggregated statistics

### AI-Powered Analysis

The extension integrates with OpenAI to generate intelligent summaries and insights from recorded sessions, providing valuable productivity metrics.

## Technical Architecture

### Content Script

The main content script handles all event recording with optimized performance:

```javascript
// Main event recording logic
function recordEvent(eventType, data) {
  const event = {
    type: eventType,
    timestamp: Date.now(),
    data: data,
    sessionId: currentSessionId,
  };

  // Store locally during recording for performance
  storeEventLocally(event);
}

// Optimized mouse tracking
document.addEventListener("click", function (e) {
  recordEvent("click", {
    x: e.clientX,
    y: e.clientY,
    target: e.target.tagName,
    url: window.location.href,
  });
});
```

### Background Script

The service worker processes and analyzes events:

```javascript
// Process session data when recording stops
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "stopRecording") {
    processSessionData(message.sessionData)
      .then((analysis) => {
        // Upload to database
        return uploadToDatabase(analysis);
      })
      .then(() => {
        sendResponse({ success: true });
      });
  }
});
```

### Database Schema

Efficient schema design for time-series data:

```sql
-- Main sessions table
CREATE TABLE recording_sessions (
    session_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME,
    duration_ms INT,
    total_events INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table with JSON storage
CREATE TABLE session_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(36),
    event_type VARCHAR(50),
    event_data JSON,
    timestamp_ms BIGINT,
    FOREIGN KEY (session_id) REFERENCES recording_sessions(session_id)
);
```

## Implementation Challenges

### 1. Performance Optimization

Recording every user action requires careful optimization to avoid impacting browser performance:

- **Local Storage Strategy**: Events are stored locally during recording and uploaded in batches
- **Event Throttling**: Mouse movements are throttled to reduce data volume
- **Memory Management**: Automatic cleanup of old session data

```javascript
// Throttled mouse movement tracking
let lastMouseMove = 0;
document.addEventListener("mousemove", function (e) {
  const now = Date.now();
  if (now - lastMouseMove > 100) {
    // Throttle to 10fps
    recordEvent("mousemove", {
      x: e.clientX,
      y: e.clientY,
      timestamp: now,
    });
    lastMouseMove = now;
  }
});
```

### 2. Cross-Tab Communication

Synchronizing recording state across multiple tabs:

```javascript
// Use chrome.storage for cross-tab communication
chrome.storage.local.set({
  recording_state: {
    isRecording: true,
    sessionId: generateSessionId(),
    startTime: Date.now(),
  },
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (changes.recording_state) {
    updateUIState(changes.recording_state.newValue);
  }
});
```

### 3. Privacy and Data Security

Implementing proper data handling and user consent:

- **Data Anonymization**: Personal information is hashed
- **Opt-in Consent**: Clear user consent for data collection
- **Local Processing**: Sensitive data processed locally when possible

## Database Integration

### API Design

RESTful API for seamless data upload:

```javascript
// Batch upload for performance
async function uploadEvents(events) {
  const batches = chunkArray(events, 100);

  for (const batch of batches) {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: currentSessionId,
        events: batch,
      }),
    });
  }
}
```

### Backend Implementation

Node.js backend with Express and MySQL:

```javascript
app.post("/api/events", async (req, res) => {
  const { sessionId, events } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Bulk insert for performance
    const query =
      "INSERT INTO session_events (session_id, event_type, event_data, timestamp_ms) VALUES ?";
    const values = events.map((event) => [
      sessionId,
      event.type,
      JSON.stringify(event.data),
      event.timestamp,
    ]);

    await connection.execute(query, [values]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Key Learnings

Building this extension taught me several important lessons:

### Performance Considerations

- **Event Batching**: Grouping operations reduces overhead
- **Storage Strategy**: Local storage during recording, database on completion
- **Resource Management**: Proper cleanup prevents memory leaks

### Privacy by Design

- **Minimal Data Collection**: Only collect necessary data
- **User Control**: Clear controls for starting/stopping recording
- **Transparency**: Open about what data is collected and how it's used

### Scalable Architecture

- **Modular Design**: Separate concerns for maintainability
- **API-First**: Clean separation between extension and backend
- **Error Handling**: Robust error handling for reliability

## Future Enhancements

### Advanced Analytics

- **Heatmap Generation**: Visual representation of user activity
- **Productivity Insights**: AI-powered productivity recommendations
- **Comparative Analysis**: Compare sessions over time

### Enhanced Privacy

- **End-to-End Encryption**: Encrypt data before storage
- **Zero-Knowledge Architecture**: Process data without server access
- **GDPR Compliance**: Full compliance with data protection regulations

### Integration Capabilities

- **CRM Integration**: Connect with customer relationship management systems
- **Productivity Tools**: Integration with time tracking and project management tools
- **Custom Dashboards**: Personalized analytics dashboards

## Conclusion

This Chrome extension project showcases the intersection of web development, data engineering, and AI. It demonstrates how modern browser capabilities can be leveraged for sophisticated productivity analysis while maintaining user privacy and performance.

The project required expertise in:

- **Frontend Development**: JavaScript, Chrome Extension APIs
- **Backend Development**: Node.js, Express, MySQL
- **Database Design**: Efficient schema for time-series data
- **AI Integration**: OpenAI API for intelligent analysis
- **Performance Optimization**: Handling large datasets efficiently

---

_This project is part of my portfolio demonstrating full-stack development capabilities with a focus on performance, privacy, and user experience. The complete source code and documentation are available for review._

## Tags

- Chrome Extension
- JavaScript
- Database Design
- AI Integration
- Performance Optimization
- Privacy by Design
- Full-Stack Development
