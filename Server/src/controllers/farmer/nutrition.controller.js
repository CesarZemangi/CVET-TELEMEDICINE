import { FeedInventory } from "../../models/associations.js";
import { getPagination, getPagingData } from "../../utils/pagination.utils.js";

export const getFeedInventory = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await FeedInventory.findAndCountAll({
      where: { farmer_id: req.user.id },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const response = getPagingData(data, page, limit);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const addFeedInventory = async (req, res) => {
  try {
    const { feed_name, quantity, unit, low_stock_threshold } = req.body;
    
    const feed = await FeedInventory.create({
      farmer_id: req.user.id,
      feed_name,
      quantity,
      unit: unit || "kg",
      low_stock_threshold: low_stock_threshold || 10.00,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json(feed);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Item already exists in inventory" });
    }
    res.status(500).json({ error: err.message });
  }
}

export const updateFeedInventory = async (req, res) => {
  try {
    const { feed_name, quantity, unit, low_stock_threshold } = req.body;
    const { id } = req.params;

    await FeedInventory.update({
      feed_name,
      quantity,
      unit,
      low_stock_threshold,
      updated_by: req.user.id
    }, {
      where: { id, farmer_id: req.user.id }
    });

    res.json({ message: "Inventory updated" });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Another item with this name already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

export const deleteFeedInventory = async (req, res) => {
  try {
    const { id } = req.params;
    await FeedInventory.destroy({
      where: { id, farmer_id: req.user.id }
    });
    res.json({ message: "Inventory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
