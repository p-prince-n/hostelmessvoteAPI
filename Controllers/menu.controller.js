import MenuItem from '../models/menueItems.model.js';
import Vote from '../models/vote.model.js';

export const createMenuItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'name required' });

    const exists = await MenuItem.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (exists) return res.status(400).json({ message: 'Menu item already exists' });

    const item = await MenuItem.create({ name, description, createdBy: req.user._id });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Create menu item failed', error: err.message });
  }
};



export const topMenuItems = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 3;
    if (limit <= 0) limit = 3;

    const agg = await Vote.aggregate([
      { $group: { _id: '$menuItem', votes: { $sum: 1 } } },
      { $sort: { votes: -1 } },
      { $limit: limit },
      { $lookup: { from: 'menuitems', localField: '_id', foreignField: '_id', as: 'menuItem' } },
      { $unwind: '$menuItem' },
      { $project: { _id: '$menuItem._id', name: '$menuItem.name', description: '$menuItem.description', votes: 1 } }
    ]);

    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: 'Top menu items failed', error: err.message });
  }
};

export const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({}, { name: 1, _id: 0 }).sort({ name: 1 }); 
    if(items.length<=0) return res.status(404).json({ message: 'Currently items doesn\'t exist.' });
    

    res.json({items});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu items', error: err.message });
  }
};
