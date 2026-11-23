
/**
 * SugarRisk - Blood Sugar Checker Methodology
 *
 * Reproduces the numeric classification bands
 * used in the original SugarRisk checker.
 *
 * These bands are illustrative, not diagnostic.
 * They must not be used to diagnose diabetes,
 * prediabetes or hypoglycemia.
 *
 * https://sugarrisk.com/blood-sugar-checker.html
 */

const GLUCOSE_FACTOR = 18.0;

const CONTEXTS = [
  "fasting",
  "premeal",
  "post2h",
  "random"
];

const UNITS = ["mgdl", "mmol"];

/**
 * Convert a glucose reading to mg/dL.
 */
export function glucoseToMgdl(value, unit = "mgdl") {
  if (!UNITS.includes(unit)) {
    throw new TypeError("Unsupported glucose unit.");
  }

  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(
      "Glucose must be a positive finite number."
    );
  }

  return unit === "mmol"
    ? value * GLUCOSE_FACTOR
    : value;
}

/**
 * Classify glucose using the original
 * SugarRisk numeric bands.
 *
 * Note:
 * - The original implementation uses the same
 *   bands for fasting and premeal.
 * - It also uses the same bands for post2h
 *   and random readings.
 * - Guideline selection is not implemented
 *   in the original classification function.
 */
export function classifyBloodSugar({
  glucose,
  context,
  unit = "mgdl"
}) {
  if (!CONTEXTS.includes(context)) {
    throw new TypeError(
      "Unsupported measurement context."
    );
  }

  const mgdl = glucoseToMgdl(glucose, unit);

  const fastingStyle =
    context === "fasting" || context === "premeal";

  let badge;
  let severity;
  let barPos;

  if (mgdl < 70) {
    badge = "Low";
    severity = "low";
    barPos = 5;
  } else if (fastingStyle) {
    if (mgdl < 100) {
      badge = "Normal";
      severity = "ok";
      barPos = 20;
    } else if (mgdl < 126) {
      badge = "Prediabetes range";
      severity = "borderline";
      barPos = 55;
    } else {
      badge = "Diabetes range";
      severity = "high";
      barPos = 85;
    }
  } else {
    if (mgdl < 140) {
      badge = "Normal";
      severity = "ok";
      barPos = 25;
    } else if (mgdl < 200) {
      badge = "Prediabetes range";
      severity = "borderline";
      barPos = 60;
    } else {
      badge = "Diabetes range";
      severity = "high";
      barPos = 90;
    }
  }

  return {
    glucose,
    unit,
    glucoseMgdl: Number(mgdl.toFixed(1)),
    context,
    badge,
    severity,
    barPos,
    methodology: "original-sugarrisk-bands",
    diagnostic: false
  };
}

