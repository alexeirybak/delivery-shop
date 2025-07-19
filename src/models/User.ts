import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  surname: { type: String, required: true },
  firstName: { type: String, required: true },
  password: { type: String, required: true },
  birthdayDate: { type: Date },
  region: { type: String, required: true },
  location: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  card: { type: String },
  email: { type: String },
  hasCard: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Хеширование пароля перед сохранением
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
