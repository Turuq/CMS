import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export default async function mongoClient() {
  await mongoose.connect(process.env.MONGODB_DEV_URI!);
}
