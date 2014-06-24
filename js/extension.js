$(document).ready(function() {
    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 9: // tab key pressed
                // alert(1);
                event.preventDefault();
                // document.first('table').hide();
                // $('table:nth-of-type(2)').hide();
                // document.find('table:first').hide();
                // $('body table:first table:nth-of-type(2)').hide();
                $("td").filter(function() {
                    return $.text([this]) == '2.';
                }).before('<td><div class="arrow-right"> </div></td>');
                break;
            default:
                break;
        }
    });

});