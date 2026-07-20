# YouTabbed team architecture

YouTabbed is local-first. Each Chrome, Edge, Firefox, or Safari extension reads open-tab metadata only after the member grants permission. Tab identifiers, open windows, history, cookies, passwords, form values, page bodies, and authenticated sessions stay on the member's computer.

Supabase stores only approved team records: team spaces, memberships, projects, shared favorites, notes, tags, contributors, and timestamps. A URL becomes shared only after a member selects **Share with team** and reviews exactly what will be submitted.

When someone opens a shared favorite, the extension first looks for the same URL in that person's current browser and focuses it. Otherwise it opens the URL there. The destination website uses that browser's own signed-in session. YouTabbed never transfers a login from one browser to another.

Supabase Auth should use PKCE. Row Level Security restricts every project and favorite to authenticated members. Supabase Realtime broadcasts approved favorite and project changes so teammates see new favorites without refreshing. Only the publishable/anon key may be used in the client; a service-role key must never be placed in the dashboard or extension.

Required configuration: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Delivery sequence: dashboard Team Space, Supabase Auth/schema/Realtime, Chrome and Edge Manifest V3 extension, Firefox adaptation, Safari Web Extension packaging, security review, accessibility testing, and team pilot.
