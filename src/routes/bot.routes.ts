// import express from "express";
// import { startBot, stopBot } from "../controllers/bot.controller";

// const router = express.Router();

// router.get("/start-bot", async (req, res) => {
//   console.log("✅ Received request to start bot");
//   try {
//     await startBot();
//     res.status(200).json({ message: "Telegram bot started successfully!" });
//   } catch (error) {
//     console.error("❌ Error starting bot:", error);
//     res.status(500).json({ error: "Failed to start Telegram bot" });
//   }
// });

// router.get("/stop-bot", async (req, res) => {
//   console.log("✅ Received request to stop bot");
//   try {
//     stopBot();
//     res.status(200).json({ message: "Telegram bot stopped successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to stop Telegram bot" });
//   }
// });

// export default router;
