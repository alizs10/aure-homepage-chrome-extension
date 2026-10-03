## Project Context and Source of Truth

This is the **Aure Homepage** Chrome New Tab extension.

Before making architectural, functional, or UI/UX changes, you must understand and follow these project documents:

* `PROJECT_LOGIC.md` — **source of truth for application logic, architecture, data flow, persistence, widget behavior, routing, initialization, and technical patterns.**
* `README.md` — **source of truth for the product's purpose, features, permissions, privacy model, installation, and public-facing behavior.**

Always consult these files when a task could affect their documented behavior. Do not contradict or casually replace documented project decisions.

## Existing Project Structure

The repository already has an established architecture and component structure. Follow the existing structure shown in the repository rather than introducing a new architecture.

Important principles:

* Keep code organized according to the existing `src/` structure.
* Follow the established separation between:

  * `components`
  * `ui`
  * `widgets`
  * `pages`
  * `hooks`
  * `stores`
  * `lib`
  * `types`
  * `validation`
  * `db`
  * `helpers`
* Follow the existing widget architecture and data flow described in `PROJECT_LOGIC.md`.
* Do not move files or reorganize directories unless the task explicitly requires it.
* Before creating a new component, inspect the existing project structure and determine whether an existing component can be reused or extended.
* **Reuse existing UI components whenever possible.**
* The project already contains reusable components such as `Button`, `Dialog`, `Dropdown`, `LiquidGlass`, `Popup`, `Slider`, `TextInput`, `Toggle`, `Badge`, `Skeleton`, `ProgressBar`, `ColorPicker`, `ModalHeader`, and `ModalWrapper`.
* Do not recreate an existing UI primitive locally just because it is easier.
* If an existing component is close to what is needed, prefer extending or composing it over creating a duplicate.
* Do not introduce a new abstraction unless there is a real repeated pattern or a clear architectural reason.

## Technology and Coding Conventions

Use the existing stack:

* React 19
* TypeScript 6
* Vite 8
* React Router 8 with HashRouter
* Zustand 5
* Dexie 4 / IndexedDB
* Chrome Storage API
* React Hook Form 7
* Zod 4
* Tailwind CSS 4
* Framer Motion
* Lucide React

Use TypeScript strictly and preserve the project's existing typing patterns.

For widgets, follow the established pattern:

`Types → Dexie Repository → Zustand Store → Hook (derived state) → Component`

Keep persistence logic out of presentation components when the existing architecture provides a store/repository for it.

Use existing helpers, hooks, stores, validation schemas, constants, and utilities before introducing replacements.

## Existing Design System

The project's existing `src/index.css` is part of the design system and should be treated as a source of truth.

Important existing design decisions include:

* Ubuntu and IRANSans fonts
* Light/dark theme support
* Dynamic accent colors
* CSS variables for semantic colors
* Tailwind CSS 4
* Liquid Glass styling
* Existing `app_gradient`, `app_shadow`, `app_shadow_sm`, and `app-blur` utilities
* Existing responsive typography system
* Existing dark-mode implementation
* Existing reduced-motion handling
* Existing theme transition system

Do not introduce a competing color system, typography system, spacing system, glass system, or theme mechanism.

Prefer existing semantic classes and CSS variables such as:

* `background`
* `foreground`
* `card`
* `popover`
* `primary`
* `secondary`
* `muted`
* `accent`
* `destructive`
* `success`
* `warning`
* `border`
* `input`
* `ring`

Respect the existing accent system and theme behavior.

Do not hard-code colors unnecessarily when an existing semantic token or project variable is appropriate.

## UI Component Reuse

The existing UI component library is intentional.

Before creating UI code:

1. Search the existing `src/components/ui` and relevant feature/widget directories.
2. Identify reusable components.
3. Reuse or compose them whenever appropriate.
4. Only create a new component when an existing component genuinely cannot satisfy the requirement.

Do not create duplicate versions of existing components such as buttons, dialogs, inputs, toggles, sliders, popups, badges, modals, or glass containers.

Do not replace established project components with generic third-party UI components unless explicitly requested.

