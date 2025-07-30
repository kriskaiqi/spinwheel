# Spin the Wheel: Powered By AI - Developer Specification (MVP)

This document outlines the comprehensive requirements for the Minimum Viable Product (MVP) of "Spin the Wheel: Powered By AI." It covers functional and non-functional requirements, technical architecture, data handling, error strategies, and a testing plan to guide immediate implementation.

## 1. Project Overview

"Spin the Wheel: Powered By AI" is an interactive web application designed to simplify decision-making and spark creativity. Users can input a text-based command or theme, and the integrated AI will generate a list of relevant entries for a customizable spin wheel. The core value proposition is to save users time by eliminating manual entry for wheel options and spark new ideas through AI-generated suggestions.

**Target User**: Individuals seeking quick, AI-generated wheel options for decision-making, idea generation, or fun, who appreciate an intuitive user experience. This includes content creators, educators, event planners, marketers, and anyone needing quick, creative suggestions.

## 2. Key MVP Features (Non-Negotiable)

These three features are the absolute minimum required for the initial launch to validate the core product hypothesis:

### AI-Powered Wheel Generation
- **Requirement**: Users must be able to input a text-based command or theme (e.g., "Dinner ideas," "Places to visit in Malaysia," "Morning routine tasks") via a chat-like interface.
- **Expected Behavior**: The AI will reliably generate a list of creative, relevant, and unique entries for the spin wheel. If a quantity is not specified, the AI should default to generating 5 distinct entries.
- **Value**: This is the core unique selling proposition, leveraging AI to save time and provide creative inspiration.

### Interactive Spin Wheel Experience with Clear Outcome
- **Requirement**: Once a wheel is generated (or manually created/edited), users must be able to initiate a spin.
- **Expected Behavior**: The wheel will display a smooth acceleration and deceleration animation, accompanied by engaging "click-click-click" and "winning" sound effects. A definitive "winner" entry must be clearly indicated visually (e.g., highlighted, enlarged) and its text displayed prominently after the spin.
- **Value**: Provides the core "fun" and "utility" of a spin wheel, making the AI-generated content actionable and engaging.

### User Accounts with Basic Free Tier & Simple Upgrade Path
- **Requirement**: Users must be able to create an account (e.g., via Firebase Authentication).
- **Expected Behavior**:
  - **Free Tier**: Users can save up to 3 AI-generated or custom wheels.
  - **Premium Tier**: A clearly visible and functional "Upgrade to Premium" button/link will initiate a secure Stripe Checkout flow for unlimited wheel storage.
- **Value**: Enables user data persistence and validates the primary monetization strategy.

## 3. User Interface (UI) / User Experience (UX) Requirements

**Overall Goal**: Intuitive design requiring minimal explanation or instruction. Clean, modern, and responsive for both desktop and mobile.

### Main Screen Layout
- **Top Area**: Application title/logo, possibly user account indicator.
- **Middle Area**: Prominent, visually engaging spin wheel visualization.
- **Bottom Area**: AI command input field and associated controls.

### AI Command Input Area
- **Input Field**: Text input field with a clear placeholder (e.g., "Create a wheel with top 5 Couple Games", "Edit entry 3 to Truth or Dare", "Reset to Outdoor Activities").
- **Send Button**: A clear "Send" button/icon to submit the command.
- **Dynamic Sizing**: The input field should expand vertically to accommodate longer commands.

### Wheel Display & Interaction
- **Initial State**: A default wheel (e.g., "Yes/No" or "Random Choice") or an empty wheel with a prompt to use AI.
- **Post-Generation**: The generated entries should populate the wheel visually.
- **Spin Button**: A prominent "Spin Wheel" button below the wheel.
- **Entry List (Editable)**: A list of the current wheel entries displayed alongside or below the wheel, with:
  - Individual "Edit" icons/buttons for each entry.
  - An "Add New Entry" button.
  - A "Reset/Clear All" button for the current wheel entries.
