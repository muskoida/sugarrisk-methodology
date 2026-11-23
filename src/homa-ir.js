
/**
 * SugarRisk - HOMA-IR and HOMA-beta Calculator
 * Based on the original HOMA1 equations.
 *
 * Educational use only.
 * https://sugarrisk.com/homa-ir-calculator.html
 */

const GLUCOSE_CONVERSION = 18.0182;
const INSULIN_CONVERSION = 6;

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

export function calculateHoma({
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

  const glucoseMmol =
    glucoseUnit === "mgdl"
      ? glucose / GLUCOSE_CONVERSION
      : glucose;

  const glucoseMgdl =
    glucoseMmol * GLUCOSE_CONVERSION;

  const insulinUIU =
    insulinUnit === "pmol"
      ? insulin / INSULIN_CONVERSION
      : insulin;

  const homaIR =
    (insulinUIU * glucoseMmol) / 22.5;

  const homaBeta =
    glucoseMmol > 3.5
      ? (20 * insulinUIU) / (glucoseMmol - 3.5)
      : null;

  return {
    homaIR: Number(homaIR.toFixed(2)),
    homaBeta:
      homaBeta === null
        ? null
        : Number(homaBeta.toFixed(1)),
    glucoseMgdl: Number(glucoseMgdl.toFixed(1)),
    glucoseMmol: Number(glucoseMmol.toFixed(2)),
    insulinUIU: Number(insulinUIU.toFixed(2)),
    approximateInsulinConversion:
      insulinUnit === "pmol"
  };
}

