import { describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health").expect(200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.service, "dynesis-tech-api");
  });
});
