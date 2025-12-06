const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    default: 'string'
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'seo', 'social', 'contact', 'appearance', 'api'],
    default: 'general'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Static method to get setting by key
settingSchema.statics.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set setting
settingSchema.statics.setSetting = async function(key, value, type = 'string', description = '', category = 'general', isPublic = false) {
  return await this.findOneAndUpdate(
    { key },
    { value, type, description, category, isPublic },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Setting', settingSchema);