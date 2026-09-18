import { apiClient } from './src/services/apiClient';
import { studentService } from './src/services/studentService';
import { analyticsService } from './src/services/analyticsService';
import axios from 'axios';

apiClient.defaults.baseURL = 'http://localhost:5000/api/v1';

async function testFrontend() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      username: '25B21A4201',
      password: 'password123'
    });
    
    if (loginRes.data && loginRes.data.data && loginRes.data.data.token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.data.token}`;
        (global as any).sessionStorage = {
            getItem: () => loginRes.data.data.token,
            removeItem: () => {}
        };
    } else {
        console.log('Login failed');
        return;
    }

    console.log('--- Fetching Profile ---');
    const profile = await studentService.getProfile();
    console.log('Profile type:', typeof profile);
    console.log('Profile keys:', profile ? Object.keys(profile) : 'null');
    console.log('Profile name:', profile?.name);
    console.log('Profile is exact backend data payload?', profile && profile.success !== undefined);
    
    if (profile && (profile as any).data) {
        console.log('Wait, profile has a .data property! Its keys:', Object.keys((profile as any).data));
    }

    console.log('\n--- Fetching Analytics ---');
    const analytics = await analyticsService.getStudentPersonalAnalytics();
    console.log('Analytics keys:', analytics ? Object.keys(analytics) : 'null');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

testFrontend();
