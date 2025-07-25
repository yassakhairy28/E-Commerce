import { ApiError } from "../middlewares/error.handler.middleware.ts";

export function parseExpiresAt(input: any): Date {
  let parsed = new Date(input);

  if (isNaN(parsed.getTime())) {
    const regex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const match = input.match(regex);

    if (match) {
      const [_, day, month, year] = match;
      const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T00:00:00.000Z`;
      parsed = new Date(iso);
    }
  }

  if (isNaN(parsed.getTime())) {
    throw new ApiError(
      "Invalid 'expiresAt' format. Use ISO format or 'dd-mm-yyyy'.",
      400
    );
  }

  const now = new Date();
  if (parsed.getTime() <= now.getTime()) {
    throw new ApiError("'expiresAt' must be a future date.", 400);
  }

  return parsed;
}
