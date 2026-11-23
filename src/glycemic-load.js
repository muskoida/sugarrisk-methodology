
/**
 * SugarRisk - Glycemic Load Calculator
 *
 * Calculates glycemic load for individual foods
 * and the combined glycemic load of a meal.
 *
 * GL = (GI × available carbohydrates × servings) / 100
 *
 * Educational use only. Not a diagnostic tool.
 * https://sugarrisk.com/glycemic-load-calculator.html
 */

export const FOODS = Object.freeze({
  "white-bread": {
    name: "White bread", gi: 71, carbs: 14, serving: "30 g"
  },
  "whole-wheat-bread": {
    name: "Whole wheat bread", gi: 71, carbs: 13, serving: "30 g"
  },
  "rolled-oats": {
    name: "Rolled oats, cooked", gi: 55, carbs: 24, serving: "250 g"
  },
  "cornflakes": {
    name: "Cornflakes", gi: 93, carbs: 25, serving: "30 g"
  },
  "white-rice": {
    name: "White rice, cooked", gi: 89, carbs: 48, serving: "150 g"
  },
  "brown-rice": {
    name: "Brown rice, cooked", gi: 50, carbs: 32, serving: "150 g"
  },
  "quinoa": {
    name: "Quinoa, cooked", gi: 53, carbs: 25, serving: "150 g"
  },
  "baked-potato": {
    name: "Baked potato", gi: 111, carbs: 30, serving: "150 g"
  },
  "apple": {
    name: "Apple", gi: 39, carbs: 15, serving: "120 g"
  },
  "banana": {
    name: "Ripe banana", gi: 62, carbs: 26, serving: "120 g"
  },
  "watermelon": {
    name: "Watermelon", gi: 72, carbs: 6, serving: "120 g"
  },
  "orange": {
    name: "Orange", gi: 40, carbs: 10, serving: "120 g"
  },
  "lentils": {
    name: "Lentils, cooked", gi: 29, carbs: 17, serving: "150 g"
  },
  "chickpeas": {
    name: "Chickpeas, cooked", gi: 28, carbs: 29, serving: "150 g"
  }
});

/**
 * Calculate glycemic load for a food.
 *
 * @param {object} options
 * @param {number} options.gi - Glycemic index (0-150)
 * @param {number} options.carbs - Available carbs in grams (0-1000)
 * @param {number} [options.servings=1] - Number of servings
 */
export function calculateGlycemicLoad({
  gi,
  carbs,
  servings = 1
}) {
  if (!Number.isFinite(gi) || gi < 0 || gi > 150) {
    throw new RangeError("GI must be between 0 and 150.");
  }

  if (!Number.isFinite(carbs) || carbs < 0 || carbs > 1000) {
    throw new RangeError(
      "Available carbohydrates must be between 0 and 1000 grams."
    );
  }

  if (
    !Number.isFinite(servings) ||
    servings <= 0 ||
    servings > 100
  ) {
    throw new RangeError(
      "Servings must be greater than 0 and at most 100."
    );
  }

  const gl = (gi * carbs * servings) / 100;

  return {
    gl: Number(gl.toFixed(1)),
    category: getGlycemicLoadCategory(gl),
    gi,
    carbs,
    servings
  };
}

/**
 * Classify the glycemic load of a food portion.
 */
export function getGlycemicLoadCategory(gl) {
  if (!Number.isFinite(gl) || gl < 0) {
    throw new RangeError("Glycemic load must be non-negative.");
  }

  if (gl <= 10) return "Low";
  if (gl < 20) return "Medium";
  return "High";
}

/**
 * Calculate the combined glycemic load of a meal.
 *
 * Each food must contain gi, carbs and optionally servings.
 */
export function calculateMealGlycemicLoad(foods) {
  if (!Array.isArray(foods)) {
    throw new TypeError("Foods must be an array.");
  }

  const items = foods.map((food) => {
    const result = calculateGlycemicLoad(food);

    return {
      name: food.name || "Custom food",
      ...result
    };
  });

  const total = items.reduce((sum, item) => {
    return sum + (item.gi * item.carbs * item.servings) / 100;
  }, 0);

  return {
    items,
    totalGL: Number(total.toFixed(1)),
    foodCount: items.length
  };
}

/**
 * Calculate glycemic load using a predefined food.
 */
export function calculateFoodGlycemicLoad(
  foodId,
  servings = 1
) {
  if (!Object.hasOwn(FOODS, foodId)) {
    throw new RangeError("Unknown food ID.");
  }

  const food = FOODS[foodId];

  return {
    name: food.name,
    serving: food.serving,
    ...calculateGlycemicLoad({
      gi: food.gi,
      carbs: food.carbs,
      servings
    })
  };
}
