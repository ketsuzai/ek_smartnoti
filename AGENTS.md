# Repository Guidelines

## Project Structure & Module Organization

This repository is a static multi-page admin prototype built with vanilla HTML, CSS, and JavaScript.

- `index.html`: entry page.
- `src/pages/`: top-level admin pages such as `dashboard.html` and `org-admin.html`.
- `src/pages/oper/`: operation-management pages and shared scripts like `operation-sidebar.js`.
- `docs/superpowers/`: design notes and implementation plans.
- `.brain/`: product context, role rules, and feature specs used as the source of truth.
- `refer/`, `.desc/`, `.claude/`: supporting references and agent-oriented artifacts.

Prefer adding new operation pages under `src/pages/oper/` with the `operation-*.html` naming pattern.

## Build, Test, and Development Commands

There is no package-based build pipeline in this repo. Run pages through a simple local server.

- `python -m http.server 8000`: serve the repository locally.
- Open `http://localhost:8000/index.html`: start from the entry page.
- `rg --files src/pages`: list pages quickly.
- `git log --oneline -5`: review recent change patterns before editing.

If a page loads remote assets such as Chart.js or Google Fonts, verify it in a browser, not just by reading the HTML.

## Coding Style & Naming Conventions

Match the existing vanilla HTML style:

- Use 2-space indentation in embedded JavaScript and keep HTML/CSS formatting consistent with nearby files.
- Keep page filenames lowercase with hyphens, for example `operation-announcement.html`.
- Use descriptive IDs and class names tied to UI purpose, not presentation only.
- Reuse existing CSS variables and shared sidebar patterns before introducing new tokens.

Do not rename existing page files casually; many pages link each other directly by relative path.

## Testing Guidelines

There is no automated test suite yet. Validate changes manually in the browser.

- Check navigation flows, modal open/close behavior, filters, and inline interactions.
- Verify role-based or context-based UI paths when touching shared pages.
- For shared scripts such as `operation-sidebar.js`, test at least two pages that consume them.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit style with Korean summaries, for example `feat: 진급/졸업 기능 완제 구현` and `fix: 댓글 수정+삭제 버튼 우측정렬`.

- Use prefixes like `feat:`, `fix:`, and `refactor:`.
- Keep the subject specific to one feature area or page.
- In PRs, include the changed pages, user-visible impact, linked spec/docs, and screenshots for UI changes.

## Agent-Specific Notes

Treat `.brain/` and `README.md` as canonical context before major edits. Avoid modifying these existing admin pages unless explicitly requested: `src/pages/dashboard.html`, `src/pages/member-list-admin.html`, `src/pages/member-approval.html`, `src/pages/member-status-admin.html`, `src/pages/invitation-admin.html`, and `src/pages/org-admin.html`.
