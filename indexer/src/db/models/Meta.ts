import mongoose from "mongoose";

interface Meta {
  taskIndexLastLevel: number;
  logIndexLastLevel: number;
}

const metaModel = new mongoose.Schema<Meta>({
  taskIndexLastLevel: {
    type: Number,
  },
  logIndexLastLevel: {
    type: Number,
  },
});

export default mongoose.model<Meta>("Meta", metaModel);
