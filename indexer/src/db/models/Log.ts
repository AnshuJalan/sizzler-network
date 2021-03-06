import mongoose, { Schema, Types } from "mongoose";

export interface Log {
  task: Types.ObjectId;
  opHash: string;
  sizzler: string;
  sizzleMinted: string;
  tip: string;
  completedAt: Date;
}

const logModel = new mongoose.Schema<Log>({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
  },
  opHash: {
    type: String,
  },
  sizzler: {
    type: String,
  },
  sizzleMinted: {
    type: String,
  },
  tip: {
    type: String,
  },
  completedAt: {
    type: Date,
  },
});

export default mongoose.model<Log>("Log", logModel);
