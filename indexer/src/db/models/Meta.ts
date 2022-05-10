import mongoose from "mongoose";

interface Meta {
  taskIndexLastLevel: number;
  logIndexLastLevel: number;
  sizzlerIndex: {
    mainLastLevel: number;
    depositsLastLevel: number;
    withdrawalsLastLevel: number;
  };
}

const metaModel = new mongoose.Schema<Meta>({
  taskIndexLastLevel: {
    type: Number,
  },
  logIndexLastLevel: {
    type: Number,
  },
  sizzlerIndex: {
    type: {
      mainLastLevel: Number,
      depositsLastLevel: Number,
      withdrawalsLastLevel: Number,
    },
  },
});

export default mongoose.model<Meta>("Meta", metaModel);
