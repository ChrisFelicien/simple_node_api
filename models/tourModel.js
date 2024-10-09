import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name'],
    unique: true,
  },
  price: { type: Number, required: [true, 'Please provide the price'] },
  rating: { type: Number, default: 4.5 },
});

export default mongoose.model('Tour', tourSchema);
