import mongoose, { Schema, models, model } from 'mongoose'

const ExpenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
}, { timestamps: true })

const Expense = models.Expense || model('Expense', ExpenseSchema)
export default Expense