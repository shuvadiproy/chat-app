import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { groq } from "../lib/groq.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const summarizeChat = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Fetch the current user and the other user for names
    const [currentUser, otherUser] = await Promise.all([
      User.findById(myId).select("fullName"),
      User.findById(userToChatId).select("fullName"),
    ]);

    // Fetch last 50 messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    if (messages.length === 0) {
      return res.status(400).json({ error: "No messages to summarize" });
    }

    // Reverse to get chronological order
    const chronologicalMessages = messages.reverse();

    // Format messages for AI
    const formattedChat = chronologicalMessages
      .map((msg) => {
        const senderName = msg.senderId.toString() === myId.toString()
          ? currentUser.fullName
          : otherUser.fullName;
        const content = msg.text || "[Image]";
        return `${senderName}: ${content}`;
      })
      .join("\n");

    // Create the prompt for AI summarization
    const prompt = `You are a helpful assistant that summarizes chat conversations. 
Please summarize the following chat conversation in 3-5 concise bullet points.
Focus on:
- Key topics discussed
- Any decisions made
- Action items or follow-ups mentioned
- Important dates or times mentioned

Chat conversation:
${formattedChat}

Please provide the summary in a clear, easy-to-read format with bullet points.`;

    try {
      // Call Groq API with Llama model
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 500,
      });

      const summary = chatCompletion.choices[0]?.message?.content || "Unable to generate summary";
      res.status(200).json({ summary });
    } catch (apiError) {
      console.log("Groq API error, using demo mode: ", apiError.message);

      // Generate demo summary based on actual messages
      const messageCount = chronologicalMessages.length;
      const imageCount = chronologicalMessages.filter(m => m.image).length;
      const textMessages = chronologicalMessages.filter(m => m.text).slice(0, 3);

      const demoSummary = `📋 **Chat Summary** (Demo Mode - API Error)

• **Conversation between**: ${currentUser.fullName} and ${otherUser.fullName}
• **Total messages**: ${messageCount} messages analyzed
• **Media shared**: ${imageCount} image(s)
• **Recent topics**: ${textMessages.map(m => `"${m.text?.substring(0, 30)}..."`).join(", ") || "General conversation"}

⚠️ *This is a demo summary. Please check your API key or try again.*`;

      res.status(200).json({ summary: demoSummary, isDemo: true });
    }
  } catch (error) {
    console.log("Error in summarizeChat controller: ", error.message);
    res.status(500).json({ error: "Failed to summarize chat. Please try again." });
  }
};
