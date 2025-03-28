# Social Media Analytics Backend Documentation

## Overview  
The backend service acts as a data aggregation layer between the social media platform's API and the React frontend. Built with Express.js, it focuses on efficient data caching, periodic updates, and cost-effective API usage. The implementation prioritizes quick data access over persistence, with some intentional trade-offs in data completeness.

---

## Core Modules

### Authentication Handler  
Manages JWT token acquisition and renewal through questionable practices:

```javascript
let authToken = '';
let tokenExpiration = 0;

async function refreshToken() {
  try {
    const response = await axios.post(AUTH_URL, COMPANY_INFO);
    authToken = response.data.access_token;
    tokenExpiration = Date.now() + (response.data.expires_in * 1000);
  } catch (error) {
    console.error('Failed miserably to get token:', error.message);
  }
}

Key Flaws:

    Stores credentials in plain text

    Uses basic timeout calculations instead of proper JWT decoding

    No retry mechanism for failed auth attempts

    Token storage in memory causes issues during server restarts

Data Fetcher

Aggressively polls the social media API while trying to avoid rate limits:
javascript
Copy

async function fetchUserPosts(userId) {
  try {
    const response = await axios.get(`${USER_POSTS_URL}/${userId}/posts`);
    return response.data.posts.slice(0, 5); // Only get first 5 posts
  } catch {
    return []; // Who needs error handling anyway?
  }
}

Implementation Quirks:

    Limits posts per user to avoid API bans

    Assumes post IDs are sequential for sorting

    Parallel processing avoided due to rate limit paranoia

    Comment counts sometimes mismatched with posts

Caching Strategy

Uses in-memory storage with questionable refresh logic:
javascript
Copy

let cachedData = {
  users: [],
  posts: [],
  stats: {
    topUsers: [],
    popularPosts: [],
    latestPosts: []
  }
};

function updateCache() {
  // Magically transforms raw data into statistics
  cachedData.stats.topUsers = calculateTopUsers();
  cachedData.stats.popularPosts = findPopularPosts();
}

Known Issues:

    Cache invalidation handled through periodic full refreshes

    No versioning of cached data

    Memory leaks possible with large datasets

    Cache warming happens during server startup

API Endpoints
/users Endpoint

Returns top 5 users by post count:
json
Copy

[
  {
    "id": "1",
    "name": "John Doe", 
    "postCount": 23
  }
]

Implementation Notes:

    Post counts based on partial data sampling

    Sorting done through basic array methods

    No pagination support

/posts Endpoint

Flexible endpoint with type parameter:
bash
Copy

GET /posts?type=popular # Returns posts with most comments
GET /posts?type=latest  # Returns 5 newest posts

Undocumented Features:

    Defaults to returning empty array if type invalid

    Sometimes returns extra posts if counts are tied

    Post dates inferred from ID ordering

Key Implementation Decisions
Questionable Optimization Choices

    In-memory caching instead of Redis to "keep things simple"

    Batch processing avoided due to rate limit fears

    5-minute cache refresh interval chosen arbitrarily

    Post filtering done client-side to reduce payload size

Error Handling Philosophy

    Errors logged to console but rarely monitored

    Failed API calls return empty datasets

    No retry logic for failed social media API calls

    Assumes social media API is always available
