import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: Date.now
  },
  audio: {
    type: String, // Base64 encoded audio
    required: false
  }
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'Nouvelle conversation'
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ChatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
ChatSchema.index({ userId: 1, createdAt: -1 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

export default Chat;
