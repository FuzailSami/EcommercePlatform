import express from "express";
import { registerRoutes } from "./routes.js";
import { setupVite } from "./vite.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("dist"));

(async () => {
  const server = await registerRoutes(app);
  
  // Setup Vite in development or serve static files
  setupVite(app, server);

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
})();