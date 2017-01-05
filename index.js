var parseOpml = require('./opmlparser');

jQuery(document).ready(function($) {

    $('button.act-parse').click(function () {
        var opml = $('#opml').val();
        window.opmlObj = parseOpml(opml, window.DOMParser);
    });

    $('button.act-clear').click(function () {
        $('#opml').val("");
    });

    $('form.opml').submit(function(event) {
        event.preventDefault();
    });

});