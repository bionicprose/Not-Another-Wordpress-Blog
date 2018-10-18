/* this applies title and blog header image settings */

console.log('index.js is loaded');
// var heroSettings = document.querySelector('.heroSettings');
var titleSettings = document.querySelector('.titleSettings')
var styles = document.getElementById('bpStyles');


//  if(heroSettings.dataset.gradient == 'true') {
//      styles.sheet.insertRule('.blog__hero-img { background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('+heroSettings.dataset.image+')}', styles.sheet.cssRules.length);
//      console.log('should have gradient');
//      } else {
//          console.log('should not have gradient');
//          styles.sheet.insertRule('.blog__hero-img { background-image: url('+heroSettings.dataset.image+')}', styles.sheet.cssRules.length);       
   
//  }

titleSettings.dataset.fontsize = titleSettings.dataset.fontsize * 2 *  (screen.width / 1900);
console.log(titleSettings.dataset.fontcolor);
styles.sheet.insertRule('.blog__hero-text { color: '+titleSettings.dataset.fontcolor+'}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { font-size: '+titleSettings.dataset.fontsize+'em}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { top: '+titleSettings.dataset.fonttop+'%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { left: '+titleSettings.dataset.fontleft+'%}', styles.sheet.cssRules.length);
/*styles.sheet.insertRule('.blog__hero-img { background-size: '+heroSettings.dataset.size+'%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-img { background-position: '+heroSettings.dataset.positionx+'px '+ heroSettings.dataset.positiony+'px}', styles.sheet.cssRules.length);
*/

