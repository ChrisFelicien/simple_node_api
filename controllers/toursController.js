import Tour from './../models/tourModel.js';

export const getAllTours = async (req, res) => {
  const tours = await Tour.find();

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

export const createTour = async (req, res) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    tour,
  });
};

export const getTour = async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

export const deleteTour = async (req, res) => {
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
};

export const updatedTour = async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true });

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: `No tour with this id`,
    });

  res.status(200).json({
    status: 'success',
    tour,
  });
};
