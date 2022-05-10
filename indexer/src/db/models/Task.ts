import mongoose from "mongoose";

export interface Task {
  contract: string;
  entrypoint: string;
  metadata: string;
  owner: string;
  credits: string;
  tip: string;
  estimatedFee: number;
  lastExecuted: Date;
}

const taskModel = new mongoose.Schema<Task>({
  contract: {
    type: String,
    unique: true,
  },
  entrypoint: {
    type: String,
  },
  metadata: {
    type: String,
  },
  owner: {
    type: String,
    index: true,
  },
  credits: {
    type: String,
  },
  tip: {
    type: String,
  },
  estimatedFee: {
    type: Number,
  },
  lastExecuted: {
    type: Date,
  },
});

export default mongoose.model<Task>("Task", taskModel);
