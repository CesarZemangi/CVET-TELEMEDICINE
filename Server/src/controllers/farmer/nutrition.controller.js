import { FeedInventory } from "../../models/associations.js";

export const getFeedInventory = async (req, res) => {
  try {
    const rows = await FeedInventory.findAll({
      where: { farmer_id: req.user.id }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const addFeedInventory = async (req, res) => {
  try {
    const { feed_name, quantity } = req.body;
    
    const feed = await FeedInventory.create({
      farmer_id: req.user.id,
      feed_name,
      quantity,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}