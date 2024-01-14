const request = require("supertest");
const app = require("../../../app");

describe("Test GET /launches", () => {
  test("it should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect(200)
      .expect("Content-type", /json/);
  });
});
describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "Test 1 mission",
    rocket: "Test 1 rocket",
    target: "Test target planet",
    launchDate: "January 13,2028",
  };

  const launchDataWithoutDate = {
    mission: "Test 1 mission",
    rocket: "Test 1 rocket",
    target: "Test target planet",
  };

  test("it should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });
  test("it should catch missing required properties", () => {});
  test("it should catch invalid dates", () => {});
});