- **Post-Spin Actions**: "Spin Again" and "Edit Wheel" buttons/options should appear after a spin.
- **Theming**: A selection of vibrant, pre-defined themes/color palettes for the wheel.
- **Navigation**: Simple navigation for "My Wheels" (saved wheels), "Upgrade," and "Account Settings."
- **Loading States**: Clear visual indicators (e.g., spinner, "Generating..." text) during AI processing.
- **Toast/Notification Messages**: Brief, non-intrusive messages for success (e.g., "Wheel saved!"), errors (e.g., "Failed to generate entries."), or limits (e.g., "You've reached your free wheel limit.").

## 4. AI Capabilities & Behavior

### Natural Language Understanding (NLU)
- **Interpret user commands for**:
  - **Creation**: "Create a wheel for [theme]," "Generate [N] ideas for [theme]."
  - **Editing**: "Edit entry [number] to [new value]," "Change [old value] to [new value]," "Remove [entry value/number]."
  - **Adding**: "Add [value]," "Add [N] more entries for [theme]."
  - **Resetting/Clearing**: "Clear the wheel," "Reset entries."
- **Entity Extraction**: Accurately identify themes, specific entry numbers, new entry values, and quantities from user prompts.

### Content Generation
- Generate creative, relevant, and diverse entries based on the provided theme.
- Ensure entries are concise and suitable for a spin wheel segment.
- Avoid offensive, biased, or copyrighted content.
- Prevent duplicate entries within a single generation.
- Default to 5 entries if the user doesn't specify a quantity for creation.

### Context Awareness (Basic)
- The AI should ideally remember the current wheel's theme for subsequent "add more" or "refine" commands within the same session.

### Error Handling (AI-Specific)
- **Unclear or ambiguous command**: AI should respond by asking for clarification (e.g., "Could you please be more specific?").
- **Impossible or inappropriate request**: AI should politely state the limitation (e.g., "I cannot generate content of that nature. Please try a different theme.").
- **Post-processing guardrails**: Implement within the Cloud Function to filter out any potentially inappropriate or malformed entries before they reach the frontend.

## 5. Technical Architecture & Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS for responsive design and rapid UI development.
- **Animations**: CSS transitions/animations for wheel spin, or a lightweight JavaScript animation library if needed for advanced effects.
- **Sound**: Basic JavaScript audio API for spin and win sounds.

### Backend & Database
- **Platform**: Firebase Ecosystem (Google Cloud)
- **Authentication**: Firebase Authentication (Email/Password, Google Sign-in recommended for ease of use).
- **Database**: Cloud Firestore (NoSQL document database).
  - **Collections**:
    - **users**: Stores user profiles (e.g., uid, email, createdAt, premiumStatus, savedWheelCount).
    - **wheels**: Stores individual wheel data.
- **Serverless Logic**: Cloud Functions for Firebase (Node.js runtime).
  - **Functions**:
    - **generateWheelEntries**: Handles AI API calls, prompt engineering, and returns formatted entries.
    - **saveWheel**: Saves/updates wheel data to Firestore, enforces free tier limits.
    - **deleteWheel**: Deletes a saved wheel.
    - **handleStripeWebhook**: Processes Stripe events for subscription status updates.
    - **createStripeCheckoutSession**: Initiates Stripe Checkout for premium upgrades.
- **Hosting**: Firebase Hosting.

### AI Integration
- **Model**: Google's Gemini API (or imagen-3.0-generate-002 if image generation is later added).
- **Access**: API calls made securely from Cloud Functions (never directly from the frontend).
- **API Key Management**: API keys stored as Cloud Functions environment variables, not hardcoded.

### Payment Gateway
- **Provider**: Stripe
- **Integration Method**: Firebase Extensions for Stripe (specifically firestore-stripe-payments extension for simplified subscription management and webhooks).

## 6. Data Handling & Storage

