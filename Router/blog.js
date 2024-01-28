import express from 'express';
import { authenticateJWT } from '../jwt/jwt.js';
import Blog from '../Schemas/blog.js';


const blog = express.Router();
// get All Blog
blog.get('/', async (req, res) => {
    try {
        let blogs = await Blog.find()
        blogs = blogs.reverse()
        res.json(blogs)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})
//get blog with Id
blog.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//add blog
blog.post('/', authenticateJWT, async (req, res) => {
    try {
        const { userId, userName } = req.user
        const { title, body } = req.body;
        const blog = new Blog({ title, body, author: userName, authorId: userId })
        const savedBlog = blog.save()
        res.send(savedBlog)
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

})


// update blog
blog.put('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const { body } = req.body
    const { userId } = req.user
    try {
        const blog = await Blog.findOne({ _id: id })


        if (userId == blog.authorId) {
            const result = await Blog.updateOne({ _id: id }, { title, body })

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'No blog found with the specified _id' });
            }

            res.json({ message: 'Blog updated successfully' });
        }
        else {
            res.status(404).json({ message: 'is not your Blog' });
        }



    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})


// delete blog
blog.delete('/:id', authenticateJWT, async (req, res) => {
    const { userId } = req.user
    try {
        const blog = await Blog.findOne({ _id: req.params.id })
        if (userId == blog.authorId) {
            const result = await Blog.deleteOne({ _id: req.params.id });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'No blog found with the specified _id' });
            }

            res.json({ message: 'Blog deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'is not your Blog' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

//comment Api

// create comment
blog.post('/comment/:blogId', authenticateJWT, async (req, res) => {
    const { blogId } = req.params
    const { comment } = req.body;
    const { userId, userName } = req.user;
    try {
        const result = await Blog.findByIdAndUpdate(
            { _id: blogId },
            { $push: { comments: { comment: comment, author: userName, authorId: userId } } },
            { new: true, useFindAndModify: false }
        );

        res.status(200).json({ message: 'ok' })
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})
// delete comment
blog.delete('/comment/:blogId/:commentId', authenticateJWT, async (req, res) => {
    const { userId } = req.user;
    const { blogId, commentId } = req.params;

    try {
        const blog = await Blog.findOne({ _id: blogId });
        const comment = blog.comments.find(elem => elem._id == commentId)
        if (userId === comment.authorId) {
            const result = await Blog.findOneAndUpdate(
                { _id: blogId },
                { $pull: { comments: { _id: commentId } } },
                { new: true, useFindAndModify: false }
            );

            if (!result) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            res.status(200).json({ message: 'Comment deleted successfully', result });
        } else {
            res.status(403).json({ error: 'Unauthorized: Cannot delete comment' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default blog