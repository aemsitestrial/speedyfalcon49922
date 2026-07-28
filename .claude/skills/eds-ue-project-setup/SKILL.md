# eds-ue-project-setup

Set up and maintain an Adobe Edge Delivery Services (EDS) project that uses Universal Editor.

## Use When

- Bootstrapping a new EDS Universal Editor project from boilerplate.
- Validating repository setup for local development.
- Configuring baseline files used by EDS and Universal Editor.

## Responsibilities

- Verify Node.js runtime and npm dependencies.
- Confirm required project files exist:
  - fstab.yaml
  - xwalk.json
  - component-definition.json
  - component-models.json
  - component-filters.json
- Keep AGENTS.md and Claude instructions aligned with EDS UE best practices.
- Provide local development commands:
  - npm install
  - npx -y @adobe/aem-cli up --no-open --forward-browser-logs
  - npm run lint

## Output

- A ready-to-run local EDS UE repository.
- Setup notes with assumptions, commands used, and unresolved prerequisites.