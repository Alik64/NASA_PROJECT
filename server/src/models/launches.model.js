const launchesDB = require("./launches.mongo");
const launches = new Map();
let latestFlightNumber = 100;
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

function existLaunchWithId(launchId) {
  return launches.has(launchId);
}
async function getAllLAunches() {
  return await launchesDB.find({},{ _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  await launchesDB.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

function addNewLaunch(launch) {
  latestFlightNumber++;

  // Directly modify the launch object
  Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["AB64", "NASA", "Space X"],
    flightNumber: latestFlightNumber,
  });

  launches.set(latestFlightNumber, launch);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existLaunchWithId,
  getAllLAunches,
  addNewLaunch,
  abortLaunchById,
};
