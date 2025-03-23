'use client';

export interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
  userAgent: string;
}

export function getDeviceInfo(): DeviceInfo {
  // Default values in case detection fails or is run server-side
  const deviceInfo: DeviceInfo = {
    device: 'Desktop',
    browser: 'Google Chrome',
    os: 'Windows',
    userAgent: 'Unknown'
  };

  if (typeof window !== 'undefined') {
    try {
      const userAgent = window.navigator.userAgent;
      deviceInfo.userAgent = userAgent;

      // Detect device type
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        deviceInfo.device = 'Mobile';
      } else if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/.test(userAgent)) {
        deviceInfo.device = 'Tablet';
      } else {
        deviceInfo.device = 'Desktop';
      }

      // Detect browser
      if (userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edge') === -1 && userAgent.indexOf('Edg') === -1 && userAgent.indexOf('OPR') === -1) {
        deviceInfo.browser = 'Google Chrome';
      } else if (userAgent.indexOf('Firefox') !== -1) {
        deviceInfo.browser = 'Firefox';
      } else if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
        deviceInfo.browser = 'Safari';
      } else if (userAgent.indexOf('Edge') !== -1 || userAgent.indexOf('Edg') !== -1) {
        deviceInfo.browser = 'Microsoft Edge';
      } else if (userAgent.indexOf('OPR') !== -1 || userAgent.indexOf('Opera') !== -1) {
        deviceInfo.browser = 'Opera';
      } else if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1) {
        deviceInfo.browser = 'Internet Explorer';
      }

      // Detect operating system
      if (userAgent.indexOf('Windows') !== -1) {
        deviceInfo.os = 'Windows';
      } else if (userAgent.indexOf('Mac') !== -1) {
        deviceInfo.os = 'macOS';
      } else if (userAgent.indexOf('Linux') !== -1) {
        deviceInfo.os = 'Linux';
      } else if (userAgent.indexOf('Android') !== -1) {
        deviceInfo.os = 'Android';
      } else if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1 || userAgent.indexOf('iPod') !== -1) {
        deviceInfo.os = 'iOS';
      }
    } catch (error) {
      console.error('Error detecting device info:', error);
    }
  }

  return deviceInfo;
}
