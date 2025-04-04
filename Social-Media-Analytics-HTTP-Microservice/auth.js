import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

let authToken = '';
let tokenExpiration = 0;

const COMPANY_INFO = {
    companyName: process.env.COMPANY_NAME,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    ownerName: process.env.OWNER_NAME,
    ownerEmail: process.env.OWNER_EMAIL,
    rollNo: process.env.ROLL_NO
};

async function refreshToken() {
  try {
     
        const response = await axios.post('http://20.244.56.144/test/auth', COMPANY_INFO);
        authToken = response.data.access_token;
        tokenExpiration = Date.now() + (Number(response.data.expires_in) * 1000);
        console.log('New auth token acquired');
  } catch (error) {
    console.error('Token refresh failed:', error.message);
  }
}
let isRefreshing = false;
let refreshPromise = null;

async function getAuthHeader() {
  if (Date.now() >= tokenExpiration) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }
    await refreshPromise;
  }
  return { headers: { Authorization: `Bearer ${authToken}` } };
}
export { getAuthHeader, refreshToken };