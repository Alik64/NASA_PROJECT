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
  test("it should respond with 200 success", () => {});
  test("it should catch missing required properties", () => {});
  test("it should catch invalid dates", () => {});
});
