import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
  },
  photo: {
    type: String,
    trim: true,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);

  console.log(bcrypt.hashSync(this.password, salt));
  next();
});

export default mongoose.model('User', userSchema);
