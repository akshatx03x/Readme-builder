# TODO: Build Connection Between Login Page and Dashboard

## Tasks
- [x] Update client/src/App.jsx: Fix GitHub login API call, add navigation to dashboard on successful login, handle token storage
- [x] Update backend/controllers/Auth.controller.js: Fix token cookie naming consistency, add provider field to user creation
- [x] Update backend/routes/Auth.route.js: Ensure all necessary routes are defined
- [x] Confirm client/src/main.jsx: Verify routing is correct
- [x] Confirm client/src/Dashboard.jsx: Verify auth check and redirect logic
- [x] Update UserModel.js to include githubToken field
- [x] Add getRepos function in Auth.controller.js to fetch GitHub repos
- [x] Update Dashboard.jsx to send Authorization header for repos fetch
- [x] Update getRepos to read token from header
- [ ] Test login flow: Google and GitHub login, redirection to dashboard
- [ ] Test auth protection: Dashboard redirects to login if unauthorized
- [ ] Test repos fetching: Ensure repos are displayed on dashboard after GitHub login
