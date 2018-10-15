/* for high resolution screens */
document.addEventListener('load', function() {
    var scale = 1 / (window.devicePixelRatio || 1);
    var content = 'width=device-width, initial-scale=' + scale;

    document.querySelector('meta[name="viewport"]').setAttribute('content', content)
}, false);
/* this function hides the bionicwriter image on small screens when the
    search input is used from the overlay menu. Returns image onblur. */

function showBionicWriter(action) {
    if(action === '-') {
       var overlay = document.querySelector('.overlay');
       overlay.style.backgroundImage = 'url(../img/clouds-mobile-3.png)';
       overlay.style.backgroundSize = 'cover';
      
    } else {
        var overlay = document.querySelector('.overlay');
        overlay.style.backgroundImage = 'url(../img/bionicwriter-mobile-3.png), url(../img/clouds-mobile-3.png)';
        overlay.style.backgroundSize = 'auto, cover';
    }
}
/* this applies title and blog header image settings */

console.log('index.js is loaded');
var heroSettings = document.querySelector('.heroSettings');
var titleSettings = document.querySelector('.titleSettings')
var styles = document.getElementById('bpStyles');


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
styles.sheet.insertRule('.blog__hero-img { background-position: '+heroSettings.dataset.positionx+'px '+ heroSettings.dataset.positiony+'px}', styles.sheet.cssRules.length);

/* this sets up the calendar on the sidebar. it builds the calendar
    and highlights the days which have blogposts. 
    a mouseover that day pulls up a list of posts in a tool tip
    which are hyperlinked */

    
var currentDate = setDate(null, null);

var year = document.querySelector('.year');
    year.innerText = currentDate.year;

    var mo = document.querySelector('.month');
    mo.innerText = currentDate.today[1];
    mo.setAttribute('data-month', currentDate.month.num);

function setDate(year, month) {
    if(year === null){
        var newDate = new Date();
        newDate = new Date(newDate.getFullYear(), newDate.getMonth());
    } else {
    var newDate = new Date(year, month);
    }
    var today = newDate.toDateString().split(' ');
 console.log('today is ' + today);
    var cal = {
        day: {
            num: today[2],
            name: today[0]
        },
        month: {
            num: newDate.getMonth(),
            name: today[1]
        },
        year: newDate.getFullYear(),
        today: today
    };


    switch(today[1]) {
        case 'Jan':
        case 'Mar':
        case 'Jul':
        case 'Aug':
        case 'Oct':
        case 'Dec':
            cal.days = 31;
            break;
        case 'Apr':
        case 'Jun':
        case 'Sep':
        case 'Nov':
        case 'May':
            cal.days = 30;
            break;
        case 'Feb':
            cal.days = 28;
            break;
    }
    if(year===null) {
        console.log('first day calculated' + cal.year + cal.month.num + cal.day.num);
    cal.firstDay = newDate.getDay(cal.year, cal.month.num);
    } else {
        console.log('new first day ' +year + month + today[2]);
        cal.firstDay = newDate.getDay(year, month);
    }
    return cal;
}

var remove = false;

buildWeek(currentDate, remove);
   
