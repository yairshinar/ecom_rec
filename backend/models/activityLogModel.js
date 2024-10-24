const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    user_id: String,
    product_id: String,
    action: String,
    timestamp: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
module.exports = ActivityLog;
