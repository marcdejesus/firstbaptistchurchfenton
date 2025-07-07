# Frontend Documentation

This document provides an overview of the frontend architecture and conventions used in this project.

## Directory Structure

The `src` directory contains all the frontend code. Here's a breakdown of the key directories:

-   `app/`: This is the main directory for the Next.js application, using the App Router. Each subdirectory corresponds to a route (e.g., `app/about` corresponds to the `/about` page).
-   `components/`: This directory contains all the reusable React components used throughout the application.
    -   `components/ui/`: Contains the base UI components, many of which are from a component library like shadcn/ui.
    -   `components/layout/`: Components related to the overall page structure, like `Header`, `Footer`, and `PageLayout`.
    -   Other subdirectories group components by feature (e.g., `components/events`, `components/home`).
-   `contexts/`: Contains React context providers for managing global state.
-   `hooks/`: Contains custom React hooks that encapsulate reusable logic.
-   `lib/`: Contains library code, utility functions, and configurations for services like Firebase and the calendar API.
-   `styles/`: While global styles are in `app/globals.css`, this directory could be used for more organized styling concerns if needed.
-   `types/`: Contains TypeScript type definitions used across the application.

## Conventions

-   **Styling**: The project uses Tailwind CSS for styling. Utility classes are preferred. Global styles are defined in `app/globals.css`.
-   **Components**: Components are built using React and TypeScript. Reusable UI components are located in `src/components/ui`. Feature-specific components are organized into subdirectories within `src/components`.
-   **State Management**: For simple state, React's built-in `useState` and `useReducer` hooks are used. For more complex global state, React Context is used (see `src/contexts`).
-   **Data Fetching**: Data fetching is done using a combination of server components in Next.js and client-side fetching with `fetch` or a library like SWR/tanstack-query where appropriate. API routes are located in `src/app/api`.

## Creating a New Page

To create a new page, you need to:

1.  Create a new directory in `src/app`. The directory name will be the route's path. For example, `src/app/new-page`.
2.  Add a `page.tsx` file inside the new directory. This file will export the React component for the page.
3.  Use the `PageLayout` component from `src/components/layout/PageLayout.tsx` to ensure consistent page structure with breadcrumbs and titles.

## Creating a New Component

1.  Identify if the component is a generic, reusable UI element or a feature-specific component.
2.  For UI components, place them in `src/components/ui`.
3.  For feature-specific components, place them in an appropriate subdirectory within `src/components`.
4.  Always use TypeScript and define props with clear types. 