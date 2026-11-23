
import test from "node:test";
import assert from "node:assert/strict";

import {
  FOODS,
  calculateGlycemicLoad,
  getGlycemicLoadCategory,
  calculateMealGlycemicLoad,
  calculateFoodGlycemicLoad
} from "../src/glycemic-load.js";

test("Calculates glycemic load for one serving", () => {
  const result = calculateGlycemicLoad({
    gi: 70,
    carbs: 30
  });

  assert.equal(result.gl, 21);
  assert.equal(result.category, "High");
});

test("Calculates glycemic load for multiple servings", () => {
  const result = calculateGlycemicLoad({
    gi: 50,
    carbs: 20,
    servings: 2
  });

  assert.equal(result.gl, 20);
  assert.equal(result.category, "High");
});

test("Classifies low, medium and high GL", () => {
  assert.equal(getGlycemicLoadCategory(10), "Low");
  assert.equal(getGlycemicLoadCategory(10.5), "Medium");
  assert.equal(getGlycemicLoadCategory(19.9), "Medium");
  assert.equal(getGlycemicLoadCategory(20), "High");
});

test("Calculates total glycemic load of a meal", () => {
  const result = calculateMealGlycemicLoad([
    { name: "Food A", gi: 50, carbs: 20 },
    { name: "Food B", gi: 60, carbs: 30 }
  ]);

  assert.equal(result.totalGL, 28);
  assert.equal(result.foodCount, 2);
  assert.equal(result.items.length, 2);
});

test("Calculates predefined apple glycemic load", () => {
  const result = calculateFoodGlycemicLoad("apple");

  assert.equal(result.name, "Apple");
  assert.equal(result.gl, 5.8);
  assert.equal(result.category, "Low");
});

test("Calculates predefined food with two servings", () => {
  const result = calculateFoodGlycemicLoad("banana", 2);

  assert.equal(result.gl, 32.2);
  assert.equal(result.category, "High");
});

test("Contains all 14 predefined foods", () => {
  assert.equal(Object.keys(FOODS).length, 14);
});

test("Rejects invalid glycemic index", () => {
  assert.throws(() => {
    calculateGlycemicLoad({ gi: 160, carbs: 30 });
  }, RangeError);
});

test("Rejects negative carbohydrates", () => {
  assert.throws(() => {
    calculateGlycemicLoad({ gi: 70, carbs: -5 });
  }, RangeError);
});

test("Rejects invalid servings", () => {
  assert.throws(() => {
    calculateGlycemicLoad({
      gi: 70,
      carbs: 30,
      servings: 0
    });
  }, RangeError);
});

test("Rejects unknown predefined food", () => {
  assert.throws(() => {
    calculateFoodGlycemicLoad("unknown-food");
  }, RangeError);
});

test("Rejects invalid meal input", () => {
  assert.throws(() => {
    calculateMealGlycemicLoad("not-an-array");
  }, TypeError);
});

test("Handles an empty meal", () => {
  const result = calculateMealGlycemicLoad([]);

  assert.equal(result.totalGL, 0);
  assert.equal(result.foodCount, 0);
});

