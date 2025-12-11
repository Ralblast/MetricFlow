import ApiEndpoint from '../models/ApiEndpoint.js';
import mongoose from 'mongoose';

export const getEndpoints = async (req, res) => {
  try {
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);
    const endpoints = await ApiEndpoint.find({ orgId }).sort({ createdAt: -1 });
    res.status(200).json({ endpoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEndpoint = async (req, res) => {
  try {
    const { name, url, method } = req.body;
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);

    if (!name || !url) {
      return res.status(400).json({ message: 'Name and URL required' });
    }

    // Check max 5 endpoints per organization
    const existingCount = await ApiEndpoint.countDocuments({ orgId });
    if (existingCount >= 5) {
      return res.status(400).json({ message: 'Maximum 5 endpoints allowed per organization' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    const endpoint = await ApiEndpoint.create({
      orgId,
      name,
      url,
      method: method || 'GET'
    });

    res.status(201).json({ endpoint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEndpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);

    const endpoint = await ApiEndpoint.findOneAndDelete({
      _id: id,
      orgId: orgId
    });

    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    res.status(200).json({ message: 'Endpoint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleEndpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);

    const endpoint = await ApiEndpoint.findOne({ _id: id, orgId });

    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    endpoint.isActive = !endpoint.isActive;
    await endpoint.save();

    res.status(200).json({ endpoint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
