const connectionRequest = require("../models/connectionRequestion");
const user = require("../models/user");
const client = require("../utils/imageKit");
const Avatar = require("../models/avatar");
const logger = require("../utils/observability/logger");

const USER_SAFE_DATA = "firstName lastName gender bio age photo skills";

module.exports.userRequestReceivedController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    if (!receivedRequests) {
      return res.status(201).json({ message: "you have no pending requests" });
    }

    res.status(200).json({
      message: `You have received ${receivedRequests.length} requests`,
      receivedRequests,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.userConnectionController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allConnections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = allConnections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: `You have total ${allConnections.length} connections`,
      data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.feedController = async (req, res) => {
  try {
    //* 1. Authenticate user, this page should be only visible to loggedIn user
    /** 2. photo, bio, firstName, gender, age, skills
     *  3. User should see his connections and can see users which are not his connection
     *  4. Client should not see his own data in feed page
     */

    // User should see all the user cards except
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const findConnections = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hiddenUsers = new Set();
    findConnections.forEach((REQ) => {
      hiddenUsers.add(REQ.fromUserId);
      hiddenUsers.add(REQ.toUserId);
    });

    const showUser = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hiddenUsers) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json(showUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.imgUploadController = async (req, res) => {
  try {
    const { photos } = req.body;
    if (!photos || photos.length === 0) {
      return res.status(400).json({ message: "photos payload is missing" });
    }
    if (!Array.isArray(photos)) {
      return res
        .status(400)
        .json({ message: "photos payload should be an array" });
    }

    const userId = req.user._id;
    const existing = await Avatar.findOne({ authorId: userId });
    const existingCount = existing?.photos?.length || 0;

    if (existingCount + photos.length > 6) {
      return res.status(400).json({ message: "Maximum 6 photos are allowed" });
    }

    // const response = await Avatar.findOneAndUpdate(
    //   { authorId: userId },
    //   { $push: { photos: { $each: photos } } },
    //   { new: true, runValidators: true, upsert: true },
    // );

    if (existing) {
      existing.photos.push(...photos);
      await existing.save();
    } else {
      await Avatar.create({ authorId: userId, photos });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`error: updating photos url in db ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getImgController = async (req, res) => {
  try {
    const userPhotos = await Avatar.findOne({ authorId: req.user._id });

    if (!userPhotos) {
      return res
        .status(404)
        .json({ message: "Photos not found, upload photos from edit page" });
    }

    res.status(200).json({ data: userPhotos });
  } catch (error) {
    logger.error(`error: Internal server error`);
    res.status(500).json({ message: "Internal server error" });
  }
};

