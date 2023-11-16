import mongoose from 'mongoose';

export default function connectToMongoDB(): void {
  mongoose.connect('mongodb://mongodb:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}
