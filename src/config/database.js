import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
      console.log('Tentative de connexion avec URI:', process.env.MONGODB_URI);
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connecté à MongoDB Atlas');
    } catch (error) {
      console.error('Erreur de connexion à MongoDB:', error);
      process.exit(1);
    }
  };

export default connectDB;