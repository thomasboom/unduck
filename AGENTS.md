# AGENTS.md - Unduck Project Guidelines

## Overview
Unduck is a client-side bang search redirect service built with TypeScript and Vite. It provides fast alternatives to DuckDuckGo's server-side redirects by performing all work client-side.

## Build & Development Commands

### Development Server
```bash
pnpm dev          # Start development server with hot reload
```

### Build & Deploy
```bash
pnpm build        # Type-check and build for production (includes tsc)
pnpm preview      # Preview production build locally
```

### Package Management
```bash
pnpm install      # Install dependencies
pnpm add <pkg>    # Add dependency
pnpm add -D <pkg> # Add dev dependency
```

## Code Style Guidelines

### TypeScript Configuration
- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **Strict mode**: Enabled (noUnusedLocals, noUnusedParameters, etc.)
- **Type checking**: Strict with all linting rules enabled
- **NoEmit**: true (bundler handles compilation)

### Naming Conventions
- **Functions**: camelCase (`performSearch`, `renderMainPage`, `escapeHtml`)
- **Variables**: camelCase (`searchInput`, `selectedSuggestionIndex`)
- **Constants**: UPPER_SNAKE_CASE for config (`LS_DEFAULT_BANG`)
- **Types**: PascalCase for interfaces (not used in this codebase)
- **Files**: kebab-case (`main.ts`, `bang.ts`, `global.css`)

### Import/Export Style
- Use ES6 imports with named exports
- Import order: external libraries first, then local modules
- Relative imports with explicit file extensions in TypeScript
```typescript
import { bangs } from "./bang";
import "./global.css";
```

### Code Structure
- **Functional programming**: Pure functions where possible
- **DOM manipulation**: Direct manipulation without framework
- **Event handling**: AddEventListener with arrow functions
- **State management**: Local variables and DOM state
- **No classes**: Pure functional approach

### Error Handling
- Use strict TypeScript for compile-time safety
- Type assertions with `!` for guaranteed non-null elements
- Graceful fallbacks for missing DOM elements
- Minimal runtime error handling (client-side redirects)

### Formatting & Style
- **Indentation**: 2 spaces (configured in TypeScript)
- **Line length**: No strict limit, break naturally
- **Semicolons**: Always used
- **Quotes**: Double quotes for JSX-like strings, single for regular strings
- **Spacing**: Single space around operators, no space in function calls

### CSS Conventions
- **CSS Variables**: Extensive use for theming (`--bg`, `--text`, `--accent`)
- **Dark mode**: Automatic via `prefers-color-scheme`
- **Reset**: Full CSS reset with box-sizing border-box
- **Typography**: Monospace font stack (`"SF Mono", "Fira Code", "Monaco"`)
- **Units**: px for fixed sizes, rem/em for scalable
- **Naming**: BEM-like classes (`.search-input`, `.settings-modal-overlay`)

### Type Safety
- Strict null checks enabled
- Avoid `any` type (none found in codebase)
- Use union types where appropriate
- Type assertions only when DOM elements are guaranteed to exist

### Performance Considerations
- **Bundle size**: Minimal dependencies (only Vite and PWA plugin)
- **Caching**: PWA with service worker for offline functionality
- **DOM queries**: Cache element references (`searchInput!`)
- **Event delegation**: Efficient event handling
- **Lazy loading**: No explicit lazy loading (small app)

### Browser Support
- Modern browsers (ES2020+ features)
- PWA support required for full functionality
- Graceful degradation not implemented

### Testing Strategy
- No explicit testing framework configured
- Manual testing via browser dev tools
- Visual testing through UI interaction
- No unit tests or integration tests

### Deployment
- **Platform**: Vercel (configured in project)
- **Build command**: `pnpm build` (includes TypeScript compilation)
- **Output**: `dist/` directory
- **Caching**: Aggressive caching via PWA

### Git Workflow
- **Commits**: Conventional commits recommended
- **Branching**: Feature branches from main
- **PRs**: Required for changes
- **Releases**: Automated via Vercel

### Development Workflow
1. `pnpm dev` for local development
2. Make changes with hot reload
3. `pnpm build` to verify production build
4. `pnpm preview` to test production locally
5. Commit and push for deployment

### Security Considerations
- **CSP**: No explicit CSP (client-side only)
- **XSS**: Sanitize user input (escapeHtml function)
- **Input validation**: Trim and validate search queries
- **External links**: Direct navigation to user-specified URLs
- **Local storage**: Used for user preferences (default bang)

### Accessibility
- **Keyboard navigation**: Full arrow key support
- **Screen readers**: Semantic HTML structure
- **Focus management**: Proper focus handling
- **ARIA labels**: Title attributes on buttons
- **Color contrast**: CSS variables ensure contrast

### Code Quality Tools
- **TypeScript**: Built-in type checking and linting
- **Vite**: Fast development and optimized builds
- **ESLint**: Not configured (rely on TypeScript strict mode)
- **Prettier**: Not configured (manual formatting)
- **Testing**: None configured

### Architecture Decisions
- **No framework**: Vanilla TypeScript for minimal bundle size
- **Client-side redirects**: All logic runs in browser
- **Static data**: Bang definitions in static array
- **PWA**: Offline functionality and installability
- **Single page app**: No routing library needed

### File Organization
```
src/
├── main.ts      # Main application logic
├── bang.ts      # Bang definitions data
├── global.css   # Global styles and themes
└── vite-env.d.ts # Vite type definitions

public/          # Static assets
dist/           # Build output
```

### Dependencies
- **Runtime**: None (pure client-side)
- **Build**: TypeScript, Vite
- **Dev**: None
- **PWA**: vite-plugin-pwa for service worker

### Browser APIs Used
- **DOM**: Query selectors, event listeners, innerHTML
- **LocalStorage**: User preferences
- **Clipboard**: Copy URL functionality
- **History**: URL parameter parsing
- **Navigator**: Clipboard API
- **Window**: Location, open, setTimeout

### Performance Metrics
- **First load**: ~50KB (gzipped)
- **Subsequent loads**: Cached via PWA
- **Time to interactive**: Instant (no server round trips)
- **Redirect speed**: Client-side instant vs DDG's server-side delays

### Maintenance
- **Updates**: Manual bang list updates from DDG source
- **Monitoring**: Vercel analytics
- **Support**: GitHub issues
- **Documentation**: Minimal (README only)
