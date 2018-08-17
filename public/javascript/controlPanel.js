// controlPannel.js

///Edit user tables

var edit = document.querySelectorAll('.edit');
for(var i = 0; i< edit.length; i++) {
    edit[i].addEventListener('click', function() {
        var userId = 'user' + this.getAttribute('data-userId');
        var table = document.getElementById(userId);
        table.setAttribute('contenteditable', 'true');
        table.style.display = 'inline-block';
        table.execCommand('insertHTML', false, '');
    });
};

// take content from edited tables and put it in a hidden form onsubmit

var submit = document.querySelectorAll('.submit');
for(var i = 0; i< submit.length; i++) {
    submit[i].addEventListener('click', function() {
        var userId = this.getAttribute('data-userId');
    document.getElementById('lUsername--hidden' + userId).value = document.getElementById('lUsername' + userId).innerHTML;
    document.getElementById('lEmail--hidden' + userId).value = document.getElementById('lEmail' + userId).innerHTML;
    document.getElementById('lName--hidden' + userId).value = document.getElementById('lName' + userId).innerHTML;
    document.getElementById('lPic--hidden' + userId).value = document.getElementById('lPic' + userId).innerHTML;
    document.getElementById('fId--hidden' + userId).value = document.getElementById('fId' + userId).innerHTML;
    document.getElementById('fEmail--hidden' + userId).value = document.getElementById('fEmail' + userId).innerHTML;
    document.getElementById('fName--hidden' + userId).value = document.getElementById('fName' + userId).innerHTML;
    document.getElementById('fPic--hidden' + userId).value = document.getElementById('fPic' + userId).innerHTML;
    document.getElementById('gId--hidden' + userId).value = document.getElementById('gId' + userId).innerHTML;
    document.getElementById('gEmail--hidden' + userId).value = document.getElementById('gEmail' + userId).innerHTML;
    document.getElementById('gName--hidden' + userId).value = document.getElementById('gName' + userId).innerHTML;
    document.getElementById('gPic--hidden' + userId).value = document.getElementById('gPic' + userId).innerHTML;
    document.getElementById('role--hidden' + userId).value = document.getElementById('role' + userId).innerHTML;
    // if(!document.querySelector('.editor__textarea--hidden').value) {
    //      return false;
    // } else {
        return true;
    });
};


// hide/show tables


function showPosts() {
    var x = document.querySelector('.blog__table');
    if(x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }
    
}

function showComments() {
    var x = document.querySelector('.comment__table ');
    if(x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }
    
}


function showUsers() {
    var x = document.querySelector('.users');
    if(x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }
    
}

// change icons based on hide/show state of tables
var icon = document.querySelectorAll('.icon');

for(var i = 0; i < icon.length; i++) {

    icon[i].addEventListener('click', function() {
        console.log('hello' + this.classList);
      this.classList.toggle('fa-plus');
      this.classList.toggle('fa-minus');
});
};