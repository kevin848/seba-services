const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/in-sounds';

mongoose
  .connect(MONGO)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

// Schemas
const soundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

const Sound = mongoose.model('Sound', soundSchema);
const Service = mongoose.model('Service', serviceSchema);

// Helper: pagination and search
function parseListQuery(req) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const q = (req.query.q || '').trim();
  return { page, limit, skip, q };
}

// Central async wrapper to catch errors
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Sounds routes
const soundsRouter = express.Router();

soundsRouter.get('/', wrap(async (req, res) => {
  const { limit, skip, q } = parseListQuery(req);
  const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }] } : {};
  const [items, total] = await Promise.all([
    Sound.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Sound.countDocuments(filter)
  ]);
  res.json({ items, total, limit });
}));

soundsRouter.post('/', wrap(async (req, res) => {
  const { title, description, url } = req.body || {};
  if (!title || typeof title !== 'string') return res.status(400).json({ message: '`title` is required' });
  const item = new Sound({ title: title.trim(), description, url });
  await item.save();
  res.status(201).json(item);
}));

soundsRouter.get('/:id', wrap(async (req, res) => {
  const item = await Sound.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}));

soundsRouter.put('/:id', wrap(async (req, res) => {
  const updates = req.body || {};
  if (updates.title && typeof updates.title !== 'string') return res.status(400).json({ message: '`title` must be a string' });
  const item = await Sound.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}));

soundsRouter.delete('/:id', wrap(async (req, res) => {
  await Sound.findByIdAndDelete(req.params.id);
  res.status(204).end();
}));

app.use('/api/sounds', soundsRouter);

// Services routes
const servicesRouter = express.Router();

servicesRouter.get('/', wrap(async (req, res) => {
  const { limit, skip, q } = parseListQuery(req);
  const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }] } : {};
  const [items, total] = await Promise.all([
    Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Service.countDocuments(filter)
  ]);
  res.json({ items, total, limit });
}));

servicesRouter.post('/', wrap(async (req, res) => {
  const { name, description, price } = req.body || {};
  if (!name || typeof name !== 'string') return res.status(400).json({ message: '`name` is required' });
  const item = new Service({ name: name.trim(), description, price });
  await item.save();
  res.status(201).json(item);
}));

servicesRouter.get('/:id', wrap(async (req, res) => {
  const item = await Service.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}));

servicesRouter.put('/:id', wrap(async (req, res) => {
  const updates = req.body || {};
  if (updates.name && typeof updates.name !== 'string') return res.status(400).json({ message: '`name` must be a string' });
  const item = await Service.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}));

servicesRouter.delete('/:id', wrap(async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(204).end();
}));

app.use('/api/services', servicesRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.get('/', (req, res) => res.send('I&N Sounds & Services API'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
