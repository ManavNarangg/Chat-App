const express = require("express");
const Chat = require("../Models/ChatModels");
const User = require("../Models/UserModel");

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      console.log("User Id parameter not found");
      return res.sendStatus(400);
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email picture",
    });

    if (isChat.length > 0) {
      return res.status(200).send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );

        return res.status(200).send(fullChat);
      } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (chats) => {
        chats = await User.populate(chats, {
          path: "latestMessage.sender",
          select: "name email picture",
        });
        res.status(200).send(chats);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.status(400).json({ message: "More users required" });
    }
    users.push(req.user._id); // Push the logged in user ID

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name, 
        isGroupChat: true,
        users: users,
        groupAdmin: req.user._id, 
      });
      //When created send the chat to the users
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body; // Ensure these field names match what the frontend is sending

    if (!chatId || !chatName) {
      return res.status(400).json({ error: "Chat ID and chat name are required" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      return res.status(200).json(added);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const removeFromGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!removed){
      res.status(400);
      throw new Error("Chat Not Found");
    }
    else return res.status(200).json(removed);
  } catch (error) {
    return res.status(400).json({error: error.message});
  }
};


module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
};
