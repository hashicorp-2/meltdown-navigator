# ARCHITECTURE

## AiProfile Model Test Plan (Draft)

- **Test framework**: Jest with `mongodb-memory-server` to exercise real Mongoose validation.
- **Setup/teardown**:
  - `beforeAll`: start in-memory Mongo server and connect Mongoose.
  - `beforeEach`: clear collections.
  - `afterAll`: disconnect Mongoose and stop server.
- **Test cases**:
  - `creates profile with required fields only` — assert defaults populate and timestamps exist.
  - `accepts full profile with support circle and guidelines` — verify persisted document matches input.
  - `trims whitespace-heavy inputs` — ensure schema sanitizes names/relationships.
  - `updates timestamps when document changes` — verify `updatedAt` advances on save.
  - `rejects when support circle exceeds five` — expect custom validation error.
  - `rejects duplicate support contacts` — expect validation failure when name/relationship repeat.
  - `rejects invalid contactMethod enum` — expect validation error on unsupported method.
  - `rejects invalid tone enum` — expect validation error for tone outside allowed values.
  - `requires preferredName` — expect validation error when missing.
- **Helpers**:
  - Factory function to generate a valid base payload for reuse.
  - Use `expect.assertions` when testing rejected promises.

## Translator Backend Design (Draft)

- **Endpoints**:
  - `POST /api/translator` — accepts `TranslatorRequestDTO`, returns `TranslatorResponseDTO`.
- **DTOs** (align with `common/types` when implemented):
  - `TranslatorRequestDTO`: `{ rawMessage: string; stressLevel: 1|2|3|4|5; profileId?: string }`.
  - `TranslatorResponseDTO`: `communication_medium`, `grounding_technique`, `steps[]` (see Visual Communication Planner spec) plus `metadata`.
- **Controller** (`backend/src/controllers/translatorController.ts`):
  - Validates request schema (zod or similar) before delegating.
  - Invokes `translatorService.translate(requestPayload)`.
  - Handles service errors, mapping to HTTP status codes.
  - Emits structured logs around invocation and result sizes.
- **Service** (`backend/src/services/aiService.ts` or dedicated translator service):
  - Composes system prompt according to Visual Communication Planner instructions.
  - Calls Vercel AI SDK (Claude 3.5 Sonnet target) with safe guardrails.
  - Parses JSON output, validates against `TranslatorResponseDTO` schema.
  - Records execution metrics (duration, tokens) for future observability.
  - Requires `ANTHROPIC_API_KEY` environment variable for Anthropic access.
- **Router** (`backend/src/api/routes/translator.ts`):
  - Defines `POST /translator` and binds controller.
  - Future-proof for middleware (auth placeholder, rate limiting).
- **Model/DB touchpoints**:
  - Optional load of `AiProfile` by `profileId` to tailor prompts (deferred until profile storage API lands).
  - No persistence on initial MVP aside from logging.
- **Testing strategy**:
  - Controller integration tests using supertest + mocked service.
  - Service unit tests mocking Vercel SDK, covering happy path, malformed JSON, API errors.
  - Contract tests for schema validation.

## Phase 2 Backlog

- **Twilio API integration**
  - Build `src/lib/twilio.ts` helper with `sendCrisisAlert(to: string, message: string)`.
  - Expose helper as a Vercel AI SDK tool in `app/actions/crisis.ts` so the LLM can trigger alerts.
- **Communication Mediator AI (LangChain.js)**
  - Implement `src/agents/mediator.ts` with a LangChain agent combining mocked `SentimentTool` and LLM `RephraseTool`.
  - Manage multi-step tone analysis and message rephrasing for family mediation.
- **Chat UI integration for mediator**
  - Update `src/components/ChatInput.tsx` with an “AI Rephrase” button.
  - Button invokes `/api/mediate` to get LangChain-mediated copy and replaces the draft message.
