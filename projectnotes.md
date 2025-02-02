# DevTinder Backend Notes

## Project Setup
1. **Create a Project Folder:**
   - Create a folder named `DevTinder` on the desktop.
   - Open the folder in VS Code.
2. **Initialize Node.js Project:**
   - Run `npm init` in the terminal.
   - This creates a `package.json` file, which stores metadata about the project.
3. **Project Structure:**
   - Create a `src` folder inside the project.
   - Inside `src`, create an `app.js` file (entry point of the application).
4. **Install Express Framework:**
   - Run `npm i express` in the terminal.
   - This adds `express` to the `node_modules` folder.
   - A `package-lock.json` file is also created to track exact dependency versions.

## Creating the Express Server
```javascript
const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
    res.send("This is the hello page, guys!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

## Versioning in Node.js
Version numbers follow the `MAJOR.MINOR.PATCH` format:
1. **Patch (`1.0.1`)** – Bug fixes and small changes.
2. **Minor (`1.1.0`)** – New features, backward-compatible.
3. **Major (`2.0.0`)** – Breaking changes, may require migration.
4. `^` (Caret) – Automatically updates minor and patch versions.
5. `~` (Tilde) – Updates only the patch version.

## Git Initialization
```sh
git init
```

## Routing in Express
1. **Order of Routes Matters:** Define specific routes before generic ones.
2. **Wildcard Route (`/*`)**: Acts as a catch-all route for undefined paths.
3. **Route Differentiation:**
   - `/hello/2` (Different from `/hello2`)
   - `/ab?c` (Optional `b`)
   - `/ab+c` (One or more `b`'s allowed)
   - `/ab*cd` (Anything between `ab` and `cd` is valid)
   - `/a(bc)?d` (`bc` is optional)
   - `/.*fly$/` (Must end with "fly")

## Middleware in Express
- **Middleware runs in sequence from top to bottom.**
- Middleware can have multiple callbacks.
- Use `app.use(path, callback)` to define middleware.
- Example:
```javascript
app.use((req, res, next) => {
    console.log("Request received");
    next();
});
```

## Error Handling
```javascript
app.get("/data", (req, res, next) => {
    throw new Error("Something went wrong");
});

app.use((err, req, res, next) => {
    res.status(500).send("Internal Server Error");
});
```

## HTTP Status Codes
- **200** – Success
- **201** – Created
- **204** – No Content
- **301** – Moved Permanently
- **404** – Not Found
- **500** – Internal Server Error

## Connecting to MongoDB with Mongoose
1. Install Mongoose: `npm i mongoose`
2. Create a `config/database.js` file:
```javascript
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect("Your_Cluster_URI/DatabaseName");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};
module.exports = connectDB;
```

## Defining a Mongoose Schema
```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
```

## API to Add a User
```javascript
app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});
```

## JSON vs JavaScript Objects
- JSON keys and values must be inside `"quotes"`.
- Objects can have methods and `undefined` values, JSON cannot.
- Conversion:
  - `JSON.stringify(obj)` (Object → JSON)
  - `JSON.parse(jsonString)` (JSON → Object)

## Data Validation in Mongoose
```javascript
firstName: { type: String, required: true, minLength: 2, maxLength: 50 }
email: { type: String, required: true, unique: true, validate: (value) => value.includes("@") }
```

## Data Security (Password Hashing with Bcrypt)
```sh
npm i bcrypt
```
```javascript
const bcrypt = require("bcrypt");

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
```

## Authentication with JWT
1. Install: `npm i jsonwebtoken cookie-parser`
2. Generate JWT:
```javascript
const jwt = require("jsonwebtoken");
const token = jwt.sign({ _id: user.id }, "secretKey", { expiresIn: "1h" });
res.cookie("token", token, { httpOnly: true });
```
3. Middleware to Verify Token:
```javascript
const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Unauthorized");
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = decoded;
        next();
    });
};
```

## Modularizing API Routes
1. Create a `routes` folder.
2. Define separate files:
   - `auth.js` (Signup, Login, Logout)
   - `profileRouter.js` (Profile-related APIs)
   - `connectionRouter.js` (User connections, likes, matches)
   - `userRouter.js` (General user-related APIs)
3. Example `auth.js`:
```javascript
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
```

## Conclusion
This structured backend setup ensures:
- Modular code organization
- Secure authentication
- Proper error handling
- Scalable API development

By following these best practices, DevTinder's backend will be efficient, secure, and production-ready! 🚀

