import mongoose from 'mongoose';
import Tour from './../models/tourModel.js';
import APIFeatures from './../utils/APIFeatures.js';

export const busyMonth = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const checkStatics = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      tour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const getTour = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) throw new Error(`No tour with this id`);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // try {
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error.message,
  //   });
  // }
});

export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      null: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: `Invalid data sent`,
    });
  }
};

export const updatedTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour)
      return res.status(404).json({
        status: 'fail',
        message: `No tour with this id`,
      });

    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: `Invalid data sent`,
    });
  }
};

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
      message: `Sorry this id is not valid`,
    });
  }
  next();
};

const asyncWrapper = (cb) => {
  cb(req, res, next).catch((err) => next(err));
};
