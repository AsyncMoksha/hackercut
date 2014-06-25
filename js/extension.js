$(document).ready(function() {
    const max_index = 31; // including the "More" line - next page

    var index = 1; // global arrow index

    // add additional td before index to make space for pointer
    for(var i = 1; i < 31; ++i) {
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
                // alert(1);
                event.preventDefault();
                // document.first('table').hide();
                // $('table:nth-of-type(2)').hide();
                // document.find('table:first').hide();
                // $('body table:first table:nth-of-type(2)').hide();
                if(index < max_index) {
                    $('td .arrow-right').remove();
                    $("td").filter(function() {
                        return $.text([this]) == index + '.';
                    }).prev('td').html('<div class="arrow-right"></div>');
                    ++index;
                }
                break;
            default:
                break;
        }
    });

});