var blog = document.querySelector('.blog');
var comment = document.querySelector('.comment');
var reply = document.querySelector('.content');

if(!comment) {
    console.log('is comment defined? ' +comment);
    var address = 'http://localhost:3000/blog/'+blog.dataset.title+'/comments/';
} else {
    var address ='http://localhost:3000/blog/'+blog.dataset.title+'/comments/'+comment.dataset.id+'';
}
fetch(address, {
    method: 'POST',
    body: 'content='+reply.dataset.content+'',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
}).then(function() {
    redirect: window.location.replace('http://localhost:3000/blog/'+blog.dataset.title+'');
});