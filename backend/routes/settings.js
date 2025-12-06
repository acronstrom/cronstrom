const express = require('express');
const Setting = require('../models/Setting');
const { auth, adminOnly, editorOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/settings/public
// @desc    Get all public settings
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const settings = await Setting.find({ isPublic: true });
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// @route   GET /api/settings
// @desc    Get all settings (admin only)
// @access  Private (Admin/Editor only)
router.get('/', [auth, editorOnly], async (req, res) => {
  try {
    const settings = await Setting.find().sort({ category: 1, key: 1 });
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// @route   GET /api/settings/:key
// @desc    Get a specific setting by key
// @access  Private (Admin/Editor only)
router.get('/:key', [auth, editorOnly], async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Server error fetching setting' });
  }
});

// @route   PUT /api/settings/:key
// @desc    Update a specific setting
// @access  Private (Admin only)
router.put('/:key', [auth, adminOnly], async (req, res) => {
  try {
    const { value, type, description, category, isPublic } = req.body;
    
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { 
        value, 
        ...(type && { type }),
        ...(description && { description }),
        ...(category && { category }),
        ...(typeof isPublic === 'boolean' && { isPublic })
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({
      message: 'Setting updated successfully',
      setting
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Server error updating setting' });
  }
});

// @route   PUT /api/settings
// @desc    Update multiple settings at once
// @access  Private (Admin only)
router.put('/', [auth, adminOnly], async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings data' });
    }

    const updates = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        Setting.findOneAndUpdate(
          { key },
          { value },
          { new: true, upsert: true }
        )
      )
    );
    
    res.json({
      message: 'Settings updated successfully',
      count: updates.length
    });
  } catch (error) {
    console.error('Bulk update settings error:', error);
    res.status(500).json({ error: 'Server error updating settings' });
  }
});

// @route   DELETE /api/settings/:key
// @desc    Delete a setting
// @access  Private (Admin only)
router.delete('/:key', [auth, adminOnly], async (req, res) => {
  try {
    const setting = await Setting.findOneAndDelete({ key: req.params.key });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Server error deleting setting' });
  }
});

module.exports = router;

