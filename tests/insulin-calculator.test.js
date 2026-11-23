
import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateCarbRatioComponent,
  calculateCorrectionComponent,
  describeActiveInsulin
} from "../src/insulin-calculator.js";

test("Calculates carbohydrate ratio component", () => {
  const result = calculateCarbRatioComponent({
    carbs: 60,
    carbRatio: 10
  });

  assert.equal(result.mathematicalUnits, 6);
});

test("Handles zero carbohydrates", () => {
  const result = calculateCarbRatioComponent({
    carbs: 0,
    carbRatio: 10
  });

  assert.equal(result.mathematicalUnits, 0);
});

test("Calculates positive glucose correction component", () => {
  const result = calculateCorrectionComponent({
    currentGlucose: 160,
    targetGlucose: 110,
    isf: 40
  });

  assert.equal(result.glucoseDifference, 50);
  assert.equal(result.mathematicalUnits, 1.25);
});

test("Returns zero correction when glucose is below target", () => {
  const result = calculateCorrectionComponent({
    currentGlucose: 90,
    targetGlucose: 110,
    isf: 40
  });

  assert.equal(result.mathematicalUnits, 0);
});

test("Supports mmol/L glucose values", () => {
  const result = calculateCorrectionComponent({
    currentGlucose: 8.9,
    targetGlucose: 6.1,
    isf: 2.2,
    glucoseUnit: "mmol"
  });

  assert.equal(result.mathematicalUnits, 1.27);
});

test("Describes active insulin arithmetic", () => {
  const result = describeActiveInsulin({
    correctionComponent: 1.25,
    activeInsulin: 1
  });

  assert.equal(result.arithmeticDifference, 0.25);
});

test("Preserves negative arithmetic difference without recommending a dose", () => {
  const result = describeActiveInsulin({
    correctionComponent: 1,
    activeInsulin: 2
  });

  assert.equal(result.arithmeticDifference, -1);
});

test("Rejects invalid carbohydrate amounts", () => {
  assert.throws(() => {
    calculateCarbRatioComponent({
      carbs: 600,
      carbRatio: 10
    });
  }, RangeError);
});

test("Rejects invalid carbohydrate ratio", () => {
  assert.throws(() => {
    calculateCarbRatioComponent({
      carbs: 60,
      carbRatio: 0
    });
  }, RangeError);
});

test("Rejects unsupported glucose units", () => {
  assert.throws(() => {
    calculateCorrectionComponent({
      currentGlucose: 160,
      targetGlucose: 110,
      isf: 40,
      glucoseUnit: "invalid"
    });
  }, TypeError);
});

test("Rejects invalid sensitivity factor", () => {
  assert.throws(() => {
    calculateCorrectionComponent({
      currentGlucose: 160,
      targetGlucose: 110,
      isf: 0
    });
  }, RangeError);
});

test("Rejects excessive active insulin", () => {
  assert.throws(() => {
    describeActiveInsulin({
      correctionComponent: 1.25,
      activeInsulin: 150
    });
  }, RangeError);
});

test("Rejects non-numeric input", () => {
  assert.throws(() => {
    calculateCarbRatioComponent({
      carbs: "60",
      carbRatio: 10
    });
  }, RangeError);
});
