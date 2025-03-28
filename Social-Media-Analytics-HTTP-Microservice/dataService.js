import axios from 'axios';
import dotenv from 'dotenv';
import { getAuthHeader } from './auth.js';

dotenv.config();
let cachedData = {
  users: [],
  posts: [],
  stats: {
    topUsers: [],
    popularPosts: [],
    latestPosts: []
  }
};

async function fetchAllData() {
  try {
    // Fetch users
    const usersRes = await axios.get('http://20.244.56.144/test/users', getAuthHeader());
    const users = Object.entries(usersRes.data.users).map(([id, name]) => ({ id, name }));
    
    // Fetch posts and comments
    const posts = [];
    for (const user of users) {
      const postsRes = await axios.get(`http://20.244.56.144/test/users/${user.id}/posts`, getAuthHeader());
      for (const post of postsRes.data.posts) {
        const commentsRes = await axios.get(`http://20.244.56.144/test/posts/${post.id}/comments`, getAuthHeader());
        posts.push({
          ...post,
          userName: user.name,
          commentCount: commentsRes.data.comments.length
        });
      }
    }

    // Update cache
    cachedData = {
      users,
      posts,
      stats: {
        topUsers: calculateTopUsers(users, posts),
        popularPosts: calculatePopularPosts(posts),
        latestPosts: calculateLatestPosts(posts)
      }
    };
  } catch (error) {
    console.error('Data fetch error:', error.message);
  }
}

function calculateTopUsers(users, posts) {
  return users.map(user => ({
    ...user,
    postCount: posts.filter(p => p.userid === user.id).length
  })).sort((a, b) => b.postCount - a.postCount).slice(0, 5);
}

function calculatePopularPosts(posts) {
  const maxComments = Math.max(...posts.map(p => p.commentCount));
  return posts.filter(p => p.commentCount === maxComments);
}

function calculateLatestPosts(posts) {
  return [...posts].sort((a, b) => b.id - a.id).slice(0, 5);
}

export{ cachedData, fetchAllData };