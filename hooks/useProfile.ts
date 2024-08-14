import { useCallback, useEffect, useState } from "react";
import { getProfile } from "../services/user";
import { ProfileProps } from "../interfaces/user";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export const useProfile = () => {
  const [name, setName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [profile, setProfile] = useState<ProfileProps>();
  const [decodeToken, setDecodeToken] = useState<any>();
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      setDecodeToken(decoded);
    }
  }, [token]);

  const fetchProfile = async (email: string) => {
    try {
      const res = await getProfile(email);
      if (res.data.profile) {
        setProfile(res.data.profile);
        setAvatar(res.data.profile?.profile?.avatar);
        setName(`${res.data.profile?.firstName} ${res.data.profile?.lastName}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (decodeToken?.email) {
      fetchProfile(decodeToken.email);
    }
  }, [decodeToken?.email]);

  return {
    name,
    avatar,
    fetchProfile,
    profile,
  };
};
