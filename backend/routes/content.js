const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Content = require('../models/Content');
const { auth, adminOnly, editorOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/content
// @desc    Get all published content (public) or all content (admin/editor)
// @access  Public for published, Private for admin/editor
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['page', 'post', 'project', 'service']),
  query('status').optional().isIn(['draft', 'published', 'archived']),
  query('search').optional().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // If not authenticated or not admin/editor, only show published content
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
      query.status = 'published';
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Get content with pagination
    const content = await Content.find(query)
      .populate('author', 'name email')
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Content.countDocuments(query);

    res.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Server error fetching content' });
  }
});

// @route   GET /api/content/:id
// @desc    Get content by ID
// @access  Public for published, Private for admin/editor
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('author', 'name email');
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check permissions
    if (content.status !== 'published' && 
        (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor'))) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({ error: 'Server error fetching content' });
  }
});

// @route   GET /api/content/slug/:slug
// @desc    Get content by slug
// @access  Public for published, Private for admin/editor
router.get('/slug/:slug', async (req, res) => {
  try {
    const content = await Content.findOne({ slug: req.params.slug }).populate('author', 'name email');
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check permissions
    if (content.status !== 'published' && 
        (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor'))) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Get content by slug error:', error);
    res.status(500).json({ error: 'Server error fetching content' });
  }
});

// @route   POST /api/content
// @desc    Create new content
// @access  Private (Admin/Editor only)
router.post('/', [
  auth,
  editorOnly,
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('content').isLength({ min: 1 }),
  body('type').optional().isIn(['page', 'post', 'project', 'service']),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('excerpt').optional().isLength({ max: 500 }),
  body('slug').optional().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contentData = {
      ...req.body,
      author: req.user._id
    };

    // Check if slug already exists
    if (contentData.slug) {
      const existingContent = await Content.findOne({ slug: contentData.slug });
      if (existingContent) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    const content = new Content(contentData);
    await content.save();
    await content.populate('author', 'name email');

    res.status(201).json({
      message: 'Content created successfully',
      content
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Server error creating content' });
  }
});

// @route   PUT /api/content/:id
// @desc    Update content
// @access  Private (Admin/Editor only)
router.put('/:id', [
  auth,
  editorOnly,
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('content').optional().isLength({ min: 1 }),
  body('type').optional().isIn(['page', 'post', 'project', 'service']),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('excerpt').optional().isLength({ max: 500 }),
  body('slug').optional().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check if slug already exists (excluding current content)
    if (req.body.slug && req.body.slug !== content.slug) {
      const existingContent = await Content.findOne({ 
        slug: req.body.slug,
        _id: { $ne: req.params.id }
      });
      if (existingContent) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({
      message: 'Content updated successfully',
      content: updatedContent
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Server error updating content' });
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete content
// @access  Private (Admin only)
router.delete('/:id', [auth, adminOnly], async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await Content.findByIdAndDelete(req.params.id);

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Server error deleting content' });
  }
});

module.exports = router;