const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");

const startServer = () =>
  new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });

const stopServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const request = (baseUrl, path, { method = "GET", body } = {}) =>
  new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const payload = body ? JSON.stringify(body) : null;

    const req = http.request(
      url,
      {
        method,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(payload),
            }
          : {},
      },
      (res) => {
        let raw = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body: raw ? JSON.parse(raw) : null,
          });
        });
      },
    );

    req.on("error", reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });

test("GET /health returns ok payload", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await request(baseUrl, "/health");

    assert.equal(response.statusCode, 200);
    assert.equal(response.body.status, "ok");
    assert.equal(typeof response.body.timestamp, "string");
  } finally {
    await stopServer(server);
  }
});

test("unknown routes return 404 payload", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await request(baseUrl, "/missing-route");

    assert.equal(response.statusCode, 404);
    assert.deepEqual(response.body, {
      status: "error",
      message: "Route not found",
    });
  } finally {
    await stopServer(server);
  }
});

test("invalid clinicId is rejected before hitting controllers", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await request(
      baseUrl,
      "/api/v1/clinics/not-a-number/users",
    );

    assert.equal(response.statusCode, 422);
    assert.equal(response.body.status, "error");
    assert.equal(response.body.message, "Validation failed");
    assert.ok(response.body.errors.some((error) => error.field === "clinicId"));
  } finally {
    await stopServer(server);
  }
});

test("invalid appointment payload returns field-level validation errors", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await request(baseUrl, "/api/v1/clinics/1/appointments", {
      method: "POST",
      body: {
        user_id: 0,
        staff_id: "x",
        service_id: -2,
        appointment_date: "not-a-date",
      },
    });

    assert.equal(response.statusCode, 422);
    assert.equal(response.body.status, "error");
    assert.equal(response.body.message, "Validation failed");
    assert.ok(response.body.errors.length >= 4);
  } finally {
    await stopServer(server);
  }
});
