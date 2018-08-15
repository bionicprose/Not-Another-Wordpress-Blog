
// var enter = documentQuerySelector('.editor__textarea');
// enter.addEventListener('keypress', function(e) {
//     if(e.keycode === 13) {
//         document.execCommand("defaultParagraphSeparator", false, "p");
//         return false;
//     }

// });
// function yo() {
//     document.execCommand("defaultParagraphSeparator", false, "p");
// }

// function yoyo() {
// var stuff = document.querySelector('.editor__textarea');
//     document.querySelector('.editor__textarea--hidden').value = stuff.innerHTML;
// }

function copyContent() {
    document.querySelector('.editor__textarea--hidden').value = document.querySelector('.editor__textarea').innerHTML;
     if(!document.querySelector('.editor__textarea--hidden').value) {
         return false;
    } else {
        return true;
    }
}

