import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must be less or equal to 40'],
      minlength: [7, 'Tour name must be more or equal to 7'],
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
      enum: {
        values: ['difficult', 'medium', 'easy'],
        message: `Please provide valid easy, medium or difficult`,
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be bellow 5.0'],
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
    startDates: {
      type: [Date],
    },
    slug: {
      type: String,
    },
    secret: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline?.().unshift({
    $match: {
      secret: { $ne: true },
    },
  });

  next();
});

export default mongoose.model('Tour', tourSchema);
