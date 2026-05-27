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

// Sounds routes
const soundsRouter = express.Router();

soundsRouter.get('/', async (req, res) => {
  const items = await Sound.find().sort({ createdAt: -1 });
  res.json(items);
});

soundsRouter.post('/', async (req, res) => {
  const item = new Sound(req.body);
  await item.save();
  res.status(201).json(item);
});

soundsRouter.get('/:id', async (req, res) => {
  const item = await Sound.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

soundsRouter.put('/:id', async (req, res) => {
  const item = await Sound.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

soundsRouter.delete('/:id', async (req, res) => {
  await Sound.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.use('/api/sounds', soundsRouter);

// Services routes
const servicesRouter = express.Router();

servicesRouter.get('/', async (req, res) => {
  const items = await Service.find().sort({ createdAt: -1 });
  res.json(items);
});

servicesRouter.post('/', async (req, res) => {
  const item = new Service(req.body);
  await item.save();
  res.status(201).json(item);
});

servicesRouter.get('/:id', async (req, res) => {
  const item = await Service.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

servicesRouter.put('/:id', async (req, res) => {
  const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

servicesRouter.delete('/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.use('/api/services', servicesRouter);

app.get('/', (req, res) => res.send('I&N Sounds & Services API'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
