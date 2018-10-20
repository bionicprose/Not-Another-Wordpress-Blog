/* this applies title and blog header image settings */

console.log('index.js is loaded');

var titleSettings = document.querySelector('.titleSettings')
var styles = document.getElementById('bpStyles');




titleSettings.dataset.fontsize = titleSettings.dataset.fontsize * 2 *  (screen.width / 1900);
console.log(titleSettings.dataset.fontcolor);
styles.sheet.insertRule('.blog__hero-text { color: '+titleSettings.dataset.fontcolor+'}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { font-size: '+titleSettings.dataset.fontsize+'em}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { top: '+titleSettings.dataset.fonttop+'%}', styles.sheet.cssRules.length);
styles.sheet.insertRule('.blog__hero-text { left: '+titleSettings.dataset.fontleft+'%}', styles.sheet.cssRules.length);

