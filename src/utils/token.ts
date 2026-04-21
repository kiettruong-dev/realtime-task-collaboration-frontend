import { KEY_LOCAL } from "@/constants";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
export const setAccessToken = (accessToken: string) => {
  try {
    const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY || "";
    const encryptedData = CryptoJS.AES.encrypt(
      accessToken,
      CRYPTO_KEY,
    ).toString();
    Cookies.set(KEY_LOCAL.ACCESS_TOKEN, encryptedData);
  } catch (error) {
    console.log("error set token: ", error);
    Cookies.remove(KEY_LOCAL.ACCESS_TOKEN);
    return "";
  }
};
export const getAccessToken = () => {
  try {
    const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY || "";
    const keyTook = Cookies.get(KEY_LOCAL.ACCESS_TOKEN) || "";
    const cipherAccessText = CryptoJS.AES.decrypt(keyTook, CRYPTO_KEY);
    const decryptedRoleData = cipherAccessText.toString(CryptoJS.enc.Utf8);
    return decryptedRoleData;
  } catch (error) {
    console.log("error get token: ", error);
    Cookies.remove(KEY_LOCAL.ACCESS_TOKEN);
    return "";
  }
};

export const removeAccessToken = () => {
  Cookies.remove(KEY_LOCAL.ACCESS_TOKEN);
};
