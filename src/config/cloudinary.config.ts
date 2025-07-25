import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config({ path: "./src/config/.env" });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
