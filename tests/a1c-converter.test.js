
import test from "node:test";
import assert from "node:assert/strict";

import {
  a1cToEag,
  eagToA1c
} from "../src/a1c-converter.js";

test("Converts A1C 5.7% to estimated glucose", () => {
  const result = a1cToEag(5.7);

  assert.equal(result.eagMgdl, 117);
  assert.equal(result.eagMmol, 6.5);
});

test("Converts A1C 6.5% to estimated glucose", () => {
  const result = a1cToEag(6.5);

  assert.equal(result.eagMgdl, 140);
  assert.equal(result.eagMmol, 7.8);
});

test("Converts A1C 7% to estimated glucose", () => {
  const result = a1cToEag(7);

  assert.equal(result.eagMgdl, 154);
  assert.equal(result.eagMmol, 8.6);
});

test("Converts estimated glucose to A1C", () => {
  const result = eagToA1c(154);

  assert.equal(result.a1c, 7.0);
  assert.equal(result.eagMgdl, 154);
});

test("Converts mmol/L glucose to A1C", () => {
  const result = eagToA1c(8.6, "mmol");

  assert.equal(result.a1c, 7.0);
  assert.equal(result.eagMgdl, 155);
});

test("Rejects A1C below supported range", () => {
  assert.throws(() => {
    a1cToEag(2.5);
  }, RangeError);
});

test("Rejects A1C above supported range", () => {
  assert.throws(() => {
    a1cToEag(21);
  }, RangeError);
});

test("Rejects invalid glucose values", () => {
  assert.throws(() => {
    eagToA1c(600);
  }, RangeError);
});

test("Rejects unsupported glucose units", () => {
  assert.throws(() => {
    eagToA1c(154, "invalid");
  }, TypeError);
});

test("Rejects non-numeric input", () => {
  assert.throws(() => {
    a1cToEag("5.7");
  }, RangeError);
});
