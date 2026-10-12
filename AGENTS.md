# AGENTS.md

## Project Snapshot

`tieu-hoc-vui` is a React 19 + TypeScript + Vite learning app for Vietnamese primary-school students. The UI is primarily Vietnamese and uses Firebase for optional cloud synchronization.

## Commands

Run these from the repository root:

- `npm.cmd run dev` starts the Vite development server on Windows PowerShell.
- `npm.cmd test` runs the Vitest suite once.
- `npm.cmd run build` runs strict TypeScript checks and creates the production bundle.
- `npm.cmd run preview` serves the production bundle locally.

After changing code, run the narrowest relevant test first, then `npm.cmd run build` for changes that affect TypeScript, imports, or shared behavior.

## Architecture

- `src/main.tsx` is the browser entry point.
- `src/App.tsx` owns application-level state, profile switching, lesson selection, modal visibility, screen-time behavior, and cloud-load orchestration.
- `src/components/` contains focused UI flows. `LessonRunner.tsx` owns per-lesson question state and reports completion to `App`.
- `src/data/` contains typed static curriculum data. `curriculumData.ts` aggregates the subject lesson files.
- `src/services/` owns side effects and persistence: `storageService.ts` for localStorage, `firebaseSyncService.ts` and `firebase.ts` for Firebase, `audioService.ts` for browser audio/speech, and the smaller validation/time helpers.
- `src/types/` is the source of truth for domain contracts such as lessons, questions, profiles, progress, and gamification.
- Tests are colocated with services, especially `storageService.test.ts`, `teacherValidation.test.ts`, and `timeUtils.test.ts`.

Keep UI state and rendering in components, domain/persistence side effects in services, and shared contracts in `src/types/`. Prefer extending existing services and prop patterns over adding parallel state or ad hoc storage calls.

## Coding Conventions

- Keep TypeScript strictness intact. `tsconfig.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.
- Follow the existing named-export React component style with typed props and hooks.
- Preserve the union types and schemas in `src/types/` when adding lessons or features.
- Lesson and question IDs must remain unique and stable because progress is keyed by IDs.
- Keep user-facing text consistent with the existing Vietnamese UI. Reuse the existing CSS and icon/audio patterns before introducing new ones.
- Do not treat browser `localStorage` or a client-side PIN as a security boundary.

## Data and Firebase Notes

- The checked-in implementation is a Vite SPA using localStorage plus optional Firebase sync. The design documents also discuss broader mobile, CDN, and offline architectures; treat those documents as design intent unless the code implements the behavior.
- `App.tsx` combines built-in lessons with teacher-created custom lessons for the main lesson list. When changing curriculum consumers, check whether they read the combined list or `ALL_LESSONS` directly.
- Changes to `firestore.rules` must preserve least-privilege access and verify authenticated ownership for user-owned writes. Review `docs/05_AN_NINH_BAO_MAT_VA_SECURITY_RULES.md` and test rules with the Firebase tooling when available.
- Avoid putting secrets in the frontend. Firebase client configuration is public configuration; authorization belongs in Firebase rules and authentication checks.

## Documentation Map

Link to the existing design documents instead of copying their contents:

- [README.md](README.md): project overview and document index
- [Requirements](docs/01_TONG_QUAN_VA_YEU_CAU_NGHIEP_VU.md)
- [Architecture](docs/02_KIEN_TRUC_HE_THONG_VA_CONG_NGHE.md)
- [Firebase free-tier strategy](docs/03_CHIEN_LUOC_TOI_UU_FIREBASE_FREE_TIER.md)
- [Firestore data model](docs/04_THIET_KE_CO_SO_DU_LIEU_FIRESTORE.md)
- [Security and child privacy](docs/05_AN_NINH_BAO_MAT_VA_SECURITY_RULES.md)
- [UI and gamification](docs/06_THIET_KE_UI_UX_VA_GAMIFICATION.md)
- [Deployment and monitoring](docs/07_LO_TRINH_TRIEN_KHAI_VA_GIAM_SAT.md)
- [Application review notes](app_review.md): current feature and upgrade notes

## Scope Discipline

Make focused changes, preserve unrelated user work, and do not commit changes unless explicitly requested. Before editing shared behavior, inspect nearby tests and call sites; add or update focused tests for behavior changes.
