var parseOpml = require('./opmlparser');

jQuery(document).ready(function ($) {

    $('button.act-parse').click(function () {
        $('span.parse-result').hide();

        var opml = $('#opml').val();
        var opmlObj = parseOpml(opml, window.DOMParser);
        window.opmlObj = opmlObj;

        $('span.parse-result').text('Всего вариантов: ' + countVariants(opmlObj));
        $('span.parse-result').fadeIn();

        function countVariants(obj) {
            if (!obj.children) return 1;
            var res = 0;
            for (var i = 0; i < obj.children.length; i++) {
                res += countVariants(obj.children[i]);
            }
            return res;
        }
    });

    $('button.act-clear').click(function () {
        $('#opml').val("");
    });

    $('form.opml').submit(function (event) {
        event.preventDefault();
    });

    $('button.act-generate').click(function () {
        var $result = $('.result');
        $result.html('');

        for (var i = 0; i < window.opmlObj.children.length; i++) {
            generateChar(window.opmlObj.children[i], $result, 1)
        }

        var searchStr = '';
        $('div.result .others').each(function(index) {
            searchStr += $(this).text() + ' ';
        });

        //var key = "AIzaSyBMstrDVa-OiC_EZYoULXpFw78Dbdc3xhQ";
        //$.get('https://www.google.nl/search?tbm=isch&q='+searchStr, function(resp) {
        //    console.log(resp);
        //});

        $('.act-google').attr({href: 'https://www.google.nl/search?tbm=isch&q='+searchStr});
        $('.act-google').fadeIn();

    });

});

function generateChar(opmlObj, $result, level) {
    var text = opmlObj.text;
    var html = $('<div>' + text + '</div>');
    //html.css({ paddingLeft: 20*(level-1) });
    if (1 == level) {
        html.addClass('first');
    } else {
        html.addClass('others');
    }
    $result.append(html);
    if (!opmlObj.children) return;

    var randomChild = Math.floor(Math.random() * opmlObj.children.length);
    generateChar(opmlObj.children[randomChild], $result, level + 1);
}