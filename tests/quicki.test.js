
import test from "node:test";
import assert from "node:assert/strict";
import { calculateQuicki } from "../src/quicki.js";

test("Calculates QUICKI using mg/dL", () => {
  const result = calculateQuicki({
    glucose: 90,
    insulin: 10
  });

  assert.equal(result.quicki, 0.3385);
  assert.equal(result.homaIR, 2.22);
});

test("Calculates QUICKI using mmol/L", () => {
  const result = calculateQuicki({
    glucose: 5,
    insulin: 10,
    glucoseUnit: "mmol"
  });

  assert.equal(result.quicki, 0.3384);
  assert.equal(result.homaIR, 2.22);
});

test("Converts insulin from pmol/L", () => {
  const result = calculateQuicki({
    glucose: 90,
    insulin: 60,
    insulinUnit: "pmol"
  });

  assert.equal(result.quicki, 0.3385);
  assert.equal(result.approximateInsulinConversion, true);
});

test("Returns logarithm values", () => {
  const result = calculateQuicki({
    glucose: 100,
    insulin: 10
  });

  assert.equal(result.logInsulin, 1);
  assert.equal(result.logGlucose, 2);
  assert.equal(result.quicki, 0.3333);
});

test("Rejects glucose outside supported range", () => {
  assert.throws(() => {
    calculateQuicki({
      glucose: 700,
      insulin: 10
    });
  }, RangeError);
});

test("Rejects invalid insulin values", () => {
  assert.throws(() => {
    calculateQuicki({
      glucose: 90,
      insulin: -5
    });
  }, RangeError);
});

test("Rejects unsupported units", () => {
  assert.throws(() => {
    calculateQuicki({
      glucose: 90,
      insulin: 10,
      glucoseUnit: "invalid"
    });
  }, TypeError);
});

test("Rejects non-numeric values", () => {
  assert.throws(() => {
    calculateQuicki({
      glucose: "90",
      insulin: 10
    });
  }, RangeError);
});
