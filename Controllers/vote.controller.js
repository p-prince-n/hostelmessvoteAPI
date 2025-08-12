import Vote from '../models/vote.model.js';
import MenuItem from '../models/menueItems.model.js';
import mongoose from 'mongoose';

const getTodayString = () => {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const vote = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { menuItemId } = req.body;
    if (!menuItemId) return res.status(400).json({ message: 'menuItemId required' });

    const menu = await MenuItem.findById(menuItemId);
    if (!menu) return res.status(404).json({ message: 'Menu item not found' });

    const voteDate = getTodayString();

    const newVote = new Vote({ student: studentId, menuItem: mongoose.Types.ObjectId(menuItemId), voteDate });

    try {
      const saved = await newVote.save();
      return res.status(201).json({ message: 'Vote recorded', vote: saved });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: 'You have already voted today' });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ message: 'Voting failed', error: err.message });
  }
};

export const myVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ student: req.user._id }).populate('menuItem', 'name description').sort({ createdAt: -1 });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: 'Fetch my votes failed', error: err.message });
  }
};
