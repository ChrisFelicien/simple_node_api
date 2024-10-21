import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      validate: [validator.isAlpha, 'Name must contains only alpha characters'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide a email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please provide the password'],
      min: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      trim: true,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: `Password and password confirm must be equal.`,
      },
      select: 0,
    },
    photo: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.correctPassword = async (givenPassword, validPassword) => {
  return await bcrypt.compare(givenPassword, validPassword);
};

userSchema.methods.hasPasswordBeenChanged = function (JWT_Timestamp) {
  if (this.passwordChangedAt) {
    const changeToTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changeToTimestamp > JWT_Timestamp;
  }
  // Not changed
  return false;
};

export default mongoose.model('User', userSchema);
