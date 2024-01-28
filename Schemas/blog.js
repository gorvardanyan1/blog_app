import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [commentSchema],
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog;