const http = require("http");
const app = require("./app");
const { loadingPlanetsData } = require("./models/planets.model");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadingPlanetsData();
  server.listen(PORT, () => {
    console.log(PORT);
  });
}

startServer();
