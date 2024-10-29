
const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { caption, imageUrl } = req.body;
  try {
    const post = await Post.create({ user: req.user.id, caption, imageUrl });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};
