const { getAllLAunches } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLAunches());
}

module.exports = {
  httpGetAllLaunches,
};
