import Tour from './../models/tourModel.js';
import mongoose from 'mongoose';

export const checkId = (req, res, next, val) => {
  if (!mongoose.Types.ObjectId.isValid(val)) {
    return res.status(400).json({
      status: 'fail',
      message: `Sorry this id is not valid`,
    });
  }
  next();
};

export const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludesFields = ['page', 'sort', 'limit', 'fields'];

    excludesFields.forEach((filed) => delete queryObj[filed]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`); //Replace all sign

    let query = Tour.find(JSON.parse(queryStr)).select('price');

    const tours = await query;

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
      message: `Invalid data sent`,
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
      message: `Invalid data sent`,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);

    if (!tour) throw new Error(`No tour with this id`);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

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
