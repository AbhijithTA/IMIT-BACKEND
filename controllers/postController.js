import AWS from "aws-sdk";
import Post from "../models/Post.js";
import dotenv from 'dotenv';

dotenv.config();


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const uploadImageToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const upload = await s3.upload(params).promise();
  return upload.Location;
};

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;
    console.log(caption);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadImageToS3(file);

    const newPost = await Post.create({
      user: req.user.id,
      caption,
      imageUrl,
      createdAt: new Date(),
      likes: [],
      comments: [],
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error liking post", error: err });
  }
};

export const commentPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

     // Add the comment to the post
     const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            user: req.user.id,
            text: comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true } 
    ).populate('comments.user', 'username'); 

    res.status(200).json(updatedPost.comments[updatedPost.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: "Error commenting on post", error: err });
  }
};
