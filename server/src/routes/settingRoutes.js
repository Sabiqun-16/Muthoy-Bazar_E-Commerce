import { Router } from 'express';
import { read, update } from '../controllers/settingController.js';
import { protect, staff, can } from '../middleware/auth.js';

const r = Router();
r.get('/', read); // public store info
r.put('/', protect, staff(), can('settings'), update);
export default r;
