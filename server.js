import express from 'express';
import mongoose from 'mongoose';
import sign from './Router/Sign.js';
import user from './Router/user.js';
import blog from './Router/blog.js'

const app = express();
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});



app.use('/sign', sign)
app.use('/user', user)
app.use('/blog', blog)

app.listen(5000, () => 'server Listened 5000')