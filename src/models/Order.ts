import { Item } from '@/pages';
import mongoose from 'mongoose';

export interface Orders extends mongoose.Document {
  name: string;
  fbUrl: string;
  items: Item[];
  checked: boolean;
  note: string;
}

/* OrderSchema will correspond to a collection in your MongoDB database. */
const OrderSchema = new mongoose.Schema<Orders>({
  name: {
    /* The name of this pet */

    type: String,
    required: true,
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  fbUrl: {
    /* The name of this pet */
    type: String,
    required: true,
  },
  items: {
    type: mongoose.SchemaTypes.Mixed,
  },
  note: {
    type: String,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Order ||
  mongoose.model<Orders>('Order', OrderSchema);
