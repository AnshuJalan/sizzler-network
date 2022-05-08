import mongoose from "mongoose";

const logModel = new mongoose.Schema({
  task: {
    type: "ObjectId",
    ref: "Task",
  },
  sizzler: {
    type: String,
  },
  szlMinted: {
    type: String,
  },
  tip: {
    type: String,
  },
  completedAt: {
    type: Date,
  },
});

export default mongoose.model("Log", logModel);
