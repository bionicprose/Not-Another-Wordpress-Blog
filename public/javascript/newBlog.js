var bold        = document.querySelector('.newBlog__button--bold'),
    italic      = document.querySelector('.newBlog__button--italic'),
    list        = document.querySelector('.newBlog__button--list'),
    numList     = document.querySelector('.newBlog__button--numList'),
    quote       = document.querySelector('.newBlog__button--quote'),
    lJustify    = document.querySelector('.newBlog__button--lJustify'),
    rJustify    = document.querySelector('.newBlog__button--rJustify'),
    cJustify    = document.querySelector('.newBlog__button--cJustify'),
    link        = document.querySelector('.newBlog__button--link'),
    image       = document.querySelector('.newBlog__button--image');

// lists and justifies need to be changed. 
// image and link should pop up a window for url input if there's
// no current selection

bold.addEventListener('click', insertTag); 
bold.myParam1 = '[bold]';
bold.myParam2 = '[/bold]'; 

italic.addEventListener('click', insertTag);
italic.myParam1 = '[italic]';
italic.myParam2 = '[/italic]';

list.addEventListener('click', insertTag);
list.myParam1 = '[list]';
list.myParam2 = '[/list]';

numList.addEventListener('click', insertTag);
numList.myParam1 = '[numlist]';
numList.myParam2 = '[/numList]';

quote.addEventListener('click', insertTag);
quote.myParam1 = '[quote]';
quote.myParam2 = '[/quote]';

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
image.myParam1 = '[img]';
// image.myParam2 = '[/img]';

link.addEventListener('click', insertTag);
link.myParam1 = '[link]';
link.myParam2 = '[/link]';


    
function insertTag() {
    var sTag = this.myParam1;
    var eTag = this.myParam2;
    !eTag ? args = false : args = true;
       
    var content     = document.querySelector('.newBlog__form--content');
    var startPos    = content.selectionStart;
    var endPos      = content.selectionEnd;
    var oldContent  = content.value;
   // check for link or image tags then get them from user
    if (this.myParam1 === '[link]') {
        var url = prompt('Enter the webpage URL');
        this.myParam1 = '[link href=\''+url+'\']';
        this.myParam2 = '[/link]';
    } else if (this.myParam1 === '[img]') {
        var url = prompt('Enter the image URL:');
        this.myParam1 = '[img href=\''+url+'\']';
    }
// inserts tag either around selection or at cursor if no selection
    content.value = oldContent.substring(0, startPos) + (args ? sTag +
                    oldContent.substring(startPos, endPos) + eTag : sTag) + 
                    oldContent.substring(endPos);

// updates cursor position after insertion
    content.setSelectionRange(args || startPos === endPos ? startPos +
        sTag.length : startPos, (args ? endPos : startPos) + sTag.length);
    content.focus();
    
}
