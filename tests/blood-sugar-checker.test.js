
import test from "node:test";
import assert from "node:assert/strict";

import {
  glucoseToMgdl,
  classifyBloodSugar
} from "../src/blood-sugar-checker.js";

test("Converts mmol/L glucose to mg/dL", () => {
  assert.equal(glucoseToMgdl(5.5, "mmol"), 99);
});

test("Preserves mg/dL glucose values", () => {
  assert.equal(glucoseToMgdl(100, "mgdl"), 100);
});

test("Classifies normal fasting glucose", () => {
  const result = classifyBloodSugar({
    glucose: 95,
    context: "fasting"
  });

  assert.equal(result.badge, "Normal");
  assert.equal(result.severity, "ok");
});

test("Classifies fasting prediabetes band", () => {
  const result = classifyBloodSugar({
    glucose: 110,
    context: "fasting"
  });

  assert.equal(result.badge, "Prediabetes range");
  assert.equal(result.severity, "borderline");
});

test("Classifies fasting diabetes band", () => {
  const result = classifyBloodSugar({
    glucose: 126,
    context: "fasting"
  });

  assert.equal(result.badge, "Diabetes range");
  assert.equal(result.severity, "high");
});

test("Classifies low glucose", () => {
  const result = classifyBloodSugar({
    glucose: 65,
    context: "fasting"
  });

  assert.equal(result.badge, "Low");
  assert.equal(result.severity, "low");
});

test("Classifies normal post-meal glucose", () => {
  const result = classifyBloodSugar({
    glucose: 120,
    context: "post2h"
  });

  assert.equal(result.badge, "Normal");
});

test("Classifies elevated post-meal glucose band", () => {
  const result = classifyBloodSugar({
    glucose: 160,
    context: "post2h"
  });

  assert.equal(result.badge, "Prediabetes range");
});

test("Classifies high post-meal glucose band", () => {
  const result = classifyBloodSugar({
    glucose: 200,
    context: "post2h"
  });

  assert.equal(result.badge, "Diabetes range");
});

test("Supports mmol/L classification", () => {
  const result = classifyBloodSugar({
    glucose: 6,
    context: "fasting",
    unit: "mmol"
  });

  assert.equal(result.glucoseMgdl, 108);
  assert.equal(result.badge, "Prediabetes range");
});

test("Supports premeal context", () => {
  const result = classifyBloodSugar({
    glucose: 95,
    context: "premeal"
  });

  assert.equal(result.badge, "Normal");
});

test("Preserves original random-reading classification", () => {
  const result = classifyBloodSugar({
    glucose: 160,
    context: "random"
  });

  assert.equal(result.badge, "Prediabetes range");
  assert.equal(result.diagnostic, false);
});

test("Rejects unsupported measurement context", () => {
  assert.throws(() => {
    classifyBloodSugar({
      glucose: 100,
      context: "invalid"
    });
  }, TypeError);
});

test("Rejects unsupported glucose units", () => {
  assert.throws(() => {
    glucoseToMgdl(100, "invalid");
  }, TypeError);
});

test("Rejects negative glucose values", () => {
  assert.throws(() => {
    glucoseToMgdl(-10);
  }, RangeError);
});

test("Rejects non-numeric glucose values", () => {
  assert.throws(() => {
    glucoseToMgdl("100");
  }, RangeError);
});

test("Marks classification as non-diagnostic", () => {
  const result = classifyBloodSugar({
    glucose: 100,
    context: "fasting"
  });

  assert.equal(result.diagnostic, false);
  assert.equal(
    result.methodology,
    "original-sugarrisk-bands"
  );
});