function buildWeek(date, remove) {
    if (remove === true) {
        console.log('remove is true');
        var theadX = document.querySelector('.calendar__header');
        theadX.remove();
        var tbodyX = document.querySelector('.calendar__body');
        tbodyX.remove();
        }
        console.log('first day is ' + date.firstDay);
    var tHead = document.createElement('thead');
    tHead.classList.add('calendar__header');

    var weekHead = document.createElement('tr');

    var sun = document.createElement('th');
    sun.innerText = 'Sun';

    var mon = document.createElement('th');
    mon.innerText = 'Mon';

    var tue = document.createElement('th');
    tue.innerText = 'tue';

    var wed = document.createElement('th');
    wed.innerText = 'wed';

    var thu = document.createElement('th');
    thu.innerText = 'thu';

    var fri = document.createElement('th');
    fri.innerText = 'fri';

    var sat = document.createElement('th');
    sat.innerText = 'sat';

    weekHead.appendChild(sun);
    weekHead.appendChild(mon);
    weekHead.appendChild(tue);
    weekHead.appendChild(wed);
    weekHead.appendChild(thu);
    weekHead.appendChild(fri);
    weekHead.appendChild(sat);
    tHead.appendChild(weekHead);
    
    var tbody = document.createElement('tbody');
    tbody.classList.add('calendar__body');
    var x = 1;
    var month = document.createElement('tr');
    month.innerText = date.month.name;
    var blogs = document.querySelector('.bionicProse');
    var blogIndex = JSON.parse(blogs.dataset.blogs);
    while(x <= date.days) {
        var dayOfWeek = 0;
        var week = document.createElement('tr');
        while( dayOfWeek < 7) {
            
            var day = document.createElement('td');
            // var dayNum = document.createElement('div');
            // dayNum.classList.add('dayNum');
            if(dayOfWeek >= date.firstDay || x > 1) {
                if(x <= date.days) {
                    var toolTip = document.createElement('div');
                    toolTip.classList.add('tooltip');
                    toolTip.innerText = x;
                    x++;
                    
                    var tipText = document.createElement('span');
                    tipText.classList.add('tooltiptext');
                    console.log(typeof blogIndex);
                    for(let i = 0; i < blogIndex.length; i++) {
                        if(x < 10) {
                            var dayDigit = '0'+x;
                        } else {
                            var dayDigit = x;
                        }
                        // console.log('search for: ' + date.month.name + ' ' + x + ' ' +date.year);
                        if(blogIndex[i].postDate.includes(date.month.name + ' ' + dayDigit + ' ' + date.year)) {
                            console.log(blogIndex[i].title);
                            day.style.fontWeight = 'bold';
                    day.style.color = ' #dfdfdf';
                    day.style.background = '#0066ed';
                            var li = document.createElement('li');
                            var link = document.createElement('a');
                            link.setAttribute('href', '/blog/' + blogIndex[i].url);
                            link.innerText = blogIndex[i].title;
                            li.appendChild(link);
                            tipText.appendChild(li);
                            toolTip.appendChild(tipText);
                            day.appendChild(toolTip);
                            
                        } 
                };
                day.appendChild(toolTip);
                }
            }
            dayOfWeek++;
            // day.appendChild(dayName);
            // day.appendChild(dayNum);
            week.appendChild(day);
        } // week loop
        tbody.appendChild(week);
    }
    document.querySelector('.calendar__table').insertBefore(tHead, null);
    document.querySelector('.calendar__table').insertBefore(tbody, null);
}

function changeDate(date, change) {
    var y = document.querySelector('.year');
    var year = Number(y.innerText);
    var m = document.querySelector('.month');
    var month = Number(m.dataset.month);
    // var currentDate = setDate(null, null);
    if (change === 'sub' && date === 'year') {
        var newDate = setDate(year - 1, month);
    } else if (change === 'sub' && date === 'month') {
        if(month - 1 < 0) {
            var newMonth = 11;
            year = year -1;
        } else {
            var newMonth = month - 1;
        }
        var newDate = setDate(year, newMonth);
    } else if (change === 'add' && date === 'year') {
        var newDate = setDate(year + 1, month);
    } else if (change === 'add' && date === 'month') {
        if(month + 1 > 11) {
            var newMonth = 0;
            year = year + 1;
        } else {
            var newMonth = month + 1;
        }
        var newDate = setDate(year, newMonth);
    }
    var remove = true;
    buildWeek(newDate, remove);
    y.innerText = newDate.year;
    m.innerText = newDate.month.name;
    m.setAttribute('data-month', newDate.month.num);
}

var docWidth = document.documentElement.offsetWidth;

[].forEach.call(
  document.querySelectorAll('*'),
  function(el) {
    if (el.offsetWidth > docWidth) {
      console.log('offset: ' + el);
    }
  }
);

/* onclick function for hamburger menu, also keeps background 
    from scrolling behind overlay. */

function menu(action) {
    if(action === '+') {
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('html').style.overflow = 'hidden';
    document.querySelector('body').style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = 'no';
    } else {
        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('html').style.overflow = 'visible';
        document.querySelector('body').style.overflow = 'visible';
        document.documentElement.style.overflow = 'scroll';
        document.body.scroll = 'yes';
    }
}