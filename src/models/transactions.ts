// src/models/operationResult.ts
import { Schema, model, Document } from 'mongoose';

interface Transactions extends Document {
  transactionId: string;
  status: string;
}

const transactionSchema = new Schema({
  transactionId: String,
  status: String,
});

export default model<Transactions>('transactions', transactionSchema);
