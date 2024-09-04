import API_ENDPOINT from '../global/api-endpoints';

class NyokLaporAPI {
  static async getAdminProfile() {
    const url = API_ENDPOINT.ADMIN_PROFILE;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getAccessTokenAdmin()}`,
      },
    };

    const response = await this.fetchData(url, options);
    return response.profile;
  }

  // eslint-disable-next-line no-dupe-class-members
  static async getUserProfile() {
    const url = API_ENDPOINT.USER_PROFILE;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getAccessTokenUser()}`,
      },
    };

    const response = await this.fetchData(url, options);

    // Provide a default empty object if response.profile is null or undefined
    const profile = response?.profile || {};
    return profile;
  }

  static async fetchData(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        throw new Error('Response is not JSON');
      }
    } catch (error) {
      // Handle the error without throwing it
      console.error('Error caught:', error.message);
      return null; // Or handle it another way
    }
  }

  // Fungsi untuk catat waktu terakhir aktivitas dan waktu kadaluwarsa token
  static async updateActivityAndTokenInfo(userType, setIdleTimeout) {
    const currentTime = Math.floor(Date.now() / 1000);
    const idleTimeoutInSeconds = setIdleTimeout * 60;
    const loginInfo = JSON.parse(localStorage.getItem(`loginInfo${userType}`));

    const tokenInfo = currentTime + idleTimeoutInSeconds;
    loginInfo.expiresIn = tokenInfo;

    localStorage.setItem(`loginInfo${userType}`, JSON.stringify(loginInfo));
  }

  // Fungsi untuk periksa waktu kadaluwarsa
  static async isTokenValid(expiresIn) {
    if (!expiresIn) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = expiresIn;

    return expirationTime < currentTime;
  }

  static async getAdminSummary() {
    const url = API_ENDPOINT.ADMIN_SUMMARY;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getAccessTokenAdmin()}`,
      },
    };

    const response = await this.fetchData(url, options);
    return response.dashboardData;
  }

  static getAccessTokenUser() {
    const loginInfoUser = JSON.parse(localStorage.getItem('loginInfoUser')) || {};
    return loginInfoUser.token || '';
  }

  static getAccessTokenAdmin() {
    const loginInfoAdmin = JSON.parse(localStorage.getItem('loginInfoAdmin')) || {};
    return loginInfoAdmin.token || '';
  }
}

export default NyokLaporAPI;
