require("dotenv").config();

const http = require("http");

const app = require("./app");

const { mongoConnect } = require("./services/mongo");

const { loadingPlanetsData } = require("./models/planets.model");
const { loadingLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadingPlanetsData();
  await loadingLaunchesData();

  server.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });
}

startServer();
