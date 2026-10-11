import Setting from '../models/Setting.js';
import { asyncHandler, err } from '../utils/helpers.js';

const get = () => Setting.findOneAndUpdate({ key: 'main' }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

export const read = asyncHandler(async (req, res) => res.json(await get()));

export const update = asyncHandler(async (req, res) => {
  const b = req.body;
  const d = {
    storeName: String(b.storeName || '').trim(), currency: String(b.currency || '').trim(), taxRate: Number(b.taxRate),
    phone: String(b.phone || '').trim(), whatsapp: String(b.whatsapp || '').trim(), email: String(b.email || '').trim(), address: String(b.address || '').trim(),
  };
  if (!d.storeName) throw err(400, 'Enter the store name');
  if (!d.currency || d.currency.length > 5) throw err(400, 'Currency symbol must be 1 to 5 characters');
  if (!(d.taxRate >= 0 && d.taxRate <= 100)) throw err(400, 'Tax rate must be between 0 and 100');
  if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) throw err(400, 'Enter a valid email address');
  res.json(await Setting.findOneAndUpdate({ key: 'main' }, d, { upsert: true, new: true, runValidators: true }));
});
