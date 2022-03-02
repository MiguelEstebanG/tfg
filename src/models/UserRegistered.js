import pkg from 'mongoose';
const { Schema, model } = pkg;

const UserRegisteredSchema = new Schema(
    {
      userName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true},
      reasons: { type: String, trim: true},
      job: { type: String, required: true},
    },
    {
      timestamps: true,
    }
  );

export default model("UserRegistered", UserRegisteredSchema);
