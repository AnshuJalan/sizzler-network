import mongoose from "mongoose";

interface Sizzler {
  address: string;
  stake: string;
  taskCounter: number;
  taskLimit: number;
  lastResetAt: Date;
  deposit: {
    amount: string;
    confirmationAt: Date;
  };
  withdrawal: {
    amount: string;
    confirmationAt: Date;
  };
}

const sizzlerModel = new mongoose.Schema<Sizzler>({
  address: {
    type: String,
    unique: true,
  },
  stake: {
    type: String,
  },
  taskCounter: {
    type: Number,
  },
  taskLimit: {
    type: Number,
  },
  lastResetAt: {
    type: Date,
  },
  deposit: {
    type: {
      amount: String,
      confirmationAt: Date,
    },
  },
  withdrawal: {
    type: {
      amount: String,
      confirmationAt: Date,
    },
  },
});

export default mongoose.model("Sizzler", sizzlerModel);
