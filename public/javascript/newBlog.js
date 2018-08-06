var bold        = document.querySelector('.newBlog__button--bold'),
    italic      = document.querySelector('.newBlog__button--italic'),
    list        = document.querySelector('.newBlog__button--list'),
    numList     = document.querySelector('.newBlog__button--numList'),
    quote       = document.querySelector('.newBlog__button--quote'),
    lJustify    = document.querySelector('.newBlog__button--lJustify'),
    rJustify    = document.querySelector('.newBlog__button--rJustify'),
    cJustify    = document.querySelector('.newBlog__button--cJustify'),
    link        = document.querySelector('.newBlog__button--link'),
    image       = document.querySelector('.newBlog__button--image'),
    preview     = document.querySelector('.newBlog__button--preview');

// lists and justifies need to be changed. 
// image and link should pop up a window for url input if there's
// no current selection

bold.addEventListener('click', insertTag); 
bold.myParam1 = '<strong>';
bold.myParam2 = '</strong>'; 

italic.addEventListener('click', insertTag);
italic.myParam1 = '<i>';
italic.myParam2 = '</i>';

list.addEventListener('click', insertTag);
list.myParam1 = '<ul><li>';
list.myParam2 = '</li></ul>';

numList.addEventListener('click', insertTag);
numList.myParam1 = '<ol><li>';
numList.myParam2 = '</li></ol>';

quote.addEventListener('click', insertTag);
quote.myParam1 = '<blockquote>';
quote.myParam2 = '</blockquote>';

lJustify.addEventListener('click', insertTag);
lJustify.myParam1 = '[lJustify]';
lJustify.myParam2 = '[/lJustify]';

rJustify.addEventListener('click', insertTag);
rJustify.myParam1 = '[rJustify]';
rJustify.myParam2 = '[/rJustify]';

cJustify.addEventListener('click', insertTag);
cJustify.myParam1 = '[cJustify]';
cJustify.myParam2 = '[/cJustify]';

image.addEventListener('click', insertTag);
image.myParam3 = 'iURL';

link.addEventListener('click', insertTag);
link.myParam3 = 'lURL';

preview.addEventListener('click', previewCont);

    
function insertTag() {
   
       
    var content     = document.querySelector('.newBlog__form--content');
    var startPos    = content.selectionStart;
    var endPos      = content.selectionEnd;
    var oldContent  = content.value;
   // check for link or image tags then get them from user
    if (this.myParam3 === 'lURL') {
        var url = prompt('Enter the webpage URL');
        this.myParam1 = '<a href=\'' + url + '\'>';
        this.myParam2 = '</a>';
    } else if (this.myParam3 === 'iURL') {
        var url = prompt('Enter the image URL:');
        this.myParam1 = '<img src=\'' + url + '\'>';
    }

    var sTag = this.myParam1;
    var eTag = this.myParam2;
    !eTag ? args = false : args = true;
// inserts tag either around selection or at cursor if no selection
    content.value = oldContent.substring(0, startPos) + (args ? sTag +
                    oldContent.substring(startPos, endPos) + eTag : sTag) + 
                    oldContent.substring(endPos);

// updates cursor position after insertion
    content.setSelectionRange(args || startPos === endPos ? startPos +
        sTag.length : startPos, (args ? endPos : startPos) + sTag.length);
    content.focus();
    
}

// function to convert form tags into html tags

function previewCont() {


    // var title = document.querySelector('.newBlog__form--title');
    var text = document.querySelector('.newBlog__form--content');
    
    // change it into a string, then iterate the string, replacing tags with html tags
    



    var newText = text.value;
    newText = newText.replace('[bold]', 'bold')
                     .replace('[/bold]', '</bold>')
                     .replace('[italic]', '<i>')
                     .replace('[/italic]', '</i>')
                     .replace('[quote]', '<blockquote>')
                     .replace('[/quote]', '</blockquote>')
                     .replace('[link', '<a')
                     .replace('[/link]', '</a>')
                     .replace('[img src', '<img src');
                     

console.log(newText);
    // var newText = text.value.split(' ');

    // var newArray = [];
    // console.log(newText);
    // var newVar;

    // for(var i = 0; i < newText.length; i++) {
        
    //     switch(newText[i]) {
    //         case '[bold]':
    //             newVar = '<bold>';
    //             break;
    //         case '[/bold]':
    //             newVar = '</bold>';
    //             break;
    //         case '[italic]':
    //             newVar = '<em>';
    //             break;
    //         case '[/italic]':
    //             newVar = '</em>';
    //             break;
    //         case '[quote]':
    //             newVar = '<quote>';
    //             break;
    //         default:
    //             newVar = newText[i];
    //     }
    //     newArray.push(newVar);
    //     console.log(newVar + '\n');
    // };
    
    // console.log(newArray);
    }
