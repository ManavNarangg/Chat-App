const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
);

// Corrected from `mongoose.Model` to `mongoose.model`
const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
