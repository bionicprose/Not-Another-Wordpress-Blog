var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: String,
        pic: String
    },
    editable: {type: Boolean, default: true},
    content: {type: String, required: true},
    postDate: {type: Date},
    editDate: [{type: Date}],
    blogPost: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        },
        title: String
    },
    originalPost : {
        id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commet'
    },
    author: String
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

var autoPopulateReplies = function(next) {
    this.populate('replies');
    next();
}

commentSchema.
    pre('findOne', autoPopulateReplies).
    pre('find', autoPopulateReplies);

module.exports = mongoose.model('Comment', commentSchema);