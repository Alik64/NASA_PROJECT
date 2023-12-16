const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration 2000",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27,2030"),
  destination: "Kepler-442 b",
  customer: ["AB64", "NASA", "Space X"],
  upcoming: true,
  success: true,
};
launches.set(launch.flightNumber, launch);

module.exports = {
  launches,
};
