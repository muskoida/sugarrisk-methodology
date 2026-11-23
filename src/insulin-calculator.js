
/**
 * SugarRisk - Insulin Calculation Methodology
 *
 * Educational arithmetic utilities for understanding
 * insulin-to-carbohydrate ratios, glucose correction
 * factors and insulin on board.
 *
 * These functions do not determine or recommend
 * an insulin dose for administration.
 *
 * https://sugarrisk.com/insulin-calculator.html
 */

const GLUCOSE_LIMITS = {
  mgdl: [20, 700],
  mmol: [1, 40]
};

function validateRange(value, min, max, label) {
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new RangeError(
      `${label} must be between ${min} and ${max}.`
    );
  }
}

/**
 * Demonstrate the carbohydrate-to-insulin ratio formula.
 *
 * ICR must be an externally established value.
 */
export function calculateCarbRatioComponent({
  carbs,
  carbRatio
}) {
  validateRange(carbs, 0, 500, "Carbohydrates");
  validateRange(carbRatio, 1, 100, "Carb ratio");

  return {
    carbohydrates: carbs,
    carbRatio,
    mathematicalUnits: Number(
      (carbs / carbRatio).toFixed(2)
    )
  };
}

/**
 * Demonstrate the glucose correction formula.
 *
 * The sensitivity factor and target must be supplied
 * externally, not inferred by this library.
 */
export function calculateCorrectionComponent({
  currentGlucose,
  targetGlucose,
  isf,
  glucoseUnit = "mgdl"
}) {
  if (!Object.hasOwn(GLUCOSE_LIMITS, glucoseUnit)) {
    throw new TypeError("Unsupported glucose unit.");
  }

  const [min, max] = GLUCOSE_LIMITS[glucoseUnit];

  validateRange(
    currentGlucose, min, max, "Current glucose"
  );

  validateRange(
    targetGlucose, min, max, "Target glucose"
  );

  if (!Number.isFinite(isf) || isf <= 0) {
    throw new RangeError(
      "Insulin sensitivity factor must be positive."
    );
  }

  const glucoseDifference = Math.max(
    0,
    currentGlucose - targetGlucose
  );

  return {
    glucoseUnit,
    currentGlucose,
    targetGlucose,
    isf,
    glucoseDifference,
    mathematicalUnits: Number(
      (glucoseDifference / isf).toFixed(2)
    )
  };
}

/**
 * Demonstrate how a supplied IOB value relates
 * mathematically to a positive correction component.
 *
 * Does not estimate insulin on board or determine
 * whether a correction is clinically appropriate.
 */
export function describeActiveInsulin({
  correctionComponent,
  activeInsulin = 0
}) {
  if (
    !Number.isFinite(correctionComponent) ||
    correctionComponent < 0
  ) {
    throw new RangeError(
      "Correction component must be non-negative."
    );
  }

  validateRange(
    activeInsulin, 0, 100, "Active insulin"
  );

  return {
    correctionComponent,
    activeInsulin,
    arithmeticDifference: Number(
      (correctionComponent - activeInsulin).toFixed(2)
    ),
    note:
      "Arithmetic comparison only; not an insulin dosing instruction."
  };
}
