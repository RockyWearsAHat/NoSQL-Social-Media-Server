import express, { Express } from "express";
import { connection } from "../db/connect";
import session from "express-session";
import MongoStore from "connect-mongo";

import { apiRouter } from "./routes/api/masterAPIRouter";
import { IUser } from "../db/models/user";

const app: Express = express();

//Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set up session for logged in user
declare module "express-session" {
  interface SessionData {
    user: Partial<IUser>;
  }
}

const store = MongoStore.create({
  client: connection.getClient(),
  collectionName: "sessions",
});
app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 Hours
    },
    store: store,
    resave: true,
    saveUninitialized: false,
  })
);

//Routes
app.use("/api", apiRouter);

app.use("*", async (_req, res) => {
  res.json({ success: false, message: "Invalid route" });
});

app.listen(3000, async () => {
  console.log("Server running on http://localhost:3000");
});
