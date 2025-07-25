import express from "express";
import { config } from "dotenv";
import bootstrap from "./src/app.controller";

config({ path: "./src/config/.env" });
const app = express();
const port: string | number = process.env.PORT || 5000;

bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
