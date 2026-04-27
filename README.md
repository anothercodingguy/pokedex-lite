# Pokedex Lite

A responsive Pokedex web app built with React, TypeScript, Vite, TanStack Query, and the public PokeAPI.

## Features

- Paginated Pokemon grid with official artwork
- Search by Pokemon name
- Filter by one or more core Pokemon types
- Favorite toggle with local storage persistence
- Detail modal with stats, abilities, height, and weight
- Loading, empty, and API error states
- Responsive layout for mobile, tablet, and desktop
- Subtle transitions for cards, filters, pagination, and modal opening

## Tech Stack

- React + TypeScript for typed component-driven UI.
- Vite for fast local development and a simple production build.
- TanStack Query for API caching, loading states, errors, and retries.
- Lucide React for consistent icon buttons.
- PokeAPI v2 as the data source.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

The app can be deployed to Vercel as a static Vite project.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

After pushing the repository to GitHub, import it in Vercel and keep the default Vite settings.

## Implementation Notes

The PokeAPI list endpoint returns only names and URLs. To keep search and type filtering global while avoiding full detail requests for every Pokemon, the app loads a lightweight name index once, fetches type membership lists only when filters are active, and requests full Pokemon details only for the current visible page.

Favorites are stored as Pokemon IDs in local storage. The storage hook safely handles missing or malformed data so a bad value does not break the app.

## Challenges

The main data challenge was combining global search/type filtering with pagination. The solution separates lightweight index data from detailed card data, which keeps the UI responsive and avoids unnecessary network work.
