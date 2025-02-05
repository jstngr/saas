# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## Folder Structure

packages/frontend/
├── public/
│ ├── favicon.ico
│ ├── robots.txt
│ └── index.html
├── src/
│ ├── assets/
│ │ ├── images/
│ │ ├── fonts/
│ │ └── icons/
│ ├── components/
│ │ ├── common/
│ │ │ ├── Button/
│ │ │ │ ├── Button.tsx
│ │ │ │ ├── Button.test.tsx
│ │ │ │ ├── Button.styles.ts
│ │ │ │ └── index.ts
│ │ │ ├── Input/
│ │ │ └── Card/
│ │ └── layout/
│ │ ├── Header/
│ │ ├── Footer/
│ │ ├── Sidebar/
│ │ └── Navigation/
│ ├── features/
│ │ ├── auth/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ ├── types/
│ │ │ └── index.ts
│ │ └── users/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── types/
│ │ └── index.ts
│ ├── hooks/
│ │ ├── useDebounce.ts
│ │ ├── useLocalStorage.ts
│ │ └── useMediaQuery.ts
│ ├── lib/
│ │ ├── api/
│ │ │ ├── client.ts
│ │ │ └── endpoints.ts
│ │ └── utils/
│ │ ├── formatters.ts
│ │ └── validators.ts
│ ├── pages/
│ │ ├── Home/
│ │ │ ├── components/
│ │ │ ├── Home.tsx
│ │ │ └── index.ts
│ │ └── Dashboard/
│ │ ├── components/
│ │ ├── Dashboard.tsx
│ │ └── index.ts
│ ├── routes/
│ │ ├── PrivateRoute.tsx
│ │ ├── PublicRoute.tsx
│ │ └── routes.tsx
│ ├── services/
│ │ ├── api.service.ts
│ │ └── auth.service.ts
│ ├── store/
│ │ ├── slices/
│ │ │ ├── authSlice.ts
│ │ │ └── userSlice.ts
│ │ └── store.ts
│ ├── styles/
│ │ ├── theme/
│ │ │ ├── colors.ts
│ │ │ ├── typography.ts
│ │ │ └── index.ts
│ │ ├── global.css
│ │ └── variables.css
│ ├── types/
│ │ ├── auth.types.ts
│ │ └── user.types.ts
│ ├── App.tsx
│ ├── main.tsx
│ └── vite-env.d.ts
├── .env
├── .env.development
├── .env.production
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
