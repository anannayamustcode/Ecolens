// // lib/api.ts
// import axios from "axios";

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

// export const api = axios.create({
//   baseURL: backendUrl,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const getProfile = async (token: string) => {
//   return api.get(`${backendUrl}/api/users/me`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const updateProfile = async (token: string, data: any) => {
//   return api.put(`${backendUrl}/api/users/me`, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
