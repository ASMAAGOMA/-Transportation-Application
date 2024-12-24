const Notification = require('../models/Notification');

const createNotification = async (userId, message, type) => {
    try {
        const { userId, message, type } = req.body;
    
        const newNotification = new Notification({ userId, message, type });
        await newNotification.save();
    
        res.status(201).json({ success: true, notification: newNotification });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
};

const getNotification = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

const updateNotification = async (req, res) => {
    try {
    const { userId } = req.params;

    await Notification.updateMany({ userId, status: 'unread' }, { status: 'read' });
    res.status(200).json({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    createNotification,
    getNotification,
    updateNotification
};