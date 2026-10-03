# Contributing to QuantOS ACTI

Thank you for your interest in contributing to **QuantOS ACTI**! We are committed to fostering an open, collaborative, and mathematically rigorous environment.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/QuantOS-ACTI.git
   cd QuantOS-ACTI
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Guidelines

- **TypeScript Strictness**: Keep types clean, strict, and explicit. Avoid `any` whenever possible.
- **Code Formatting**: Keep indentation consistent (2 spaces). Ensure no lint errors or missing imports.
- **Mathematical Accuracy**: When adding or modifying quantitative formulas (e.g., in `MathematicalFoundations.tsx`, `geminiService.ts`, or `types.ts`), ensure mathematical derivations and units are clearly documented in docstrings and LaTeX comments.
- **Commit Messages**: We follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: ...` for new features
  - `fix: ...` for bug fixes
  - `docs: ...` for documentation
  - `refactor: ...` for code restructuring
  - `perf: ...` for performance improvements
  - `test: ...` for test additions

## Submitting Pull Requests

1. Verify the project builds without errors:
   ```bash
   npm run build
   ```
2. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
3. Open a Pull Request against the `main` branch. Provide a clear summary of changes, mathematical references if applicable, and test results.

## Security Disclosures

If you discover a potential vulnerability or security issue with key management or licensing mechanisms, please report it privately to `security@quantos-acti.org` rather than opening a public issue.
