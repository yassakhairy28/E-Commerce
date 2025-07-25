import bcrypt from "bcrypt";

export const hash = ({
  plainText,
  salt = Number(process.env.SALT),
}: {
  plainText: string;
  salt?: number;
}) => bcrypt.hashSync(plainText, salt);

export const compare = (plainText: string, hash: string) =>
  bcrypt.compareSync(plainText, hash);