### User Data (users collection)
- **uid** (string, document ID): Firebase Authentication User ID.
- **email** (string): User's email address.
- **createdAt** (timestamp): Timestamp of user creation.
- **premiumStatus** (boolean): true if premium, false if free.
- **savedWheelCount** (number): Current count of wheels saved by the user (for free tier enforcement).

### Wheel Data (wheels collection)
- **wheelId** (string, document ID): Unique ID for each wheel.
- **userId** (string): uid of the user who owns the wheel.
- **name** (string): A user-friendly name for the wheel (e.g., "Dinner Ideas," derived from the initial prompt).
- **theme** (string): The theme used to generate the wheel.
- **entries** (array of strings): The actual list of entries for the wheel.
- **createdAt** (timestamp): Timestamp of wheel creation.
- **updatedAt** (timestamp): Timestamp of last modification.
- **isPublic** (boolean, default false): For future community features, but present in schema.

### Data Security
- **Firestore Security Rules**: Implement strict rules to ensure users can only read/write their own data in the users and wheels collections.
  ```plaintext
  match /users/{userId}/{documents=**} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  match /wheels/{wheelId} {
    allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
  }
  ```
- **HTTPS/WSS**: All communication between frontend, Cloud Functions, and external APIs must use secure protocols.
- **Input Validation**: Sanitize and validate all user inputs on both frontend and backend to prevent injection attacks.
- **API Key Security**: AI API keys must be kept server-side (Cloud Functions environment variables) and never exposed to the client.

## 7. Monetization Strategy

**Model**: Freemium

- **Free Tier**: Limited to saving 3 wheels.
- **Premium Tier**: Unlimited saved wheels.
- **Pricing**: (To be determined, but the system should support flexible pricing via Stripe).

### Upgrade Flow
1. User clicks "Upgrade to Premium."
2. Frontend calls a Cloud Function (createStripeCheckoutSession).
3. Cloud Function creates a Stripe Checkout session and returns the session URL.
4. Frontend redirects user to Stripe Checkout.
5. User completes payment on Stripe.
6. Stripe sends a webhook to a Firebase Extension (firestore-stripe-payments), which updates the user's premiumStatus in Firestore.
7. Frontend listens for changes to premiumStatus and updates UI accordingly.

## 8. Error Handling & Edge Cases

### Frontend Error Handling
- Use try-catch blocks for all asynchronous operations (API calls, Firebase operations).
- Display user-friendly toast/notification messages for errors (e.g., "Network error, please try again," "Failed to save wheel," "AI could not generate entries for that request.").
- Provide clear loading indicators to prevent users from thinking the app is frozen.
- Implement basic input validation before sending to the backend (e.g., ensuring prompt is not empty).

### Cloud Functions Error Handling
- Implement try-catch blocks for all external API calls (AI, Stripe).
- Log detailed error messages to Stackdriver Logging for debugging and monitoring.
- Return appropriate HttpsError codes and messages to the frontend (e.g., unauthenticated, invalid-argument, internal).
- Implement exponential backoff for retrying external API calls (especially AI API) to handle transient errors and rate limits gracefully without logging retries as errors.

### AI-Specific Error Handling
- **Unclear Prompt**: AI responds with a clarifying question.
- **Inappropriate Content Request**: AI responds with a refusal message.
- **AI Service Down/Rate Limit**: Cloud Function handles the error, logs it, and returns a generic "AI temporarily unavailable" message to the user.
- **Firestore Security Rules**: Act as a critical error handler by preventing unauthorized data access/modification at the database level.
- **Tier Enforcement**: Cloud Function for saveWheel will check savedWheelCount against the free tier limit and return an error if exceeded, prompting the user to upgrade.

## 9. Security Considerations
- **Authentication**: Firebase Auth provides robust and secure user management.
- **Data Encryption**: Firestore data is encrypted at rest, and all communication is via HTTPS.
- **API Key Management**: AI API keys are secured in Cloud Functions environment variables.
- **Input Validation**: Critical for preventing XSS, injection, and other vulnerabilities.
- **Rate Limiting**: Implement basic rate limiting on Cloud Functions (e.g., for AI generation requests) to prevent abuse and manage costs.
- **Least Privilege**: Ensure Firebase Security Rules grant only necessary permissions.
- **Regular Updates**: Keep all dependencies (React, Firebase SDKs, Node.js runtime) up to date.

