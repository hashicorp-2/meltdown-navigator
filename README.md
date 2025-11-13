# Meltdown Navigator

A compassionate AI-powered platform for translating crisis signals into clear, actionable, and empathetic communication. Transform dysregulated messages into supportive connection.

## Project Structure

- `backend/` - Express API server with translator service
- `apps/web/` - Next.js web application with server actions
- `apps/mobile/` - React Native mobile app (Expo)
- `packages/agents/` - Shared AI agent package (crisis translator, communication mediator, proactive coach)
- `common/types/` - Shared TypeScript types

## Backend Setup Notes

- Install backend dependencies: `npm install --workspace @meltdown/backend`
- Copy `backend/.env.example` to `backend/.env` and set:
  - `ANTHROPIC_API_KEY` - Required for AI features (translator, mediator)
  - `MONGODB_URI` - Optional, for AiProfile features
  - `TWILIO_ACCOUNT_SID` - Optional, for SMS crisis alerts (Phase 2)
  - `TWILIO_AUTH_TOKEN` - Optional, for SMS crisis alerts (Phase 2)
  - `TWILIO_PHONE_NUMBER` - Optional, for SMS crisis alerts (Phase 2)

### Running the Backend

**Option 1: Build and Run (Recommended)**
```bash
# Build the TypeScript code
npm run build --workspace @meltdown/backend

# Run the compiled code
npm run start:prod --workspace @meltdown/backend
```

**Option 2: Development with Watch Mode**
```bash
# This uses concurrently to watch and rebuild, then nodemon to restart
npm run dev --workspace @meltdown/backend
```

**Option 3: Using ts-node/esm (if Node.js 18+)**
```bash
npm run dev:simple --workspace @meltdown/backend
```

### Troubleshooting

If you see `Error: Must use import to load ES Module`, see `backend/TROUBLESHOOTING.md` for solutions.

- Run tests: `npm run test --workspace @meltdown/backend`

## Web App Setup Notes

- Install web app dependencies: `npm install --workspace @meltdown/web`
- Copy `apps/web/.env.example` to `apps/web/.env` and set `ANTHROPIC_API_KEY`.
- Start the Next.js app: `npm run dev --workspace @meltdown/web`
- The web app uses server actions with the agents package for crisis translation.

## Mobile Setup Notes

1. Install prerequisites
   - `node` >= 18 (use nvm if needed)
   - Expo CLI: `npm install -g expo-cli`
   - iOS: Xcode + Simulator • Android: Android Studio + SDK/AVD

2. Install workspace dependencies
   - `npm install --workspaces --include-workspace-root`
   - (Optional) `npx expo install` to align native module versions after dependency changes

3. Start the Expo app
   - Development server: `npm run start --workspace @meltdown/mobile`
   - iOS simulator: `npm run ios --workspace @meltdown/mobile`
   - Android emulator: `npm run android --workspace @meltdown/mobile`

4. Styling & tooling
   - Nativewind / Tailwind configured via `apps/mobile/tailwind.config.js`
   - ESLint (Expo preset) via `npm run lint --workspace @meltdown/mobile`
