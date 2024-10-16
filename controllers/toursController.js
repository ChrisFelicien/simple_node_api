import mongoose from 'mongoose';
import Tour from './../models/tourModel.js';
import APIFeatures from './../utils/APIFeatures.js';
import asyncWrapper from './asyncWrapper.js';
import AppError from '../utils/appError.js';

export const busyMonth = asyncWrapper(async (req, res, next) => {
  const year = Number(req.params.year);

  const tours = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31`,
        },
      },
    },
    {
      $group: {
        _id: { $month: { $toDate: '$startDates' } },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStart: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    numResult: tours.length,
    tours,
  });
});

export const checkStatics = asyncWrapper(async (req, res, next) => {
  const toursStats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        avRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        numTours: { $sum: 1 },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    toursStats,
  });
});

export const getAllTours = asyncWrapper(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .pagination();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

export const createTour = asyncWrapper(async (req, res) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    tour,
  });
});

export const getTour = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError(`Sorry, No tour found with this ID.`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

export const deleteTour = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError(`Sorry, No tour found with this ID.`, 404));
  }

  res.status(204).json({
    null: null,
  });
});

export const updatedTour = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`Sorry, No tour found with this ID.`, 404));
  }

  res.status(200).json({
    status: 'success',
    tour,
  });
});

export const topFiveHighAndCheapestTour = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage4,price';
  req.query.fields = 'price,name,duration,ratingsAverage,difficulty';
  next();
};

export const checkId = (req, res, next, val) => {
  if (!mongoose.Types.ObjectId.isValid(val)) {
    return res.status(400).json({
      status: 'fail',
      message: `Sorry, Please provide a valid id`,
    });
  }
  next();
};
