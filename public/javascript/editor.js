function copyContent() {
    console.log('running copyContent');
    document.querySelector('.editor__textarea--hidden').value = document.querySelector('.editor__textarea').innerHTML;
     if(!document.querySelector('.editor__textarea--hidden').value) {
         return false;
    } else {
        console.log('submitting');
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
            imageGrid.innerHTML += '<img src='+imageSelection+' height=50px width=50px><input type="radio" name="pickedImage" value='+imageSelection+' class="image--selection">';
        
        } else {
            var imageSelection = '../../bionicUser/' + user +'/'+ imageArray[i];
            imageGrid.innerHTML += '<img src='+imageSelection+' height=50px width=50px><input type="radio" name="blog[pickedImage]" value='+imageSelection+' class="image--selection">';
        }
        
        
        
        
        imageDiv.appendChild(imageGrid);
    }
    
    // var submitBtn = document.createElement('button').setAttribute('value', 'submit');
    // imageForm.innerHTML += submitBtn;
    // imageDiv.appendChild(imageForm);

    var textArea = document.querySelector('.editor__textarea');
    textArea.insertAdjacentElement('beforebegin', imageDiv);

    /// toggle image-selector button

    var x = document.querySelector('.editor__button__image-selector');
 
        x.style.display = 'none';
  
}