## UI/UX Quality Requirements

Follow the project's **AI Slop Prevention Rules for UI/UX Code** as hard constraints.

The interface should feel intentionally designed for Aure Homepage rather than like a generic AI-generated SaaS interface.

Avoid:

* Generic gradient-heavy hero sections
* Excessive glassmorphism
* Generic purple/white SaaS aesthetics
* Cards around every element
* Excessive border radii and pill-shaped controls
* Excessive shadows
* Decorative blobs, orbs, particles, or glows without purpose
* Oversized typography
* Generic marketing copy
* Invented features or fake data
* Gratuitous animations
* Hover effects on everything
* Fake minimalism
* Excessive or decorative icon usage
* Inconsistent spacing
* Desktop-first layouts that merely shrink on mobile
* Accessibility shortcuts
* Excessive component abstraction
* Decoration used to compensate for weak hierarchy
* Combining multiple trendy visual patterns without a product-specific reason

The core design principles are:

**specific > generic**

**useful > decorative**

**coherent > trendy**

**clear > flashy**

**product-specific > template-like**

**restrained > excessive**

**real functionality > fake completeness**

The fundamental rule is:

**Do not make the UI look impressive by default. Make it look intentional.**

## Layout and Responsive Behavior

Design responsively rather than simply shrinking desktop layouts.

Consider:

* mobile width constraints
* content hierarchy
* readable typography
* touch targets
* navigation
* modal behavior
* grid/list behavior
* text wrapping
* overflow
* keyboard interaction
* accessibility
* hover-independent interaction

Do not assume hover is available.

Use the existing responsive utilities and Tailwind breakpoints where appropriate.

## Accessibility

Accessibility is part of the implementation, not a final cleanup step.

Use:

* semantic HTML
* accessible labels
* accessible names for icon-only controls
* keyboard navigation
* visible focus states
* sufficient color contrast
* appropriate ARIA only when necessary
* meaningful status communication
* buttons for actions rather than clickable non-semantic elements

Do not rely solely on color to communicate state.

## Animation

Use Framer Motion and existing motion patterns when they improve:

* state changes
* feedback
* hierarchy
* continuity
* spatial relationships

Do not animate elements merely because animation is available.

Keep motion restrained and respect `prefers-reduced-motion`.

Do not add unnecessary entrance animations, floating effects, parallax, bouncing, scaling, or decorative motion.

## Functionality

Never invent functionality, data, metrics, settings, integrations, or product behavior that does not exist in the project or task requirements.

If real data is unavailable, use an appropriate empty/loading state rather than fabricated content.

Preserve the local-first privacy model described in `README.md`.

Do not introduce external data collection or external APIs unless explicitly required.

## Existing Features Must Remain Intact

When modifying one part of the application:

* Preserve unrelated existing functionality.
* Preserve the current persistence model.
* Preserve existing routing.
* Preserve theme behavior.
* Preserve settings behavior.
* Preserve responsive behavior.
* Preserve accessibility.
* Preserve existing component APIs unless there is a clear reason to change them.

Avoid broad refactors when the task only requires a focused change.

## Before Completing Any UI/UX Task

Check the implementation against these questions:

1. Did I follow `PROJECT_LOGIC.md`?
2. Did I follow `README.md`?
3. Did I inspect and reuse existing components?
4. Did I avoid duplicating an existing UI primitive?
5. Did I preserve the existing architecture?
6. Did I use the existing design tokens and styling system?
7. Did I avoid inventing functionality or fake data?
8. Is the hierarchy clear without decorative effects?
9. Are spacing, typography, radius, borders, and shadows consistent?
10. Does it work on mobile and without hover?
11. Is it accessible?
12. Is animation actually useful?
13. Does the result look specific to Aure Homepage rather than like generic AI-generated UI?
14. Did I introduce any unnecessary abstraction or architectural complexity?

When there is a conflict between a generic implementation pattern and an existing Aure Homepage pattern, **follow the existing Aure Homepage pattern**.

When uncertain about existing behavior, inspect the relevant code and project documentation before making assumptions.
