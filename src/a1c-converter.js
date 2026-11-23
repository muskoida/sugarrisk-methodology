
/**
 * SugarRisk - A1C / Estimated Average Glucose Converter
 *
 * Converts HbA1c (%) to estimated average glucose (eAG)
 * and estimated average glucose back to HbA1c.
 *
 * Based on the ADAG equation.
 *
 * Educational use only. Not a diagnostic tool.
 * https://sugarrisk.com/a1c-to-average-glucose.html
 */

const MGDL_PER_MMOL = 18.0182;

function validateNumber(value, min, max, label) {
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
 * Convert HbA1c percentage to estimated average glucose.
 *
 * @param {number} a1c - HbA1c percentage (3 to 20).
 * @returns {{a1c: number, eagMgdl: number, eagMmol: number}}
 */
export function a1cToEag(a1c) {
  validateNumber(a1c, 3, 20, "HbA1c");

  const mgdl = 28.7 * a1c - 46.7;
  const mmol = mgdl / MGDL_PER_MMOL;

  return {
    a1c,
    eagMgdl: Math.round(mgdl),
    eagMmol: Number(mmol.toFixed(1))
  };
}

/**
 * Convert estimated average glucose to HbA1c.
 *
 * @param {number} glucose - Estimated average glucose.
 * @param {"mgdl"|"mmol"} [unit="mgdl"]
 * @returns {{a1c: number, eagMgdl: number, eagMmol: number}}
 */
export function eagToA1c(glucose, unit = "mgdl") {
  if (unit !== "mgdl" && unit !== "mmol") {
    throw new TypeError("Unsupported glucose unit.");
  }

  if (unit === "mgdl") {
    validateNumber(
      glucose, 40, 550, "Estimated average glucose"
    );
  } else {
    validateNumber(
      glucose, 2, 30, "Estimated average glucose"
    );
  }

  const mgdl =
    unit === "mmol"
      ? glucose * MGDL_PER_MMOL
      : glucose;

  const a1c = (mgdl + 46.7) / 28.7;

  return {
    a1c: Number(a1c.toFixed(1)),
    eagMgdl: Math.round(mgdl),
    eagMmol: Number((mgdl / MGDL_PER_MMOL).toFixed(1))
  };
}
