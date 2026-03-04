# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Payout Job AI Assistant

This project includes an in-app AI assistant that understands the application and helps jobseekers, students, and recruiters with step-by-step guidance.

### Setup

1. Install dependencies:

```bash
npm install
```

2. (Optional) Set your OpenAI API key to enable high-quality answers. Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-...
PORT=3001
```

3. Start the AI server:

```bash
npm run server
```

4. Start the frontend:

```bash
npm run dev
```

5. Open the app and look for the "Payout Assistant" bubble (bottom-right). It appears globally and adapts to the current page.

### Personas

- Jobseeker: default persona across the site.
- Recruiter: rendered in the employer dashboard.
- Student: you can set `userType="student"` when rendering `AssistantChat` on student-specific pages.

### How it works

- The server scans `src/` and `README.md` to build a local knowledge base.
- When you ask a question, it selects relevant file snippets and sends them to the model (if configured) or replies using the local context.

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# payout" 
