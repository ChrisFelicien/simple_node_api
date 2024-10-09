import {} from 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 4000;

const DB = process.env.MONGO_URL.replace(/PASSWORD/, process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => console.log('Connected to DB'));

app.listen(PORT, () => console.log(`The app is running on port ${PORT}`));
