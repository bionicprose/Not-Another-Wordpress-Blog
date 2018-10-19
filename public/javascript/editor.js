var heroSettings = document.querySelector('.heroSettings');
var currentImage = heroSettings.dataset.image;
var gradient = heroSettings.dataset.gradient;


var heroSettings = document.querySelector('.heroSettings');
var heroDiv = document.querySelector('.blog__header__image');
var heroTitle = document.querySelector('.blog__title');
var styles = document.getElementById('bpStyles');
var titleSettings = document.querySelector('.titleSettings');
 console.log(heroSettings);

 if(heroSettings !== null) {
 if (heroSettings.dataset.gradient == 'true') {
     styles.sheet.insertRule('.blog__header__image { background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + heroSettings.dataset.image + ')}', styles.sheet.cssRules.length);
     console.log('should have gradient');
 } else {
     console.log('should not have gradient');
     styles.sheet.insertRule('.blog__header__image { background-image: url(' + heroSettings.dataset.image + ')}', styles.sheet.cssRules.length);

 }
console.log(titleSettings.dataset.fontcolor);
styles.sheet.insertRule('.blog__title { color: ' + titleSettings.dataset.fontcolor + '}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__title { font-size: ' + titleSettings.dataset.fontsize + 'em}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__title { top: ' + titleSettings.dataset.fonttop + '%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__title { left: ' + titleSettings.dataset.fontleft + '%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__header__image { background-size: ' + heroSettings.dataset.size + '%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__header__image { background-position: ' + heroSettings.dataset.positionx + 'px ' + heroSettings.dataset.positiony + 'px}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__header__image {border: 1px solid grey; }',  styles.sheet.cssRules.length);
}

var titleSettings = document.querySelector('.titleSettings');
var titleStyle = {
    fontSize: Number(titleSettings.dataset.fontsize),
    top: Number(titleSettings.dataset.fonttop),
    left: Number(titleSettings.dataset.fontleft),
    color: titleSettings.dataset.fontcolor
};

if(heroSettings.dataset.positionx) {
    console.log('not equal to nan');
var currentStyle = {
    url: currentImage,
    backgroundPositionX: Number(heroSettings.dataset.positionx),
    backgroundPositionY: Number(heroSettings.dataset.positiony),
    backgroundSize: Number(heroSettings.dataset.size),
    gradient: heroSettings.dataset.gradient
};
} else {
    console.log('equal to nan');
    var currentStyle = {
        
        url: currentImage,
        backgroundPositionX: Number(0),
        backgroundPositionY: Number(0),
        backgroundSize: Number(98),
        gradient: false
    };
}

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
    document.querySelector('.blog__hero-img__currentImage--hidden').value = currentImage;
    
     if(!document.querySelector('.editor__textarea--hidden').value) {
         return false;
    } else {
        console.log('submitting this hero image: ' +currentImage);
        return true;
    }
}


