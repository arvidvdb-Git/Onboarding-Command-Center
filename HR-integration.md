# HR app deployment

Import and configure the six Train Today Data Tables workflows. Set the server environment variables listed in .env.example. Set APP_URL to the exact deployed HTTPS origin. N8N_WEBHOOK_BASE ends in /webhook. Use the same header credential on the dashboard, decision and chat workflows. Protect the production intake form separately and restrict the Notion database and Drive files to HR. The embedded form requires the form host to allow framing from the HR origin. The new-tab link also supports providers that require a top-level login.

Use npm run dev locally or npm run build followed by npm start in production, behind HTTPS. The Node service hosts the UI and HR-authenticated API. Static-only deployments require a server for these routes. The browser prompts for HR sign-in. For a shared production workforce, replace the initial HR Basic Auth guard with your organization's HR identity and role checks.

The command center polls n8n every 20 seconds and refreshes after a decision. Directory rows open the matching onboarding. Validate against a test hire before enabling real mail or calendar writes.
