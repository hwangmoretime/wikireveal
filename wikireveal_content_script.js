// Copyright (c) 2015, David Hwang
// Check LICENSE for fully detailed description.

var dates = [];
var revisions = [];
var matches = [];
var title = '';
var loadData = function() {
    findTimestamps();
    var max_date = new Date(Math.max.apply(null,dates));
    var min_date = new Date(Math.min.apply(null,dates));
    findRevisions(min_date, max_date, new Date(0));
}

var renderData = function() {
    var body_html = document.getElementById('bodyContent').innerHTML;
    for (var i = 0; i < matches.length; i++) {
        revision_id = matchToRevision(dates[i]);
        replacement = '<a href=/w/index.php?title=' + title + '&oldid=' + revision_id + '>' + matches[i] + '</a>';
        body_html = body_html.replace(matches[i], replacement);
    };
    document.getElementById('bodyContent').innerHTML = body_html;
}

var findTimestamps = function() {
    // This should be doen with one regex string, each of these constructed with 
    // a setFlags. Tried to do it with RegExp(re_str, 'mg') and RegExp(re_str, 'm').
    // Didn't work.
    var re = /(\d*):(\d*), (\d*) (\w*) (\d*) \(UTC\)$/mg;
    var re1 = /(\d*):(\d*), (\d*) (\w*) (\d*) \(UTC\)$/m; 

    var body = document.getElementById('bodyContent');
    matches = body.textContent.match(re);
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            temp = matches[i].match(re1);
            hours = temp[1];
            minutes = temp[2];
            day = temp[3];
            month = temp[4];
            year = temp[5];
            datestring = month + ' ' + day + ', ' + year + ' ' + hours + ':' + minutes;
            dates.push(new Date(datestring));
        };
    }
}

var findRevisions = function(min_date, max_date, prev_last_date) {
    var min_date_str = dateToAPIstring(min_date);
    var max_date_str = dateToAPIstring(max_date);

    // get the title of the article for the URL
    // http://en.wikipedia.org/wiki/Wikipedia:Naming_conventions_(technical_restrictions)
    var parser = document.createElement('a');
    parser.href = document.URL;  // gets rid of '#' and everything after it
    potential_title = parser.pathname.split('Talk:')[1].split('/');
    title = potential_title[0];
    var i = 1;
    while(i < potential_title.length &&
        potential_title[i].search(/archive/i) == -1) {
        // The edge case this fails on is if the article title has the word 'archive'
        // in it after a forward slash.
        title += '/' + potential_title[i];
        i++;
    }

    var query_arr = ['http://en.wikipedia.org/w/api.php?action=query&prop=revisions',
                'titles=' + title,
                'rvstart=' + max_date_str,
                'rvend=' + min_date_str,
                'rvlimit=' + '500',
                'rvprop=' + 'timestamp|ids',
                'format=json'];

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            response = JSON.parse(xmlhttp.responseText)['query']['pages'];
            pageid = Object.keys(response)[0];
            revisions = revisions.concat(response[pageid]['revisions']);

            curr_last_date = APItimeToDate(revisions[revisions.length - 1]['timestamp'])
            if (curr_last_date.getTime() > min_date.getTime() &&
                curr_last_date.getTime() != prev_last_date.getTime()) {
                //when API for rvcontinue settles, this section should change to use it
                findRevisions(min_date, curr_last_date, curr_last_date);
            } else {
                for (var i = 0; i < revisions.length; i++) {
                    revisions[i]['date'] = APItimeToDate(revisions[i]['timestamp']);
                };
                renderData();
            }
        }
    }
    xmlhttp.open("GET", query_arr.join('&'), true);
    xmlhttp.send();
}

var matchToRevision = function(d) {
    // linear search
    var i = 0;
    while (i < revisions.length &&
            d.getTime() < revisions[i]['date'].getTime()) {
        i++;
    }

    if (i == revisions.length) {
        return revisions[revisions.length - 1]['parentid'];
    } else {
        return revisions[i]['revid'];
    }
}

var dateToAPIstring = function(d) {
    var year = d.getFullYear().toString();
    var month = pad(d.getMonth() + 1, 2);
    var date = pad(d.getDate(), 2);
    var hour = pad(d.getHours(), 2);
    var minute = pad(d.getMinutes(), 2);
    var second = pad(d.getSeconds(), 2);

    return year + month + date + hour + minute + second;
}

var APItimeToDate = function(timestamp_str) {
    return new Date(timestamp_str.replace('T', ' ').replace('Z', ''));
}

var pad = function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function escapeRegExp(str) {
    //http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

loadData();