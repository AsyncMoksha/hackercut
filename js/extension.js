$(document).ready(function() {
    const MAX_INDEX = 30; // including the "More" line - next page

    var index = 1; // global arrow index
    var arrow_on = false;

    // add additional td before index to make space for pointer
    for(var i = 1; i <= MAX_INDEX; ++i) {
        $("td").filter(function() {
            return $.text([this]) == i + '.';
        }).before('<td></td>');
    }

    // adjust the colspan of the space filler to compensate 
    // the additional td so that the summary area
    // shows right underneath title area
    $('td[colspan=2]').attr("colspan", 3);

    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 9: // tab key pressed
                if(false == arrow_on) {
                    event.preventDefault();
                    $('.arrow-right').remove();
                    $("td").filter(function() {
                        return $.text([this]) == index + '.';
                    }).prev('td').html('<div class="arrow-right"></div>');
                    arrow_on = true;
                }
                break;

            case 40: // down arrow key
                if(true == arrow_on) {
                    if(index < MAX_INDEX) {
                        event.preventDefault();
                        ++index;
                        $('.arrow-right').remove();
                        $("td").filter(function() {
                            return $.text([this]) == index + '.';
                        }).prev('td').html('<div class="arrow-right"></div>');
                    }
                }
                break;

            case 38: // up arrow key
                if(true == arrow_on) {
                    if(index > 1) {
                        event.preventDefault();
                        --index;
                        $('.arrow-right').remove();
                        $("td").filter(function() {
                            return $.text([this]) == index + '.';
                        }).prev('td').html('<div class="arrow-right"></div>');
                    }
                }
                break;

            case 13: // enter key
                event.preventDefault();
                var link = $("td").filter(function() {
                    return $.text([this]) == index + '.';
                }).parent().find('td.title a').attr('href');
                open_in_background(link);
                break;

            case 27: // esc key
                arrow_on = false;
                $('.arrow-right').remove();
                break;
            default:
                break;
        }

        // open link in background by simulating ctrl+click
        // code: http://stackoverflow.com/questions/10812628/open-a-new-tab-in-the-background
        function open_in_background(link){
            var a = document.createElement("a");
            a.href = link;
            var evt = document.createEvent("MouseEvents");
            //the tenth parameter of initMouseEvent sets ctrl key
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                                        true, false, false, true, 0, null);
            a.dispatchEvent(evt);
        }

    });

});