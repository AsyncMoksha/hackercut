// TODO: change layout according to current_area
// TODO: add "p" -> profile

$(document).ready(function() {
    const HN_BASE_URL = "https://news.ycombinator.com";
    const ITEMS_PER_PAGE = 30;

    const instructions = '<div class="white-popup">' + 'Keyboard shortcuts powered by <font color="#FF6600">Hackercut</font><br />' + '<hr>' + '<table id="instruction-table">'

    + '<tr><td>' + '<span class="left-side-instruction">tab</span>:' + '</td><td>' + ' turn on arrow navigation' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">up/down arrow keys</span>:' + '</td><td>' + ' move arrow up/down' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">ctrl(&#8984;) + enter</span>:' + '</td><td>' + ' open selected item in a new tab' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">right arrow key</span>:' + '</td><td>' + ' next page' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">esc</span>:' + '</td><td>' + ' quit arrow navigation mode' + '</td></tr>'

    + '<tr class="blank-row"></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">v/u</span>:' + '</td><td>' + ' vote for current selection' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">c</span>:' + '</td><td>' + ' select comment of current title' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">a</span>:' + '</td><td>' + ' select author of current title' + '</td></tr>'

    + '<tr class="blank-row"></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">n</span>:' + '</td><td>' + ' go to "newest" page' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">m</span>:' + '</td><td>' + ' go to "comments" page*' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">k</span>:' + '</td><td>' + ' go to "ask" page' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">j</span>:' + '</td><td>' + ' go to "jobs" page*' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">s</span>:' + '</td><td>' + ' go to "submit" page' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">h</span>:' + '</td><td>' + ' go to Hacker News front page' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">l</span>:' + '</td><td>' + ' go to login page' + '</td></tr>'

    + '<tr><td>' + '<span class="left-side-instruction">w</span>:' + '</td><td>' + ' go to "Show HN" page' + '</td></tr>'

    + '</table>'

    + '<br />' + '<div class="foot-note">*please note that arrow navigation does not work on "comments" and "jobs" pages at this moment.</div>'

    + '</div>';

    var current_area = get_current_area();

    // exclusion list
    if (document.URL.indexOf('/newcomments') >= 0 || document.URL.indexOf('/jobs') >= 0 || document.URL.indexOf('/threads') >= 0 || document.URL.indexOf('/saved') >= 0) {
        return;
    } 

    switch(current_area) {
        // 'item' page doesn't need arrow navigation
        case 'item':
            document.addEventListener('keypress', key_press_handler);
            return;
            break;

        case 'show':
            // if on 1st page of "show" area (which has the notice line in the front)
            if(document.URL.indexOf("/show") >= 0) {
                // it needs a special css class
                $('body table:first-of-type tr:nth-of-type(3) td table').addClass('main-table-show-first-page');

                // add an extra <td> to the notice line so that its <tr> can have
                // same amount of <td>s as other <tr>s after the insertions below
                $('body table:first-of-type tr:nth-of-type(3) td table tr:nth-of-type(2)').prepend('<td></td>');
            } else {
                $('body table:first-of-type tr:nth-of-type(3) td table').addClass('main-table');
            }
        break;

        default:
            // add class in order for the layout in css
            $('body table:first-of-type tr:nth-of-type(3) td table').addClass('main-table');
            break;
    }
    
    var arrow_on = false;
    var additional_td_added = false;
    var index = get_initial_index_of_current_page(); // global arrow index
    var current_page_max_index = get_current_page_max_index();

    // add additional td before index to make space for pointer
    for (var i = 1; i <= current_page_max_index; ++i) {
        $("td").filter(function() {
            return $.text([this]) == i + '.';
        }).before('<td></td>');
    }

    additional_td_added = true;

    // adjust the colspan of the space filler to compensate 
    // the additional td so that the summary area
    // shows right underneath title area
    $('td[colspan=2]').attr("colspan", 3);

    document.addEventListener('keydown', key_down_handler);

    document.addEventListener('keypress', key_press_handler);

    function key_down_handler(event) {
        // avoid key conflicts in input fields
        if ($(event.target).is("input") || $(event.target).is("textarea") || $(event.target).is("select")) {
            return true;
        }

        switch (event.keyCode) {
            /* start arrow mode */
            case 9: // tab key pressed
                if (!arrow_on) {
                    event.preventDefault();
                    move_arrow_to(index);
                    arrow_on = true;
                }
                break;

                /* go down one entry */
            case 40: // down arrow key
                if (arrow_on) {
                    if (index < current_page_max_index) {
                        event.preventDefault();
                        ++index;
                        move_arrow_to(index);
                    }
                }
                break;

                /* go up one entry */
            case 38: // up arrow key
                if (arrow_on) {
                    if (index > 1) {
                        event.preventDefault();
                        --index;
                        move_arrow_to(index);
                    }
                }
                break;

                /* escape arrow mode */
            case 27: // esc key
                arrow_on = false;
                $('.arrow-right').remove();

                // remove focus of title
                $("td").filter(function() {
                    return $.text([this]) == index + '.';
                }).parent().find('td.title a').blur();

                // remove focus of author
                $("td").filter(function() {
                    return $.text([this]) == index + '.';
                }).parent().next().find("td:nth-of-type(2) a:first-of-type").blur();

                // remove focus of comment
                $("td").filter(function() {
                    return $.text([this]) == index + '.';
                }).parent().next().find("td:nth-of-type(2) a:nth-of-type(2)").blur();
                break;

                /* next page */
            case 39: // right arrow key
                var next_page_link_part = $("td").filter(function() {
                    return $.text([this]) == 'More';
                }).find('a').attr('href');

                // 2nd page is special
                if ("news2" == next_page_link_part) {
                    next_page_link_part = "/" + next_page_link_part;
                } else if (undefined == next_page_link_part) {
                    // when no next page
                    return true;
                }

                var next_page_link_full = HN_BASE_URL + next_page_link_part;
                window.location.href = next_page_link_full;
                break;

            default:
                break;
        }
    }

    function key_press_handler(event) {
        // avoid key conflicts in input fields
        if ($(event.target).is("input") || $(event.target).is("textarea") || $(event.target).is("select")) {
            return true;
        }

        switch (event.keyCode) {
            /* go to first entry */
            case 49: // key "1"
                if (arrow_on) {
                    index = get_initial_index_of_current_page();
                    move_arrow_to(index);
                }
                break;

                /* upvote */
            case 118: // "v" key
            case 117: // "u" key
                if (arrow_on) {
                    if (is_logged_in()) {
                        // get a handle of the anchor
                        var vote_node = $("td").filter(function() {
                            return $.text([this]) == index + '.';
                        }).parent().find('td:nth-of-type(3) a');

                        // hide the upvote arrow
                        $("td").filter(function() {
                            return $.text([this]) == index + '.';
                        }).parent().find('.votearrow').hide();

                        var ping = new Image();
                        ping.src = vote_node.attr('href');
                    } else {
                        window.location.href = "https://news.ycombinator.com/newslogin?whence=news";
                    }
                }
                break;

                /* current author */
            case 97: // "a" key
                if (arrow_on) {
                    var author_node = $("td").filter(function() {
                        return $.text([this]) == index + '.';
                    }).parent().next().find("td:nth-of-type(2) a:first-of-type");

                    author_node.focus();
                }
                break;

                /* current comment */
            case 99: // "c" key
                if (arrow_on) {
                    var comment_node = $("td").filter(function() {
                        return $.text([this]) == index + '.';
                    }).parent().next().find("td:nth-of-type(2) a:nth-of-type(2)");

                    comment_node.focus();
                }
                break;

                /* show help window */
            case 47: // "/" key
                $.magnificPopup.open({
                    items: [{
                        src: instructions,
                        type: "inline",
                        modal: false,
                        showCloseBtn: false,
                        enableEscapeKey: true,
                        closeOnBgClick: true
                    }]
                });
                break;

                /* go to "new" page */
            case 110: // "n" key
                window.location.href = 'https://news.ycombinator.com/newest';
                break;

                /* go to "comments" page */
            case 109: // "m" key
                window.location.href = 'https://news.ycombinator.com/newcomments';
                break;

                /* go to "ask" page */
            case 107: // "k" key
                window.location.href = 'https://news.ycombinator.com/ask';
                break;

                /* go to "jobs" page */
            case 106: // "j" key
                window.location.href = 'https://news.ycombinator.com/jobs';
                break;

                /* go to "submit" page */
            case 115: // "s" key
                window.location.href = 'https://news.ycombinator.com/submit';
                break;

                /* go to front page */
            case 104: // "h" key
                window.location.href = "https://news.ycombinator.com/news";
                break;

               /* go to "Show HN" page */
            case 119: // "w" key
                window.location.href = "https://news.ycombinator.com/show";
                break;

            case 108:
                window.location.href = "https://news.ycombinator.com/newslogin?whence=news";
                break;
            default:
                break;
        }
    }

    function is_logged_in() {
        var upper_right_text = $('body table:first-of-type tr:first-of-type td:first-of-type table:first-of-type tr:first-of-type td:last-of-type span:first-of-type a:last-of-type').html();
        if ('login' == upper_right_text) {
            return false;
        } else {
            return true;
        }
    }

    function move_arrow_to(index) {
        $('.arrow-right').remove();
        $("td").filter(function() {
            return $.text([this]) == index + '.';
        }).prev('td').html('<div class="arrow-right"></div>');

        // focus on corresponding link
        $("td").filter(function() {
            return $.text([this]) == index + '.';
        }).parent().find('td.title a').focus();
    }

    function get_initial_index_of_current_page() {
        var index_string;

        // if not on 1st page of "show" area
        if(document.URL.indexOf('/show') < 0) {
            if (!additional_td_added) {
                index_string = $('body table tr:nth-of-type(3) td:first-of-type table:first-of-type tr:first-of-type td:first-of-type').text();

            } else {
                index_string = $('body table tr:nth-of-type(3) td:first-of-type table:first-of-type tr:first-of-type td:nth-of-type(2)').text();
            }
        } else {
            if (!additional_td_added) {
                index_string = $('body table tr:nth-of-type(3) td:first-of-type table:first-of-type tr:nth-of-type(4) td:first-of-type').text();

            } else {
                index_string = $('body table tr:nth-of-type(3) td:first-of-type table:first-of-type tr:nth-of-type(4) td:nth-of-type(2)').text();
            }
        }

        index_string = index_string.replace('.', '');
        var index = parseInt(index_string);
        return index;
    }

    function get_current_page_max_index() {
        var initial_index = get_initial_index_of_current_page();
        return initial_index + (ITEMS_PER_PAGE - 1);
    }

    // TODO: get "bookmarklet" (& alike) dynamically by truncating ".html"
    // identify which area we are in
    function get_current_area() {
        var current_area = "";

        // selection is white
        /* covered areas:
            new
            threads
            comments
            show
            ask
            jobs
        */
        $('.pagetop a').each(function() {
            if('rgb(255, 255, 255)' == $(this).css('color')) {
                current_area = $(this).text();
            }
        });

        /*  covered areas:
            submissions
            saved
            shownew
        */
        $('.pagetop font').each(function() {
            if('rgb(255, 255, 255)' == $(this).css('color')) {
                if($(this).text().indexOf('submissions') >= 0) {
                    current_area = "submissions";
                } else {
                    current_area = $(this).text();
                }
            }
        });

        if("" == current_area) {
            if(document.URL.indexOf('/item') >= 0) {
                current_area = "item";
            } else if(document.URL.indexOf('/submit') >= 0) {
                current_area = "submit";
            } else if(document.URL.indexOf('/changepw') >= 0) {
                current_area = "changepw";
            } else if(document.URL.indexOf('/user') >= 0) {
                current_area = "user";
            } else if(document.URL.indexOf('/edit') >= 0) {
                current_area = "edit";
            } else if(document.URL.indexOf('/reply') >= 0) {
                current_area = "reply";
            } else if(document.URL.indexOf('/formatdoc') >= 0) {
                current_area = "formatdoc"; // "help" page for "about" field in settings
            }
            //below are pages from bottom links
            else if(document.URL.indexOf('/newsguidelines') >= 0) {
                current_area = "newsguidelines";
            } else if(document.URL.indexOf('/newsfaq') >= 0) {
                current_area = "newsfaq";
            } else if(document.URL.indexOf('/rss') >= 0) {
                current_area = "rss";
            } else if(document.URL.indexOf('/lists') >= 0) {
                current_area = "lists";
            } else if(document.URL.indexOf('/bookmarklet') >= 0) {
                current_area = "bookmarklet";
            } else if(document.URL.indexOf('/dmca') >= 0) {
                current_area = "dmca";
            } else if(document.URL.indexOf('/newsnews') >= 0) {
                current_area = "newsnews";
            } else if(document.URL.indexOf('/issues') >= 0) {
                current_area = "issues";
            }

        }

        /*  covered areas:
            front 
        */
        if("" == current_area) {
            current_area = "front";
        }

        /*  covered areas:
            unknown 
        */
        if("" == current_area) {
            current_area = "front";
        }

        return current_area;
    }

    // ABANDONED, reason: stopped hijacking enter key keydown event
    // open link in background by simulating ctrl+click
    // code: http://stackoverflow.com/questions/10812628/open-a-new-tab-in-the-background
    // function open_in_background(link){
    //     var a = document.createElement("a");
    //     a.href = link;
    //     var evt = document.createEvent("MouseEvents");
    //     //the tenth parameter of initMouseEvent sets ctrl key
    //     evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
    //                                 true, false, false, true, 0, null);
    //     a.dispatchEvent(evt);
    // }

});