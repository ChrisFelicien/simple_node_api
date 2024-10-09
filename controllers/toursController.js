import Tour from './../models/tourModel.js';

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

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

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour)
      return res.status(404).json({
        status: 'fail',
        message: `No tour with this id ${id}`,
      });

    res.status(200).json({
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
