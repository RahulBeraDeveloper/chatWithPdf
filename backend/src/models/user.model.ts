
// import mongoose, { Document, Schema } from "mongoose";

// export interface IUser extends Document {

//     uid: string; // 🔥 ADD THIS
//   name: string;
//   email: string;
//   photoUrl?: string;
//   authProvider: "google" | "email";
//   passwordHash?: string;
// }



// const UserSchema: Schema = new Schema(
//   {
//     uid: {
//       type: String,
//       required: true,
//       unique: true, // ✅ correct unique field
//       index: true,
//     },

//     name: { type: String, required: true },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     photoUrl: { type: String },

//     authProvider: {
//       type: String,
//       enum: ["google", "email"],
//       default: "google",
//     },

//     passwordHash: { type: String },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IUser>("User", UserSchema);


import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  uid: string;
  name: string;
  email: string;
  photoUrl?: string;
  authProvider: "google" | "email";
  passwordHash?: string;
  isEmailVerified: boolean;
}

const UserSchema: Schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    photoUrl: { type: String },

    authProvider: {
      type: String,
      enum: ["google", "email"],
      default: "google",
    },

    // Plain-text password (only for email-registered users)
    passwordHash: { type: String },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);