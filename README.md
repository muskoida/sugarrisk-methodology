
# SugarRisk – Metabolic Health Calculators

**Open-source JavaScript utilities for metabolic health calculations, glucose measurements, and insulin resistance assessment.**

SugarRisk is an educational project focused on making common metabolic health calculations easier to understand and access.

This repository is being developed as a collection of lightweight JavaScript utilities, with transparent formulas, input validation, documentation, and practical examples.

The project is inspired by the interactive health calculators available at [SugarRisk.com](https://sugarrisk.com).

---

## Health Calculators

The SugarRisk website includes six interactive tools:

### 1. Insulin Calculator
Explore educational calculations involving insulin-to-carbohydrate ratios (ICR), insulin sensitivity factors (ISF), blood glucose correction components, and insulin on board (IOB). The module demonstrates mathematical formulas without providing insulin dosing recommendations.

### 2. HOMA-IR Calculator
Calculate the Homeostatic Model Assessment of Insulin Resistance (HOMA-IR) using fasting glucose and insulin values.

### 3. QUICKI Calculator
Estimate the Quantitative Insulin Sensitivity Check Index (QUICKI) from fasting glucose and insulin measurements.

### 4. Glycemic Load Calculator
Calculate the glycemic load of foods and meals using glycemic index values and available carbohydrate content.

### 5. A1C Converter
Convert HbA1c percentages into estimated average glucose (eAG) values and vice versa.

### 6. Blood Sugar Checker
Explore educational information about blood glucose measurements and commonly used reference ranges.

---

## Project Goals

- Provide transparent implementations of established calculation formulas.
- Support commonly used measurement units.
- Include input validation and clear error handling.
- Offer reusable JavaScript functions.
- Provide practical examples and automated tests.
- Make health-related calculations easier to understand.


## Development Status

**Six JavaScript modules implemented with automated tests.**

The repository contains standalone JavaScript utilities extracted and adapted from the calculation methodologies used on SugarRisk.com.

### Available Modules

| Module | Source | Tests |
|---|---|---|
| HOMA-IR Calculator | `src/homa-ir.js` | `tests/homa-ir.test.js` |
| QUICKI Calculator | `src/quicki.js` | `tests/quicki.test.js` |
| A1C / eAG Converter | `src/a1c-converter.js` | `tests/a1c-converter.test.js` |
| Glycemic Load Calculator | `src/glycemic-load.js` | `tests/glycemic-load.test.js` |
| Insulin Calculator | `src/insulin-calculator.js` | `tests/insulin-calculator.test.js` |
| Blood Sugar Checker | `src/blood-sugar-checker.js` | `tests/blood-sugar-checker.test.js` |

### Testing

The project uses the built-in Node.js test runner.

Run all tests locally:

```bash
npm test
```

Automated tests also run through GitHub Actions.

### Technical Features

- Pure JavaScript ES modules
- No external runtime dependencies
- Input validation and error handling
- Support for common glucose measurement units
- Transparent mathematical formulas
- Automated unit tests
- Educational, non-diagnostic outputs


## Try the Interactive Calculators

Explore the browser-based tools at:

**[SugarRisk.com – Health Calculators](https://sugarrisk.com)**

No installation is required to use the website.

---

## Medical Disclaimer

This project is intended for educational and informational purposes only.

The calculators do not provide medical diagnoses, treatment recommendations, or individualized medical advice.

Results should be interpreted in an appropriate clinical context by qualified healthcare professionals.

---

## Contributing

Contributions, suggestions, documentation improvements, and bug reports are welcome.

As the project develops, additional calculation modules and examples will be added.

---

## License

An open-source license will be added before the reusable JavaScript modules are released.
