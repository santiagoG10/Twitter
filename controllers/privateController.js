const Tweet = require("../models/Tweet");
const User = require("../models/User");
const _ = require("lodash");

async function index(req, res) {
  const loggedUser = await User.findById(req.user._id);
  const followingTweets = await Tweet.find({
    user: { $in: loggedUser.following },
  })
    .populate("author")
    .sort({ createdAt: "desc" })
    .limit(20);
  return res.render("home", { followingTweets });
}

async function create(req, res) {
  const newTweet = new Tweet({
    author: req.user._id,
    content: req.body.content,
  });
  await newTweet.save();
  return res.redirect("/");
}

async function indexUser(req, res) {
  const profileUser = await User.findOne({
    username: req.params.username,
  }).populate("tweets");
  return res.render("profile", { profileUser });
}

async function deleteTweet(req, res) {
  await Tweet.findByIdAndRemove(req.params.tweetId);
  return res.redirect("back");
}

async function updateLike(req, res) {
  const tweet = await Tweet.findById(req.params.tweetId).populate("likes");
  console.log(tweet);
  console.log(_.findIndex(tweet.likes, { _id: req.user._id }));
  if (_.findIndex(tweet.likes, { _id: req.user._id }) === -1) {
    await Tweet.findByIdAndUpdate(req.params.tweetId, {
      $push: { likes: req.user._id },
    });
  } else {
    await Tweet.findByIdAndUpdate(req.params.tweetId, {
      $pull: { likes: req.user._id },
    });
  }
  const editedTweet = await Tweet.findById(req.params.tweetId).populate(
    "likes"
  );
  console.log(_.findIndex(editedTweet.likes, { _id: req.user_id }));
  console.log(editedTweet);
  return res.redirect("back");
}

async function followers(req, res) {
  const profileUser = await User.findOne({
    username: req.params.username,
  }).populate("followers");
  return res.render("followers", { profileUser });
}

async function following(req, res) {
  const profileUser = await User.findOne({
    username: req.params.username,
  }).populate("following");
  return res.render("following", { profileUser });
}

async function follow(req, res) {
  const user = await User.findById(req.params.id);
  if (_.findIndex(user.followers, { _id: req.user._id }) === -1) {
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.params.id },
    });
  } else {
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id },
    });
  }
  return res.redirect("back");
}

async function unfollow(req, res) {
  return res.redirect("back");
}

module.exports = {
  index,
  indexUser,
  create,
  deleteTweet,
  updateLike,
  follow,
  unfollow,
  followers,
  following,
};
