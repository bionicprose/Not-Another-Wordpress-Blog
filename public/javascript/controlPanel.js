// controlPannel.js

///Edit user tables
function edit(user) {
    var entries = document.querySelectorAll('.user'+user);
    for(let i = 0; i < entries.length; i++) {
        entries[i].setAttribute('contenteditable', 'true');
        entries[i].style.backgroundColor = '#e5c100';
    }
}


// take content from edited tables and put it in a hidden form onsubmit
function updateUser(userId) {
    document.getElementById('lUsername--hidden' + userId).value = document.getElementById('lUsername' + userId).innerText.replace('<br>', '');
    document.getElementById('lEmail--hidden' + userId).value = document.getElementById('lEmail' + userId).innerText.replace('<br>', '');
    document.getElementById('lName--hidden' + userId).value = document.getElementById('lName' + userId).innerText.replace('<br>', '');
    document.getElementById('lPic--hidden' + userId).value = document.getElementById('lPic' + userId).innerText.replace('<br>', '');
    document.getElementById('role--hidden' + userId).value = document.getElementById('role' + userId).innerText.replace('<br>', '');
    return true;
}

/* var submit = document.querySelectorAll('.submit');
for(var i = 0; i< submit.length; i++) {
    submit[i].addEventListener('click', function() {
        var userId = this.getAttribute('data-userId');
    document.getElementById('lUsername--hidden' + userId).value = document.getElementById('lUsername' + userId).innerText.replace('<br>', '');
    document.getElementById('lEmail--hidden' + userId).value = document.getElementById('lEmail' + userId).innerHTML.replace('<br>', '');
    document.getElementById('lName--hidden' + userId).value = document.getElementById('lName' + userId).innerHTML.replace('<br>', '');
    document.getElementById('lPic--hidden' + userId).value = document.getElementById('lPic' + userId).innerHTML.replace('<br>', '');
    document.getElementById('fId--hidden' + userId).value = document.getElementById('fId' + userId).innerHTML.replace('<br>', '');
    document.getElementById('fEmail--hidden' + userId).value = document.getElementById('fEmail' + userId).innerHTML.replace('<br>', '');
    document.getElementById('fName--hidden' + userId).value = document.getElementById('fName' + userId).innerHTML.replace('<br>', '');
    document.getElementById('fPic--hidden' + userId).value = document.getElementById('fPic' + userId).innerHTML.replace('<br>', '');
    document.getElementById('gId--hidden' + userId).value = document.getElementById('gId' + userId).innerHTML.replace('<br>', '');
    document.getElementById('gEmail--hidden' + userId).value = document.getElementById('gEmail' + userId).innerHTML.replace('<br>', '');
    document.getElementById('gName--hidden' + userId).value = document.getElementById('gName' + userId).innerHTML.replace('<br>', '');
    document.getElementById('gPic--hidden' + userId).value = document.getElementById('gPic' + userId).innerHTML.replace('<br>', '');
    document.getElementById('role--hidden' + userId).value = document.getElementById('role' + userId).innerHTML.replace('<br>', '');
    // if(!document.querySelector('.editor__textarea--hidden').value) {
    //      return false;
    // } else {
        return true;
    });
};

*/
// hide/show tables
/* show user linked accounts, posts, or comments based on what was clicked */

function show(thing) {
    console.log(thing);
    switch(thing) {
        case('id'):
            document.querySelector('.accounts').classList.toggle('hidden');
            break;
        case('posts'):
            document.querySelector('.blog-posts').classList.toggle('hidden');
            break;
        case('comments'):
            document.querySelector('.comments').classList.toggle('hidden');
            break;
        case('users'):
            document.querySelector('.users').classList.toggle('hidden');
            break;
        case('pic'):
            document.querySelector('.profile-pic__form').classList.toggle('hidden');
            document.querySelector('.profile__btn').classList.toggle('hidden');
            break;
        case('upload'):
            document.querySelector('.profile-pic__btn--upload').classList.remove('hidden');
            break;
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

/* this function allows users to pick their profile picture. It will overwrite
    whatever the current profile pic is */

    function picPicker() {
        var form = document.createElement('form');
    }

/* Previews the selected profile picture for upload */

    window.onload = function() {
        var fileInput = document.querySelector('.pic__input');
        var fileDisplayArea = document.querySelector('.profile-pic__img');
        var filename = document.querySelector('.profile-pic__filename');
        
        
                fileInput.addEventListener('change', function(e) {
                   
                    var file = fileInput.files[0];
                    var imageType = /image.*/;
        
                    if (file.type.match(imageType)) {
                        var reader = new FileReader();
        
                        reader.onload = function(e) {
                            // fileDisplayArea.innerHTML = "";
        
                            var img = new Image();
                            img.src = reader.result;
                            // img.style.maxWidth = '500px';
        
                            fileDisplayArea.setAttribute('src', img.src);
                            filename.innerText = 'file name: ' +file.name +'. file.size: ' + file.size+' bytes.';
                            
                            //     var styles = document.getElementById('bpStyles');
                            //     console.log(styles.sheet);
                            //     styles.sheet.insertRule('.blog__hero-img { background-image: url('+img.src+')}', styles.sheet.cssRules.length);
                            // currentImage = img.src;
                            // let heroDiv = document.querySelector('.blog__hero-img');
                            // heroDiv.style.backgroundImage = 'url('+img.src+')';
                            // heroDiv.style.backgroundSize = 'cover';
                            // heroDiv.style.backgroundRepeat = 'no-repeat';
        
                            // fileDisplayArea.appendChild(img);
                        }
        
                        reader.readAsDataURL(file);	
                    } else {
                        fileDisplayArea.innerHTML = "File not supported!"
                    }
                });
        
        
            }