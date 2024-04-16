import mongoose from "mongoose";

mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/social-media"
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
  console.log("Error: ", error);
});

export const connection = mongoose.connection;
