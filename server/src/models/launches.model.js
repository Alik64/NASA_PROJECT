const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration 2000",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27,2030"),
  target: "Kepler-442 b",
  customers: ["AB64", "NASA", "Space X"],
  upcoming: true,
  success: true,
};
saveLaunch(launch);

async function existLaunchWithId(launchId) {
  return await launchesDB.findOne({ flightNumber: launchId });
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function getAllLAunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["AB64", "NASA", "Space X"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  existLaunchWithId,
  getAllLAunches,
  scheduleNewLaunch,
  abortLaunchById,
};
