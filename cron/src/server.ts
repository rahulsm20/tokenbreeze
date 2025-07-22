import express from "express";
import { startIntervalCron } from "./cron";
//---------------------------------------------------

const app = express();
const PORT = process.env.PORT || 3000;

//---------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//---------------------------------------------------

app.get("/", (_req, res) => {
  res.json({
    service: "Tokenbreeze Cron Service",
    status: "running",
    version: "1.0.0",
    message: "Cron job is running every 10 minutes",
  });
});

app.get("/trigger", startIntervalCron);

//---------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//---------------------------------------------------
