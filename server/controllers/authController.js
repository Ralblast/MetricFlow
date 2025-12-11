import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Metric from '../models/Metric.js';

// Helper to create initial demo metrics for new org
const createInitialMetrics = async (orgId) => {
  const now = Date.now();
  const metrics = [];
  
  // Create 60 data points (1 hour of 1-minute intervals)
  for (let i = 60; i > 0; i--) {
    const timestamp = new Date(now - i * 60 * 1000);
    
    metrics.push(
      {
        orgId,
        type: 'CPU',
        value: 40 + Math.random() * 20,
        timestamp,
        metadata: { serverId: 'server-01', region: 'us-east-1' }
      },
      {
        orgId,
        type: 'Memory',
        value: 55 + Math.random() * 15,
        timestamp,
        metadata: { serverId: 'server-01', region: 'us-east-1' }
      },
      {
        orgId,
        type: 'Latency',
        value: 120 + Math.random() * 80,
        timestamp,
        metadata: { serverId: 'server-01', region: 'us-east-1' }
      }
    );
  }
  
  await Metric.insertMany(metrics);
  console.log(`✓ Created ${metrics.length} initial demo metrics for org ${orgId}`);
};


export const register = async (req, res) => {
  try {
    const { email, password, orgName } = req.body;

    if (!email || !password || !orgName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const org = await Organization.create({ name: orgName });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      orgId: org._id
    });

    await createInitialMetrics(org._id);

    const token = jwt.sign(
      { id: user._id, email: user.email, orgId: org._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        orgId: org._id,
        orgName: org.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const org = await Organization.findById(user.orgId);

    const token = jwt.sign(
      { id: user._id, email: user.email, orgId: user.orgId.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        orgId: user.orgId,
        orgName: org.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
