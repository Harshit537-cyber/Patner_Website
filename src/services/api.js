import { auth } from "../firebase/firebase";

const BASE_URL = "https://api.namahastro.com/api";

async function request(
  path,
  { method = "GET", body, headers = {} } = {}
) {
  console.log("========== API START ==========");
  console.log("Path:", path);
  console.log("URL:", `${BASE_URL}${path}`);

  let token = null;

  // Firebase token for OTP verification
  if (path === "/partner/verify-otp") {
    const user = auth.currentUser;

    console.log("Firebase currentUser:", user);
    console.log("Firebase UID:", user?.uid);

    if (!user) {
      throw new Error(
        "Firebase user is not available"
      );
    }

    token = await user.getIdToken(true);

    console.log(
      "Firebase token received:",
      !!token
    );
  } else {
    // Partner token for authenticated APIs
    token = localStorage.getItem(
      "partnerToken"
    );

    console.log(
      "Partner token exists:",
      !!token
    );

    if (!token) {
      throw new Error(
        "Partner authentication token is not available"
      );
    }
  }

  const isFormData =
    body instanceof FormData;

  const requestHeaders = {
    Authorization: `Bearer ${token}`,
    ...headers,
  };

  if (!isFormData) {
    requestHeaders["Content-Type"] =
      "application/json";
  }

  const url = `${BASE_URL}${path}`;

  console.log("🚀 Sending API request");
  console.log("URL:", url);
  console.log("METHOD:", method);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });

    const data =
      await response.json().catch(() => null);

    console.log(
      "========== API RESPONSE =========="
    );

    console.log("Status:", response.status);
    console.log("Response:", data);

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Request failed: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error(
      "❌ API FETCH ERROR:",
      error
    );

    console.error(
      "Failed URL:",
      url
    );

    throw error;
  }
}

export const api = {
  get: (path) =>
    request(path, {
      method: "GET",
    }),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body,
    }),

  put: (path, body) =>
    request(path, {
      method: "PUT",
      body,
    }),

  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      body,
    }),

  del: (path) =>
    request(path, {
      method: "DELETE",
    }),
};