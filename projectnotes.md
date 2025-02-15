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

</br>
</br>
</br>
# Node.js Backend Notes

## 1. Enum in Node.js

### What is Enum?
An **Enum (Enumeration)** is used to restrict user inputs to predefined values. It ensures that the client can only send allowed values and prevents invalid inputs.

### Why Use Enum?
- Restricts users from entering arbitrary values.
- Improves data consistency.
- Returns an error message if the user provides an invalid input.

## 2. Schema Methods and Pre-hooks in Mongoose

### Avoid Arrow Functions in Mongoose Methods
- When defining schema methods or `pre` hooks in Mongoose models, **do not use arrow functions**.
- This is because the `this` keyword inside an arrow function does not refer to the schema instance.
- Always use normal function syntax:

```javascript
userSchema.pre("save", function () {
  console.log(this); // 'this' correctly refers to the schema instance
});
```

## 3. Pre-hooks in Mongoose

A **pre-hook** is an event handler that runs before certain Mongoose operations.

### Example:
```javascript
connectionRequestSchema.pre("save", function () {
  console.log("Before saving data");
});
```
- The **pre-hook is not limited to saving data**; it can be used for other operations as well.

## 4. Indexing in MongoDB

### Why Use Indexes?
Indexes improve search speed by storing data in **B-Trees**, reducing time complexity from **O(N) (linear search)** to **O(logN)**.

### How to Create Indexes in Mongoose
```javascript
userSchema.index({ firstName: 1 });
```

### Compound Index
- Used when searching by **multiple fields** (e.g., `firstName` and `lastName`).
- The first field acts as a reference for others.

```javascript
userSchema.index({ firstName: 1, lastName: 1 });
```

## 5. API Development Best Practices

### Before Creating an API:
1. **Write down requirements** – Define validation and security checks before implementation.
2. **Consider corner cases** – Think like an attacker to ensure data security.
3. **Validate all inputs** – Prevent invalid or malicious data.
4. **Follow a structured sequence** – Perform all necessary checks before saving data.

### Example: Review API
```javascript
1. Validate that 'status' is either "accepted" or "rejected".
2. Check if 'toUserId' exists in the database.
3. Ensure that the request status is "Interested" before proceeding.
4. Save to database only after all validations are passed.
```

## 6. Secure Data Access in GET APIs
- Users should only see data they are authorized to access.
- Never expose sensitive information.

## 7. Database Relations in MongoDB

### Handling Requests
- The API should only show **pending requests** received by the logged-in user.
- Requests marked as "ignored" should be **excluded** from the response.
- If a request is marked as "Interested", it is in a **pending state** and requires user action.

## 8. Reference and Populate in Mongoose

### What is `ref`?
- `ref` creates a relationship between models.
- Example:

```javascript
const userSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
```

### Using `populate`
- Retrieves related model data.
- Example:

```javascript
User.find().populate("fromUserId", "firstName lastName age gender bio profileImg");
```
- Without specifying fields, `populate` will fetch **all data** (including sensitive fields like passwords).
- Specifying fields restricts the data returned.

## 9. Feed API

### Route: `/user/feed` (GET)
#### Purpose:
- Displays user feed containing posts, names, connections, and profile images.
- Requires **authentication**.
- Shows only **accepted connections**.

## 10. Pagination in MongoDB
- Use `.skip()` and `.limit()` to handle large datasets efficiently.

```javascript
User.find().skip(10).limit(5); // Skips first 10 results and fetches 5 records
```

## Conclusion
Following these best practices in Node.js and MongoDB ensures **optimized performance, security, and structured API development**. 🚀



