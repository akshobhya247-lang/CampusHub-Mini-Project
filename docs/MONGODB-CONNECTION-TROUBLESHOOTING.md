# MongoDB Atlas connection troubleshooting

## 1. Keep credentials private

Store the connection string in the root `.env` file, next to `package.json`. Do not commit `.env`, include it in screenshots, or send it in public chats. The repository ignores `.env`.

## 2. Use the right URI format

Atlas URI format:

```text
mongodb+srv://USERNAME:URL_ENCODED_PASSWORD@CLUSTER_HOST/campushub?retryWrites=true&w=majority
```

Replace each placeholder with the values from Atlas. If the username or password contains reserved URL characters, encode those credentials. Common examples: `@` → `%40`, `:` → `%3A`, `/` → `%2F`, `?` → `%3F`, `#` → `%23`, `%` → `%25`. Encode only the username/password components, not the whole URI. Never share the resulting URI.

## 3. Atlas checks

1. Confirm the cluster is available.
2. Confirm a database user exists and has permissions for the `campushub` database. This is separate from the Atlas website login.
3. Confirm Atlas Network Access permits the machine running the app. For a deployed service, configure access according to the deployment provider and your security requirements.
4. Restart the backend after changing `.env`; environment variables are read when Node starts.

## 4. Verify

Open `http://localhost:3000/api/health`. The API should return `ok: true` and `database: "connected"`. If it reports `disconnected`, read the backend terminal for the connection error. Do not share credentials when asking for help.

Then test the task API in Postman or the UI. Create a test task, refresh the UI, and confirm it remains. A visible frontend alone does not prove the database is connected.
