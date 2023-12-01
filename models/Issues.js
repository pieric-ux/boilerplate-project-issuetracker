const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: '' },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: '' }
},
{
  timestamps: true
});

const Issue = mongoose.model('Issue', IssueSchema);

module.exports = Issue;
