const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a role name'],
      unique: true,
      enum: ['user', 'admin', 'lawyer']
    },
    permissions: [
      {
        type: String,
        enum: [
          'create_case',
          'edit_case',
          'delete_case',
          'view_case',
          'manage_users',
          'can_upload_documents',
          'manage_clients'
        ]
      }
    ],
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
