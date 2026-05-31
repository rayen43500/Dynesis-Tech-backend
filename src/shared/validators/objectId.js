import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z
  .string()
  .refine((v) => mongoose.Types.ObjectId.isValid(v), { message: 'Invalid ObjectId' });

