# eds-ue-quality-and-publishing

Apply quality gates for Adobe EDS UE changes and prepare them for preview and live workflows.

## Use When

- Validating changes before pull requests.
- Reviewing performance, accessibility, and authoring quality.
- Preparing release and environment verification notes.

## Responsibilities

- Run quality checks:
  - npm run lint
- Verify local behavior with the AEM CLI development server.
- Confirm no regressions to eager, lazy, and delayed loading behavior.
- Verify authored content still maps correctly to decorated output.
- Provide preview URL guidance for feature branches.

## Review Focus

- Performance-sensitive paths and LCP impact.
- Accessibility and semantic correctness.
- Model-to-markup contract consistency.
- Risks that could affect preview and live environments.

## Output

- A short release readiness summary.
- Known issues and follow-up actions.
