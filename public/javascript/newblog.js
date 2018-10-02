var currentImage;
var gradient = false;
var titleStyle = {
    fontSize: 5,
    top: 50,
    left: 50,
    color: "white"
};
var currentStyle = {
    url: currentImage,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSize: 100
};

function copyContent() {
    console.log('running copyContent');
    document.querySelector('.editor__textarea--hidden').value = document.querySelector('.editor__textarea').innerHTML;
    document.querySelector('.blog__hero-img__positionX--hidden').value = currentStyle.backgroundPositionX;
    document.querySelector('.blog__hero-img__positionY--hidden').value = currentStyle.backgroundPositionY;
    document.querySelector('.blog__hero-img__size--hidden').value = currentStyle.backgroundSize;
    document.querySelector('.blog__hero-img__gradient--hidden').value = gradient;
    document.querySelector('.blog__hero-img__fontTop--hidden').value = titleStyle.top;
    document.querySelector('.blog__hero-img__fontLeft--hidden').value = titleStyle.left;
    document.querySelector('.blog__hero-img__fontColor--hidden').value = titleStyle.color;
    document.querySelector('.blog__hero-img__fontSize--hidden').value = titleStyle.fontSize;
    
     if(!document.querySelector('.editor__textarea--hidden').value) {
         console.log('return false');
         return false;
    } else {
        console.log('submitting');
        console.log('\n currentStyles:' + currentStyle.backgroundPositionX + '\n' + currentStyle.backgroundPositionY +'\n text styles: ' + titleStyle.fontSize);
        return true;
    }
}
// var imgBtn = document.querySelector('.editor__button__image-selector');
// imgBtn.addEventListener('click', imageSelector());



