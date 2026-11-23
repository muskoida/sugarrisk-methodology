
import test from "node:test";
import assert from "node:assert/strict";
import { calculateHoma } from "../src/homa-ir.js";

test("Calculates HOMA-IR using mg/dL", () => {
  const result = calculateHoma({
    glucose: 90,
    insulin: 10
  });

  assert.equal(result.homaIR, 2.22);
  assert.equal(result.homaBeta, 133.8);
});

test("Calculates HOMA-IR using mmol/L", () => {
  const result = calculateHoma({
    glucose: 5,
    insulin: 10,
    glucoseUnit: "mmol"
  });

  assert.equal(result.homaIR, 2.22);
  assert.equal(result.homaBeta, 133.3);
});

test("Converts insulin from pmol/L", () => {
  const result = calculateHoma({
    glucose: 5,
    insulin: 60,
    glucoseUnit: "mmol",
    insulinUnit: "pmol"
  });

  assert.equal(result.homaIR, 2.22);
  assert.equal(result.approximateInsulinConversion, true);
});

test("Does not calculate HOMA-beta at low glucose", () => {
  const result = calculateHoma({
    glucose: 3.5,
    insulin: 10,
    glucoseUnit: "mmol"
  });

  assert.equal(result.homaBeta, null);
});

test("Rejects glucose outside supported range", () => {
  assert.throws(() => {
    calculateHoma({
      glucose: 700,
      insulin: 10
    });
  }, RangeError);
});

test("Rejects unsupported units", () => {
  assert.throws(() => {
    calculateHoma({
      glucose: 90,
      insulin: 10,
      glucoseUnit: "invalid"
    });
  }, TypeError);
});

test("Rejects non-numeric values", () => {
  assert.throws(() => {
    calculateHoma({
      glucose: "90",
      insulin: 10
    });
  }, RangeError);
});

