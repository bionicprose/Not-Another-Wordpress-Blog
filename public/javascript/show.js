
/* this function adds a comment/reply input on the blog post */

function reply(comment, blog) {
    if(document.getElementById('reply__form')) {
        var origReply = document.getElementById('reply__form');
        origReply.remove();
        return;
    }
    console.log('reply clicked: ' +comment);
    var reply = document.createElement('div');
    reply.innerText = 'Add your comments:';
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
    textArea.setAttribute('cols', '100');
    textArea.setAttribute('type', 'text');
    var submit = document.createElement('button');
    submit.classList.add('comments__btn');
    submit.innerHTML = 'submit';
   
    form.appendChild(textArea);
    form.appendChild(submit);
    reply.appendChild(form);
    reply.id = 'reply__form';
    if(comment !== null) {
        document.querySelector('div#comment'+comment+' div.comments__entry__body').insertAdjacentElement('beforeend', reply);
    } else {
        var button = document.querySelector('.comments__btn--add');
        button.insertAdjacentElement('afterend', reply);
        button.style.display = 'none';
    }

}