function imageSelector(mode) {
    console.log('clicked!');
    
    var images = document.querySelector('.imageVar').getAttribute('data-imageVariable');
    var user = document.querySelector('.userVar').getAttribute('data-userVariable');
    console.log('\n' + images);
    images = images.replace(/\[/g, '').replace(/\]/g, '').replace(/\"/g, '');
    var imageArray = images.split(',');
   

    var imageDiv = document.createElement('div');
   
    imageDiv.classList.add('image--selector');
    imageDiv.style.display = 'grid';
    imageDiv.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';

  

    for(let i = 0; i < imageArray.length; i++) {
        var imageGrid = document.createElement('div');
        imageGrid.setAttribute('style', 'height: 50px', 'width: 50px');

        if(mode === 'new'){
            var imageSelection = '../bionicUser/' + user +'/'+ imageArray[i];
        } else {
            var imageSelection = '../../bionicUser/' + user +'/'+ imageArray[i];
        }
            let img = new Image();
            // let hero = new Image();
            // hero.src = imageSelection;
            // hero.style.maxWidth = '500px';
            img.src = imageSelection;
            img.style.height = '50px';
            img.style.width = '50px';
            var imageInput = document.createElement('input');
            // var fileDisplayArea = document.querySelector('.editor__hero__image--preview');
            imageInput.setAttribute('type', 'radio');
            if(mode ==='edit') {
            imageInput.setAttribute('name', 'blog[pickedImage]');
            } else {
            imageInput.setAttribute('name', 'pickedImage');
            }
            imageInput.setAttribute('value',  imageSelection);
            imageInput.classList.add('image--selection');

            // sets selection as background iamge for div
            imageInput.addEventListener('change', function(e) {
                document.querySelector('.editor__img__upload').value = '';
                var styles = document.getElementById('bpStyles');
                console.log(styles.sheet);
                styles.sheet.insertRule('.blog__hero-img { background-image: url('+this.value+')}', styles.sheet.cssRules.length);
            currentImage = this.value;
            });
            
            // function(e) {
                
                // let heroDiv = document.querySelector('.blog__hero-img');
                // heroDiv.style.backgroundImage = 'url('+this.value+')';
                // heroDiv.style.backgroundSize = 'cover';
                // heroDiv.style.backgroundRepeat = 'no-repeat';



                // clears upload in favor of radio selection
                // let upload = document.querySelector('.editor__img__upload');
                // upload.value = '';

                // if(fileDisplayArea.firstChild) 
                // fileDisplayArea.removeChild(fileDisplayArea.firstChild);

                // fileDisplayArea.appendChild(hero);
                // });
            imageGrid.appendChild(img);
            imageGrid.appendChild(imageInput);
            
            // .innerHTML += '<img src='+imageSelection+' height=50px width=50px><input type="radio" name="pickedImage" value='+imageSelection+' class="image--selection">';
            
        // } else {
            
        //     imageGrid.innerHTML += '<img src='+imageSelection+' height=50px width=50px><input type="radio" name="blog[pickedImage]" value='+imageSelection+' class="image--selection">';
        // }
        imageDiv.appendChild(imageGrid);
    }
    
    // var submitBtn = document.createElement('button').setAttribute('value', 'submit');
    // imageForm.innerHTML += submitBtn;
    // imageDiv.appendChild(imageForm);

    var editorImg = document.querySelector('.editor__img');
    editorImg.insertAdjacentElement('afterend', imageDiv);

    /// toggle image-selector button

    var x = document.querySelector('.editor__button__image-selector');
 
        x.style.display = 'none';
  
}

// preview uploaded image in hero image
window.onload = function() {
var fileInput = document.querySelector('.editor__img__upload');
var fileDisplayArea = document.querySelector('.editor__hero__image--preview');


		fileInput.addEventListener('change', function(e) {
           var radio = document.querySelectorAll('.image--selection');
           for(let i = 0; i < radio.length;i++) { //clears radio selction in favor of upload
               radio[i].checked = false;
           }
			var file = fileInput.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					// fileDisplayArea.innerHTML = "";

					var img = new Image();
                    img.src = reader.result;
                    // img.style.maxWidth = '500px';

                    
                        var styles = document.getElementById('bpStyles');
                        console.log(styles.sheet);
                        styles.sheet.insertRule('.blog__hero-img { background-image: url('+img.src+')}', styles.sheet.cssRules.length);
                    currentImage = img.src;
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




    ////////////////////////// stylesfor background image //////////////
    function tinter() {
            var styles = document.getElementById('bpStyles');
            if(gradient === false) {
                styles.sheet.insertRule('.blog__hero-img { background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+currentImage+')}', styles.sheet.cssRules.length);
                gradient = true;
            } else {
                styles.sheet.insertRule('.blog__hero-img { background-image: url('+currentImage+')}', styles.sheet.cssRules.length);       
                gradient = false;
            }
}

function move(dir) {
    var bgImage = currentImage;
    console.log('move' + dir);
    var styles = document.getElementById('bpStyles');
    switch(dir) {
        case 'up':
        console.log('move' + dir);
            currentStyle.backgroundPositionY -= 10;
            break;
        case 'down':
            currentStyle.backgroundPositionY += 10;
            break;
        case 'left':
            currentStyle.backgroundPositionX -= 10;
            break;
        case 'right':
            currentStyle.backgroundPositionX += 10;
            break;
    }
    console.log(currentStyle.backgroundPositionX + ' and ' + currentStyle.backgroundPositionY);
    styles.sheet.insertRule('.blog__hero-img { background-position: '+currentStyle.backgroundPositionX+'px '+currentStyle.backgroundPositionY+'px}', styles.sheet.cssRules.length);
}

function size(dir) {
    var styles = document.getElementById('bpStyles');
    switch(dir) {
        case 'up':
            currentStyle.backgroundSize += 1;
            break;
        case 'down':
            currentStyle.backgroundSize -= 1;
            break;
        }
        styles.sheet.insertRule('.blog__hero-img { background-size: '+currentStyle.backgroundSize+'%}', styles.sheet.cssRules.length);

    }
    //////////////// hero image styling /////////////////////

    function heroEditor () {
        turnRight = document.querySelector('.turnRight');
        turnRight.addEventListener('onclick', function() {

        });
        turnLeft = document.querySelector('.turnLeft');

    }

    // function rotate(dir) {
    //     var heroDiv = document.querySelector('.blog__hero-img');
    //     heroDiv.classList.add('rotate45');
    // }

    //////////////////title manipulation///////////////

    function moveT(dir) {
        var title = document.querySelector('.blog__hero-text');
        var styles = document.getElementById('bpStyles');

        switch(dir) {
            case 'up':
                titleStyle.top--;
                break;
            case 'left':
                titleStyle.left--;
                break;
            case 'down':
                titleStyle.top++;
                break;
            case 'right':
                titleStyle.left++;
                break;
        }
        styles.sheet.insertRule('.blog__hero-text { top: '+titleStyle.top+'%}', styles.sheet.cssRules.length);
        styles.sheet.insertRule('.blog__hero-text { left: '+titleStyle.left+'%}', styles.sheet.cssRules.length);
    }

    function fontManip(effect) {
        var styles = document.getElementById('bpStyles');
        switch(effect) {
            case 'up':
                titleStyle.fontSize++;
                break;
            case 'down':
                titleStyle.fontSize--;
                break;
            }
            styles.sheet.insertRule('.blog__hero-text { font-size: '+titleStyle.fontSize+'em}', styles.sheet.cssRules.length);
    }

    var colorPicker = document.querySelector('.font__color');
    colorPicker.addEventListener('input', function(e) {
        styles = document.getElementById('bpStyles');
        titleStyle.color = this.value;
        styles.sheet.insertRule('.blog__hero-text { color: '+titleStyle.color+'}', styles.sheet.cssRules.length);
    });

    // preview title
var title = document.querySelector('.title');
title.addEventListener('keyup', function(e) {
    document.querySelector('.blog__hero-text').innerHTML = this.value;
});

////////////////////////text editor

function edit(command) {
    textarea = document.querySelector('.editor__textarea');
    switch(command) {
        case('bold'):
        document.execCommand('bold', false, null);
        break;

        case('italic'):
        document.execCommand('italic', false, null);
        break;

        case('undo'):
        document.execCommand('undo', false, null);
        break;

        case('justifyLeft'):
        document.execCommand('justifyLeft', false, null);
        break;

        case('justifyRight'):
        document.execCommand('justifyRight', false, null);
        break;

        case('justifyCenter'):
        document.execCommand('justifyCenter', false, null);
        break;

        case('superscript'):
        document.execCommand('superscript', false, null);
        break;

        case('insertImage'):
        document.execCommand('insertImage', false, null);
        break;

        case('underline'):
        document.execCommand('underline', false, null);
        break;

        case('strikeThrough'):
        document.execCommand('strikeThrough', false, null);
        break;

        case('redo'):
        document.execCommand('redo', false, null);
        break;

        case('indent'):
        document.execCommand('indent', false, null);
        break;

        case('insertUnorderedList'):
        document.execCommand('insertUnorderedList', false, null);
        break;

        case('insertOrderedList'):
        document.execCommand('insertOrderedList', false, null);
        break;
       
    }
        textarea.focus();
    }
