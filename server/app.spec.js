const http = require("http");
const Request = require("request");

describe("Server:", () => {
  var server;
  beforeAll(() => {
    app = require("./app");
    server = http.createServer(app);
    server.listen("3001");
  });
  afterAll(() => {
    server.close();
  });

  describe("GET /movies", () => {
    var data = {};
    beforeAll(done => {
      Request.get("http://localhost:3001/movies", (error, response, body) => {
        data.status = response.statusCode;
        data.body = body;
        done();
      });
    });
    it("should not have a status code of 200", () => {
      expect(data.status).not.toBe(200);
    });
    it("should contain authentication error in the Body", () => {
      expect(data.body).toContain("error");
    });
  });
  describe("POST /users/signup", () => {
    var data = {};
    beforeAll(done => {
      Request.post(
        {
          url: "http://localhost:3001/users/signup",
          form: {
            email: "henok@gmail.com",
            password: "admin"
          }
        },
        (error, response, body) => {
          data.status = response.statusCode;
          data.body = JSON.parse(body);
          done();
        }
      );
    });
    it("should reject with status code of 500", () => {
      expect(data.status).toBe(500);
    });
    it("should respond with 'username: can't be blank'", () => {
      expect(JSON.stringify(data.body)).toContain("username: can't be blank");
    });
  });
});
