/**
 * Utility functions for managing browser cookies.
 */

/**
 * Set a cookie with a given name, value, and expiration in days.
 */
export function setCookie(name: string, value: string, days = 365): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // Use encodeURIComponent to support special characters and JSON structures safely.
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

/**
 * Get a cookie value by name.
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch (e) {
        console.error(`Error decoding cookie ${name}:`, e);
        return null;
      }
    }
  }
  return null;
}

/**
 * Erase a cookie by setting its expiration date in the past.
 */
export function eraseCookie(name: string): void {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
}

/**
 * Helper to store any JSON-serializable data in cookies.
 */
export function setCookieData<T>(name: string, data: T, days = 365): void {
  try {
    const serialized = JSON.stringify(data);
    setCookie(name, serialized, days);
  } catch (e) {
    console.error(`Error serializing data for cookie ${name}:`, e);
  }
}

/**
 * Helper to retrieve and parse JSON data from cookies, with a fallback.
 */
export function getCookieData<T>(name: string, fallback: T): T {
  try {
    const val = getCookie(name);
    if (val !== null) {
      return JSON.parse(val) as T;
    }
  } catch (e) {
    console.error(`Error parsing cookie data for ${name}:`, e);
  }
  return fallback;
}

/**
 * Resize a base64 image string to fit inside browser cookie storage limits (under 4KB).
 * Downscales the image to a maximum of 64x64 pixels and compresses it to JPEG format.
 */
export function resizeAvatar(base64Str: string, maxWidth = 64, maxHeight = 64): Promise<string> {
  return new Promise((resolve) => {
    if (!base64Str) {
      resolve('');
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.6 (60%) quality to keep byte size extremely small
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

