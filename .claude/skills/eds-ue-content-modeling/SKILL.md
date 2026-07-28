# eds-ue-content-modeling

Define and validate Universal Editor component models, definitions, and filters for EDS.

## Use When

- Adding or changing block authoring models.
- Creating section or page metadata models.
- Regenerating aggregate Universal Editor model files.

## Responsibilities

- Update partial model files in blocks/ and models/.
- Regenerate aggregate files with:
  - npm run build:json
- Ensure output artifacts stay in sync:
  - component-definition.json
  - component-models.json
  - component-filters.json
- Keep models semantic and author-friendly.
- Validate model lint rules with npm run lint.

## Modeling Guidelines

- Prefer explicit field names and clear labels for authors.
- Keep models minimal and avoid redundant fields.
- Preserve backward compatibility where practical.
- Align model structure with block decoration logic.

## Output

- Updated model partials and regenerated aggregate files.
- Notes on content authoring impact and migration concerns.