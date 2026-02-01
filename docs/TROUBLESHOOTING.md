# Troubleshooting

## 404 (Not Found) and 401 (Unauthorized) on `/api/checkout`

### What these mean

| Status | Meaning |
|--------|--------|
| **404 Not Found** | The URL was not found. Either the **backend is not running**, or the request went to the wrong host/path. |
| **401 Unauthorized** | The server received the request but **rejected it because authentication failed** (no token, invalid token, or expired token). |

### Why you might see both

1. **404** – Often the **first** request fails because the backend (Express on port 5000) isn’t running. The frontend (Vite on 5173) proxies `/api/*` to `http://localhost:5000`. If nothing is listening on 5000, you get a connection error; some setups report this as 404.
2. **401** – Once the backend is running, `/api/checkout` is protected. If you’re not logged in or your token is missing/expired/invalid, the server responds with **401**.

### Fix checklist

1. **Start the backend** (required for any `/api` call):
   ```bash
   cd backend
   node server.js
   ```
   You should see: `Server running on port 5000`.

2. **Use a valid user login** for checkout:
   - Log in as a **user** (not admin) via the Login page.
   - Then go to Checkout and place the order. The app sends your JWT in the `Authorization` header.

3. **If you still get 401 after logging in**:
   - **Token expired** – Log out and log in again.
   - **Wrong JWT secret** – Ensure `backend/config/config.env` has `JWT_SECRET` set and that you didn’t change it after issuing the token (restart backend after changing).

4. **Keep both servers running** when testing:
   - Frontend: `npm run dev` (port 5173)
   - Backend: `node server.js` (port 5000)
