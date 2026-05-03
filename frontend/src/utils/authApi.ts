import { requestJson } from "./apiHelpers";

export async function loginUserApi(email: string, password: string) {
  return await requestJson<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUserApi(data: {
  name: string;
  email: string;
  password: string;
  citizenId: string;
}) {
  return await requestJson<any>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
