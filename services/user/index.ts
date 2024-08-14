import axios from "axios";
import { newUser, ProfileUpdate, Role, User } from "../../interfaces/user";
import { GetUsersQuery } from "./../../interfaces/user.d";

export function CreateAcc(user: newUser) {
  console.log({ user });
  return axios.post("/api/user/register", { user });
}

export function LoginUser(user: User) {
  return axios.post("api/user/login", { user });
}

export const getAllUser = async (query: GetUsersQuery) => {
  return await axios.get("/api/user/account", { params: query });
};

export const updateAdmin = async (user: Role) => {
  return await axios.put("/api/user/account", { user });
};

export const getProfile = async (email: string) => {
  return await axios.get("/api/user/profile", { params: { email } });
};

export const updateProfile = async (profileUpdate: ProfileUpdate) => {
  return await axios.put("/api/user/profile", { profileUpdate });
};
