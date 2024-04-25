const axios = require("axios");

const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, //fligth number
  mission: "Kepler Exploration 2000", //name of the mission
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27,2030"), //date_local
  target: "Kepler-442 b",
  customers: ["AB64", "NASA", "Space X"],//payload.customers for each payload
  upcoming: true, // upcoming
  success: true, //success
};
saveLaunch(launch);

const SPACEX_LAUNCHES_API_URL = "https://api.spacexdata.com/v4/launches/query";
 async function loadLaunchData() {
   console.log("Downloading launch data...");
   const response = await axios.post(SPACEX_LAUNCHES_API_URL, {
     query: {},
     options: {
       pagination: false,
       populate: [
         {
           path: "rocket",
           select: {
             name: 1,
           },
         },
         {
           path: "payloads",
           select: {
             customers: 1,
           },
         },
       ],
     },
   });
   const launchDocs = response.data.docs;

   for (const launchDoc of launchDocs) {
     const payloads = launchDoc["payloads"];
     const customers = payloads.flatMap((payload) => {
       return payload["customers"];
     });
     const launch = {
       flightNumber: launchDoc["flight_number"],
       mission: launchDoc["name"],
       rocket: launchDoc["rocket"]["name"],
       launchDate: launchDoc["date_local"],
       upcoming: launchDoc["upcoming"],
       success: launchDoc["success"],
       customers,
     };
    console.log(`${launch.flightNumber} ${launch.mission}`);
   }
 }

 async function findLaunch(filter){
  return await launchesDB.findOne(filter);
 }
async function existLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
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
  loadLaunchData,
  existLaunchWithId,
  getAllLAunches,
  scheduleNewLaunch,
  abortLaunchById,
};
