var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: String
    },
    content: {type: String, required: true},
    postDate: {type: Date},
    editDate: [{type: Date}],
    blogPost: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        },
        title: 'String'
    }
});

module.exports = mongoose.model('Comment', commentSchema);