function imageSelector() {
    console.log('clicked!');
    if(document.querySelector('.editor__image-selector')) {
        return;
    }
    var images = document.querySelector('.imageVar').getAttribute('data-imageVariable');
    var user = document.querySelector('.userVar').getAttribute('data-userVariable');
    console.log('\n' + images);
    images = images.replace(/\[/g, '').replace(/\]/g, '').replace(/\"/g, '');
    var imageArray = images.split(',');
   

    var imageDiv = document.createElement('div');
   
    imageDiv.classList.add('editor__image-selector');
    imageDiv.style.display = 'grid';
    imageDiv.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';

    for(let i = 0; i < imageArray.length; i++) {
        var imageGrid = document.createElement('div');
        imageGrid.classList.add('editor__image--thumbnail')

        
            var imageSelection = '../../bionicUser/' + user +'/'+ imageArray[i];
        
            let img = new Image();
            // let hero = new Image();
            // hero.src = imageSelection;
            // hero.style.maxWidth = '500px';
            img.src = imageSelection;
            img.style.height = '90px';
            img.style.width = '90px';
            var imageInput = document.createElement('input');
            // var fileDisplayArea = document.querySelector('.editor__hero__image--preview');
            imageInput.setAttribute('type', 'radio');
           
            imageInput.setAttribute('name', 'pickedImage');
            imageInput.setAttribute('value',  imageSelection);
            imageInput.classList.add('editor__image__input--radio');
            

            // sets selection as background iamge for div
            imageInput.addEventListener('change', function(e) {
                document.querySelector('.editor__image__input--upload').value = '';
                var styles = document.getElementById('bpStyles');
                // console.log(styles.sheet);
                styles.sheet.insertRule('.blog__header__image { background-image: url('+this.value+')}', styles.sheet.cssRules.length);
            currentImage = this.value;
     
            });
            
            imageGrid.appendChild(img);
            imageGrid.appendChild(imageInput);
            
        imageDiv.appendChild(imageGrid);
    }
    

    var editorImg = document.querySelector('.editor__image-selection-controls');
    editorImg.insertAdjacentElement('afterend', imageDiv);


  
}

// preview uploaded image in hero image
window.onload = function() {
var fileInput = document.querySelector('.editor__image__input--upload');
var fileDisplayArea = document.querySelector('.blog__header__image');


		fileInput.addEventListener('change', function(e) {
           var radio = document.querySelectorAll('.editor__image__input--radio');
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
                        // console.log(styles.sheet);
                        styles.sheet.insertRule('.blog__header__image { background-image: url('+img.src+')}', styles.sheet.cssRules.length);
                    currentImage = img.src;
               
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
                styles.sheet.insertRule('.blog__header__image { background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+currentImage+')}', styles.sheet.cssRules.length);
                gradient = true;
            } else {
                styles.sheet.insertRule('.blog__header__image { background-image: url('+currentImage+')}', styles.sheet.cssRules.length);       
                gradient = false;
            }
}
////// change image position
function move(dir) {
    var bgImage = currentImage;
    console.log('move' + dir);
    var styles = document.getElementById('bpStyles');
    switch(dir) {
        case 'up':
        console.log('move' + dir);
            currentStyle.backgroundPositionY  -= 10;
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
    styles.sheet.insertRule('.blog__header__image { background-position: '+currentStyle.backgroundPositionX+'px '+currentStyle.backgroundPositionY+'px}', styles.sheet.cssRules.length);
}
/// change image size
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
        styles.sheet.insertRule('.blog__header__image { background-size: '+currentStyle.backgroundSize+'%}', styles.sheet.cssRules.length);

    }
  

    //////////////////title manipulation///////////////

    //// change title position relative to the image
    function moveT(dir) {
        var title = document.querySelector('.blog__title');
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
        console.log('this is the titleStyle settings for top and left: ' + titleStyle.top + titleStyle.left)
        console.log('\n and this is the orignal setting of one: ' + titleSettings.dataset.fonttop);
        styles.sheet.insertRule('.blog__title { top: '+titleStyle.top+'%}', styles.sheet.cssRules.length);
        styles.sheet.insertRule('.blog__title { left: '+titleStyle.left+'%}', styles.sheet.cssRules.length);
    }
    //////// change title font size
    function fontManip(effect) {
        var styles = document.getElementById('bpStyles');
        switch(effect) {
            case 'up':
            console.log('text up');
                titleStyle.fontSize++;
                break;
            case 'down':
                titleStyle.fontSize--;
                break;
            }
            styles.sheet.insertRule('.blog__title { font-size: '+titleStyle.fontSize+'em}', styles.sheet.cssRules.length);
    }
    ////// change font color
    var colorPicker = document.querySelector('.font__color');
    colorPicker.addEventListener('input', function(e) {
        styles = document.getElementById('bpStyles');
        titleStyle.color = this.value;
        styles.sheet.insertRule('.blog__title { color: '+titleStyle.color+'}', styles.sheet.cssRules.length);
    });
// preview title
var title = document.querySelector('.input__title');
title.addEventListener('keyup', function(e) {
    document.querySelector('.blog__title').innerHTML = this.value;
});

    /// text editor button functions

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
    