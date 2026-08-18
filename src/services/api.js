import { auth } from "../firebase";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.namahastro.com/api";

async function request(
  path,
  { method = "GET", body, headers = {} } = {}
) {
  console.log("========== API START ==========");
  console.log("Path:", path);
  console.log("Base URL:", BASE_URL);

  let token;

  if (path === "/partner/verify-otp") {
    const user = auth.currentUser;

    console.log(
      "Firebase currentUser:",
      user
    );

    console.log(
      "Firebase UID:",
      user?.uid
    );

    if (!user) {
      console.error(
        "❌ Firebase currentUser is NULL"
      );

      throw new Error(
        "Firebase user is not available"
      );
    }

    try {
      token = await user.getIdToken(true);
    } catch (error) {
      console.error(
        "❌ Failed to get Firebase ID token:",
        error
      );

      throw error;
    }
  } else {
    token =
      localStorage.getItem(
        "partnerToken"
      );

    console.log(
      "Partner token exists:",
      !!token
    );

    if (!token) {
      console.error(
        "❌ partnerToken not found in localStorage"
      );

      throw new Error(
        "Partner authentication token is not available"
      );
    }
  }

  console.log(
    "Token preview:",
    token?.substring(0, 30)
  );

  const isFormData =
    body instanceof FormData;

  const requestHeaders = {
    Authorization: `Bearer ${token}`,
    ...headers,
  };

  if (!isFormData) {
    requestHeaders[
      "Content-Type"
    ] = "application/json";
  }

  const url =
    `${BASE_URL}${path}`;

  console.log(
    "🚀 Sending API request"
  );

  console.log(
    "URL:",
    url
  );

  console.log(
    "METHOD:",
    method
  );

  console.log(
    "Authorization:",
    `Bearer ${token.substring(0, 20)}...`
  );

  try {
    const res = await fetch(
      url,
      {
        method,
        headers: requestHeaders,
        body: body
          ? isFormData
            ? body
            : JSON.stringify(body)
          : undefined,
      }
    );

    const data =
      await res.json().catch(
        () => null
      );

    console.log(
      "========== API RESPONSE =========="
    );

    console.log(
      "Status:",
      res.status
    );

    console.log(
      "Response:",
      data
    );

    console.log(
      "=================================="
    );

    if (!res.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Request failed: ${res.status}`
      );
    }

    return data;
  } catch (error) {
    console.error(
      "❌ API FETCH ERROR:",
      error
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