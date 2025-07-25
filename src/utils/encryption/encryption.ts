import CryptoJS from "crypto-js";

export const encrypt = ({
  payload,
  signature,
}: {
  payload: string;
  signature: string;
}) => CryptoJS.AES.encrypt(payload, signature).toString();

export const decrypt = ({
  payload,
  signature,
}: {
  payload: string;
  signature: string;
}) => CryptoJS.AES.decrypt(payload, signature).toString(CryptoJS.enc.Utf8);
