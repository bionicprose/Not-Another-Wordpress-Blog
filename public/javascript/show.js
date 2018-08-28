// var image = document.querySelector('.imageVar').getAttribute('data-imageVariable');
// console.log(image);
// var heroDiv = document.querySelector('.blog__hero-img');

// heroDiv.setAttribute('data-backgroundImage', image)

// heroDiv.style.backgroundImage = 'url('+image+')';
// heroDiv.style.backgroundPosition = 'center';
// heroDiv.style.backgroundSize = 'cover';
// heroDiv.style.backgroundRepeat = 'no-repeat';


var heroSettings = document.querySelector('.heroSettings');
var heroDiv = document.querySelector('.blog__hero-img');
var heroTitle = document.querySelector('.blog__hero-text');
var styles = document.getElementById('bpStyles');
var titleSettings = document.querySelector('.titleSettings');
console.log(heroSettings);

if(heroSettings.dataset.gradient == 'true') {
    styles.sheet.insertRule('.blog__hero-img { background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+heroSettings.dataset.image+')}', styles.sheet.cssRules.length);
    console.log('should have gradient');
    } else {
        console.log('should not have gradient');
        styles.sheet.insertRule('.blog__hero-img { background-image: url('+heroSettings.dataset.image+')}', styles.sheet.cssRules.length);       
   
}
console.log(titleSettings.dataset.fontcolor);
styles.sheet.insertRule('.blog__hero-text { color: '+titleSettings.dataset.fontcolor+'}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { font-size: '+titleSettings.dataset.fontsize+'em}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { top: '+titleSettings.dataset.fonttop+'%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { left: '+titleSettings.dataset.fontleft+'%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-img { background-size: '+heroSettings.dataset.size+'%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-img { background-position: '+heroSettings.dataset.positionx+'% '+ heroSettings.dataset.positiony+'%}', styles.sheet.cssRules.length);

