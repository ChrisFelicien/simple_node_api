import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name'],
    unique: true,
    trim: true,
  },
  price: { type: Number, required: [true, 'Please provide the price'] },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a size'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have difficulty'],
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    required: [true, 'Please provide a summary'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Please provide a image cover'],
  },
  image: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDate: {
    type: [Date],
  },
});

export default mongoose.model('Tour', tourSchema);
