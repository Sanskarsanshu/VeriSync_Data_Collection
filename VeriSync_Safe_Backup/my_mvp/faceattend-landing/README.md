# VeriSync Landing Page

A responsive HTML, CSS and JavaScript frontend containing:

- Professional SaaS landing page
- Animated dashboard preview
- Student, Teacher and Admin portal selector
- Role-aware login page
- Student registration form
- Teacher registration form
- Admin login-only flow
- Responsive mobile navigation
- Form validation and toast notifications
- No framework or build step required

## Run locally

Open `index.html` in your browser.

For reliable routing during development, you may use VS Code Live Server or:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Main files

- `index.html` — landing page
- `portal.html` — three-role portal selection
- `auth.html` — role-aware login and registration interface
- `styles.css` — complete responsive design
- `script.js` — animation, routing, validation and integration hooks

## Role links

```text
auth.html?role=student&mode=login
auth.html?role=student&mode=register
auth.html?role=teacher&mode=login
auth.html?role=teacher&mode=register
auth.html?role=admin&mode=login
```

## Add your supplied login and registration code

Search `script.js` for:

```text
BACKEND INTEGRATION POINT
```

Replace the demonstration toast logic with your own API request or navigation.

You can also replace the forms inside `auth.html` while keeping the role routing and design.

## Important

This is frontend-only. Authentication is not secure until it is connected to a real backend with protected APIs, server-side validation, password hashing and role checks.
