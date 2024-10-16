import {} from 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('Shouting down the server');

  process.exit(1);
});

const PORT = process.env.PORT || 4000;

const DB = process.env.MONGO_URL.replace(/PASSWORD/, process.env.DB_PASSWORD);
mongoose
  .connect(DB)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err));

const server = app.listen(PORT, () =>
  console.log(`The app is running on port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
