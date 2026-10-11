import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    storeName: { type: String, default: 'Muthoy Bazar' },
    currency: { type: String, default: '৳' },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    phone: { type: String, default: '+880 1612-633433' },
    whatsapp: { type: String, default: '+880 1612-633433' },
    email: { type: String, default: '' },
    address: { type: String, default: '14/1, Abdul Latif Store, Shyambazar, Across Buriganga River, Dhaka, Bangladesh' },
  },
  { timestamps: true }
);
export default mongoose.model('Setting', settingSchema);
