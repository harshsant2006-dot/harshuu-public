/**
 * HARSHUU – API Helper
 * Centralized fetch wrapper
 * Production safe
 */

const API_BASE = "https://harshuu2-backend.onrender.com/api";

/**
 * =========================
 * GET REQUEST
 * =========================
 */
async function apiGet(endpoint) {
  try {
    const res = await fetch(API_BASE + endpoint);

    if (!res.ok) {
      throw new Error(`GET ${endpoint} failed`);
    }

    return await res.json();
  } catch (error) {
    console.error("API GET ERROR:", error);
    return {
      success: false,
      message: "Network error"
    };
  }
}

/**
 * =========================
 * POST REQUEST (JSON)
 * =========================
 */
async function apiPost(endpoint, body) {
  try {
    const res = await fetch(API_BASE + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`POST ${endpoint} failed`);
    }

    return await res.json();
  } catch (error) {
    console.error("API POST ERROR:", error);
    return {
      success: false,
      message: "Network error"
    };
  }
}

/**
 * =========================
 * UPLOAD IMAGE (FormData)
 * =========================
 */
async function apiUpload(endpoint, formData) {
  try {
    const res = await fetch(API_BASE + endpoint, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      throw new Error(`UPLOAD ${endpoint} failed`);
    }

    return await res.json();
  } catch (error) {
    console.error("API UPLOAD ERROR:", error);
    return {
      success: false,
      message: "Upload failed"
    };
  }
}
