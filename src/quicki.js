
/**
 * SugarRisk - QUICKI Insulin Sensitivity Calculator
 *
 * Calculates QUICKI and HOMA-IR using fasting
 * glucose and insulin measurements.
 *
 * Educational use only. Not a diagnostic tool.
 * https://sugarrisk.com/quicki-calculator.html
 */

const GLUCOSE_FACTOR = 18.0182;
const INSULIN_FACTOR = 6;

const LIMITS = {
  glucose: {
    mgdl: [20, 600],
    mmol: [1.1, 33.3]
  },
  insulin: {
    uiu: [0.1, 300],
    pmol: [0.6, 1800]
  }
};

export function calculateQuicki({
  glucose,
  insulin,
  glucoseUnit = "mgdl",
  insulinUnit = "uiu"
}) {
  if (!Object.hasOwn(LIMITS.glucose, glucoseUnit)) {
    throw new TypeError("Unsupported glucose unit.");
  }

  if (!Object.hasOwn(LIMITS.insulin, insulinUnit)) {
    throw new TypeError("Unsupported insulin unit.");
  }

  const [gMin, gMax] = LIMITS.glucose[glucoseUnit];
  const [iMin, iMax] = LIMITS.insulin[insulinUnit];

  if (
    !Number.isFinite(glucose) ||
    glucose < gMin ||
    glucose > gMax
  ) {
    throw new RangeError(
      `Glucose must be between ${gMin} and ${gMax}.`
    );
  }

  if (
    !Number.isFinite(insulin) ||
    insulin < iMin ||
    insulin > iMax
  ) {
    throw new RangeError(
      `Insulin must be between ${iMin} and ${iMax}.`
    );
  }

  const glucoseMgdl =
    glucoseUnit === "mgdl"
      ? glucose
      : glucose * GLUCOSE_FACTOR;

  const glucoseMmol = glucoseMgdl / GLUCOSE_FACTOR;

  const insulinUIU =
    insulinUnit === "uiu"
      ? insulin
      : insulin / INSULIN_FACTOR;

  const logInsulin = Math.log10(insulinUIU);
  const logGlucose = Math.log10(glucoseMgdl);

  const denominator = logInsulin + logGlucose;

  if (
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    throw new RangeError(
      "The entered values cannot produce a valid QUICKI index."
    );
  }

  const quicki = 1 / denominator;

  const homaIR =
    (insulinUIU * glucoseMmol) / 22.5;

  return {
    quicki: Number(quicki.toFixed(4)),
    homaIR: Number(homaIR.toFixed(2)),
    glucoseMgdl: Number(glucoseMgdl.toFixed(1)),
    glucoseMmol: Number(glucoseMmol.toFixed(2)),
    insulinUIU: Number(insulinUIU.toFixed(2)),
    logInsulin: Number(logInsulin.toFixed(4)),
    logGlucose: Number(logGlucose.toFixed(4)),
    approximateInsulinConversion:
      insulinUnit === "pmol"
  };
}
