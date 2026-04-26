# App Flows

This file summarizes the 3 main flows in the project: app startup, request lifecycle, and test execution.

## 1. Startup flow with `npm run dev`

```text
npm run dev
   |
   v
nodemon index.js
   |
   v
index.js
   |- require('dotenv').config()
   |- loads variables from .env
   |- require('./src/app')
   |
   v
src/app.js
   |- creates the Express app
   |- app.use(express.json())
   |- app.get('/health')
   |- app.use('/api/v1', routes)
   |- app.use(404)
   |- app.use(errorHandler)
   |
   v
returns to index.js
   |- app.listen(PORT)
   |
   v
server listening
```

### Key idea

`index.js` prepares the environment and starts the server. `src/app.js` only builds the application.

---

## 2. Request flow

Example: `GET /api/v1/clinics/1/appointments`

```text
HTTP request
   |
   v
src/app.js
   |
   v
src/routes/index.js
   |
   v
validators.js
   |
   v
controller
   |
   v
service
   |
   v
PostgreSQL
   |
   v
response.js or errorHandler.js
   |
   v
HTTP response
```

### Key idea

The request enters through the app, passes through routes and validations, reaches the controller, then the service, and finally the database. The response is sent through `response.js` or through `errorHandler.js` if an error occurs.

---

## 3. Test flow

```text
npm test
   |
   v
node --test
   |
   v
test/app.test.js
   |
   v
require('../src/app')
   |
   v
uses the app without going through index.js
   |
   v
does not execute app.listen()
   |
   v
tests routes and responses
```

### Key idea

The tests import `src/app.js` directly to test the application without starting the real server. That is why the separation between `index.js` and `src/app.js` is useful.