## 10. Future-Proofing AI Integration (Architectural Principle)
- **Abstraction Layer**: All direct calls to the AI model will be encapsulated within a dedicated module/service in Cloud Functions (e.g., aiService.js). This module will handle prompt formatting, API calls, and response parsing.
- **Standardized Interfaces**: The aiService module will expose clear, consistent functions (e.g., aiService.generateEntries(prompt, theme, count)) to the rest of the application, decoupling the application logic from specific AI model implementations.
- **Configuration-Driven**: The specific AI model name and version will be configurable (e.g., via Cloud Functions environment variables) to allow easy switching or upgrading without code changes.

## 11. Testing Plan

The testing plan will focus on ensuring the core MVP functionality is robust and user-friendly.

### 11.1. Scope of Testing
- All 3 non-negotiable MVP features.
- User authentication (signup, login, logout).
- Wheel creation (AI-generated, manual).
- Wheel editing (entries, name).
- Wheel spinning and result display.
- Wheel saving, loading, and deletion.
- Free tier limits enforcement.
- Premium upgrade flow (Stripe Checkout initiation and webhook processing).
- Basic responsiveness across common devices (mobile, tablet, desktop).
- Error handling for common scenarios (network issues, invalid AI response, exceeding limits).

### 11.2. Testing Types
- **Unit Testing**: Individual React components, Cloud Functions (AI call logic, Firestore interactions, Stripe session creation).
- **Integration Testing**:
  - Frontend-Backend communication (e.g., submitting a prompt and receiving entries).
  - Backend-AI API integration (successful calls, error responses).
  - Backend-Firestore integration (saving, loading, deleting data).
  - Stripe Checkout flow from initiation to webhook processing.
- **End-to-End (E2E) Testing**: Simulate full user journeys (e.g., "Sign up -> Generate wheel -> Save -> Spin -> Upgrade to Premium -> Save another wheel").
- **User Acceptance Testing (UAT)**: Conducted by a small group of beta testers to validate the user experience, AI quality, and overall flow against real-world expectations.
- **Performance Testing (Basic)**: Check load times for key pages and responsiveness of AI generation under typical load.
- **Security Testing (Basic)**: Manual checks for common vulnerabilities (e.g., input validation bypass, unauthorized access attempts). Firebase Security Rules will be a primary defense.

### 11.3. Test Environment
- Dedicated Firebase project for development/staging.
- Stripe Test Mode for payment testing.
- Various browsers (Chrome, Firefox, Safari) and device types (mobile, tablet, desktop).

### 11.4. Test Data
- Sample user accounts (free and premium).
- Variety of AI prompts (simple, complex, ambiguous, inappropriate).
- Pre-defined wheel entries for manual creation/editing tests.

### 11.5. Success Criteria
- All critical MVP features function as described.
- AI generates relevant and appropriate content >90% of the time for valid prompts.
- Spin wheel animation is smooth and clear.
- User data (wheels, premium status) persists correctly.
- Premium upgrade flow is seamless and updates user status.
- Error messages are user-friendly and informative.
- Application is responsive and usable across target devices.

### 11.6. Reporting
- Bug reports (e.g., via GitHub Issues or a simple spreadsheet).
- Test execution reports (pass/fail rates).
- UAT feedback summary.

## 12. Deployment Considerations
- **CI/CD (Future)**: While not MVP, consider setting up a basic CI/CD pipeline (e.g., GitHub Actions + Firebase Hosting/Functions deployment) for future iterations to automate testing and deployment.
- **Monitoring**: Implement Firebase Performance Monitoring and Cloud Logging for ongoing health checks and error detection post-launch.