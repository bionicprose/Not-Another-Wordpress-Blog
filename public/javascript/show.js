// var image = document.querySelector('.imageVar').getAttribute('data-imageVariable');
// console.log(image);
// var heroDiv = document.querySelector('.blog__hero-img');

// heroDiv.setAttribute('data-backgroundImage', image)

// heroDiv.style.backgroundImage = 'url('+image+')';
// heroDiv.style.backgroundPosition = 'center';
// heroDiv.style.backgroundSize = 'cover';
// heroDiv.style.backgroundRepeat = 'no-repeat';


var heroSettings = document.querySelector('.heroSettings');
var heroDiv = document.querySelector('.blog__hero-img');
var heroTitle = document.querySelector('.blog__hero-text');
var styles = document.getElementById('bpStyles');
var titleSettings = document.querySelector('.titleSettings');
console.log(heroSettings);

if (heroSettings.dataset.gradient == 'true') {
    styles.sheet.insertRule('.blog__hero-img { background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + heroSettings.dataset.image + ')}', styles.sheet.cssRules.length);
    console.log('should have gradient');
} else {
    console.log('should not have gradient');
    styles.sheet.insertRule('.blog__hero-img { background-image: url(' + heroSettings.dataset.image + ')}', styles.sheet.cssRules.length);

}
console.log(titleSettings.dataset.fontcolor);
styles.sheet.insertRule('.blog__hero-text { color: ' + titleSettings.dataset.fontcolor + '}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { font-size: ' + titleSettings.dataset.fontsize + 'em}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { top: ' + titleSettings.dataset.fonttop + '%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { left: ' + titleSettings.dataset.fontleft + '%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-img { background-size: ' + heroSettings.dataset.size + '%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-img { background-position: ' + heroSettings.dataset.positionx + 'px ' + heroSettings.dataset.positiony + 'px}', styles.sheet.cssRules.length);

function getComments(comment, blog) {
    console.log('comments running');
    comment.forEach(function () {
        printComment(this, blog);

    });
    return;
}

function login() {
    console.log('login clicked');
    var login = document.querySelector('.login');
    login.style.display = 'block';
}

function reply(comment, blog) {
    console.log('reply clicked: ' +comment);
    var reply = document.createElement('div');
    reply.classList.add('comment__reply');
    var form = document.createElement('form');
    form.setAttribute('method', 'POST');
    if(comment !== null) {
        form.setAttribute('action', '/blog/' + blog + '/comments/' + comment);
    } else {
        form.setAttribute('action', '/blog/' + blog + '/comments/');
    }
    var textArea = document.createElement('textarea');
    textArea.classList.add('comment__reply__textArea');
    textArea.setAttribute('name', 'content');
    textArea.setAttribute('rows', '10');
    textArea.setAttribute('cols', '50');
    var submit = document.createElement('button');
    submit.innerHTML = 'submit';
    form.appendChild(textArea);
    form.appendChild(submit);
    reply.appendChild(form);
    if(comment !== null) {
        document.getElementById(comment).insertAdjacentElement('afterend', reply);
    } else {
        var button = document.querySelector('.blog__comment__btn--add');
        button.insertAdjacentElement('afterend', reply);
        button.style.display = 'none';
    }

}
// function printComment(comments, blog) {
//     console.log(typeof comments);
//     comments.forEach(function(comment) {
//         var commentDiv = document.createElement('div');
//         commentDiv.classList.add('reply__entry');

//         if(comment.replyTo) {
//             var originalComment = document.createElement('div');
//             originalComment.innerHTML = 'Reply to ' + comment.author.username;
//             originalComment.classList.add('reply__original');
//             commentDiv.appendChild(originalComment);
//         }

//         var authorDiv = document.createElement('div');
//         authorDiv.innerHTML = comment.author.username;
//         authorDiv.classList.add('reply__author');
//         commentDiv.appendChild(authorDiv);

//         var postDiv = document.createElement('div');
//         postDiv.innerHTML = comment.postDate;
//         postDiv.classList.add('reply__post-date');
//         commentDiv.appendChild(postDiv);

//         if(comment.editDate) {
//             var editDiv = document.createElement('div');
//             editDiv.innerHTML = comment.editDate;
//             editDiv.classList.add('reply__edit-date');
//             commentDiv.appendChild(editDiv);
//         }

//         var contentDiv = document.createElement('div');
//         contentDiv.innerHTML = comment.content; 
//         contentDiv.classList.add('reply__content');
//         commentDiv.appendChild(contentDiv);

//         var editLink = document.createElement('a');
//         editLink.setAttribute('href', '/blog/'+blog+'/comments/'+comment._id+'/edit')
//         var editButton = document.createElement('button');
//         editButton.classList.add('comments__btn--edit');
//         editButton.innerHTMl = 'Edit';
//         editLink.appendChild(editButton);

//         var replyLink = document.createElement('a');
//         replyLink.setAttribute('href', '/blog/'+blog+'/comments/'+comment._id+'/reply');
//         var replyButton = document.createElement('button');
//         replyButton.classList.add('comments__btn--reply');
//         replyButton.innerHTML = 'Reply';
//         replyLink.appendChild(replyButton);

//         var deleteForm = document.createElement('button');
//         deleteForm.setAttribute('method', 'POST' );
//         deleteForm.setAttribute('action', '/blog/'+blog+'/comments/'+comment._id+'?_method=DELETE')
//         var deleteButton = document.createElement('button');
//         deleteButton.classList.add('comments__btn--delete');
//         deleteButton.innerHTML = 'Delete';
//         deleteForm.appendChild(deleteButton);



//         document.querySelector('.blog__comments').insertAdjacentElement('afterend', commentDiv);

//         if(comment.replies) {
//             printComment(comment.replies, blog);
//         }
//         return;
//         })


// }


// function printReplies(comment) {
//     comment.replies.forEach(function() {

//         var commentDiv = document.createElement('div');
//         commentDiv.classListAdd('reply__entry');

//         var originalComment = document.createElement('div');
//         originalComment.innerHTML = 'Reply to ' + comment.author.username;
//         originalComment.classListAdd('reply__original');
//         commentDiv.appendChild(originalComment);

//         var authorDiv = document.createElement('div');
//         authorDiv.innerHTML = this.author.username;
//         authorDiv.classListAdd('reply__author');
//         commentDiv.appendChild(authorDiv);

//         var postDiv = document.createElement('div');
//         postDiv.innerHTML = this.postDate;
//         postDiv.classListAdd('reply__post-date');
//         commentDiv.appendChild(postDiv);

//         if(this.editDate) {
//             var editDiv = document.createElement('div');
//             editDiv.innerHTML = this.editDate;
//             editDiv.classListAdd('reply__edit-date');
//             commentDiv.appendChild(editDiv);
//         }

//         var contentDiv = document.createElement('div');
//         contentDiv.innerHTML = this.content; 
//         contentDiv.classListAdd('reply__content');
//         commentDiv.appendChild(contentDiv);

//         document.querySelector('.comments').insertAdjacentElement('afterend', commentDiv);
//         if(this.replies) {
//             printReplies(this);
//         }

//     });
//     return;

// }