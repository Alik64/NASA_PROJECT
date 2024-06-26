require("dotenv").config();

const http = require("http");

const app = require("./app");

const { mongoConnect } = require("./services/mongo");

const { loadingPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await await loadingPlanetsData();
  server.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });
}

startServer();
