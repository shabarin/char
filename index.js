var parseOpml = require('./opmlparser');

jQuery(document).ready(function ($) {

    $('[data-toggle="tooltip"]').tooltip();

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

        //for (var i = 0; i < window.opmlObj.children.length; i++) {
        //    generateChar(window.opmlObj.children[i], $result, 1)
        //}

        generateChar(window.opmlObj, $result, 0);

        // other stuff
        var searchStr = '';
        $('div.result .others').each(function(index) {
            searchStr += $(this).text() + ' ';
        });

        $('.act-google').attr({href: 'https://www.google.nl/search?tbm=isch&q='+searchStr});
        $('.act-google').fadeIn();

    });

});

function generateChar(opmlObj, $result, level) {
    var text = opmlObj.text;
    var html;
    if (level == 0) {
        html = $('<h3>' + text + '</h3>');
    } else {
        html = $('<div>' + text + '</div>');
    }
    html.css({ paddingLeft: 20*(level) });

    // note
    //if (opmlObj.note) $result.attr({
    //    'data-toggle': "tooltip",
    //    title: opmlObj.note
    //});
    if (opmlObj.note) {
        var note = $('<a href="javascript:void(0)"><span class="glyphicon glyphicon-info-sign"></span></a>');
        note.attr({
            title: opmlObj.text,
            'data-placement': 'left',
            'data-content': opmlObj.note
        });
        note.css({paddingLeft: '5px'});
        note.popover();
        html.append(note);
    }

    switch (level) {
        case 0:
            break;
        case 1:
            html.addClass('first');
            break;
        default:
            html.addClass('others');
            break;
    }
    $result.append(html);
    if (!opmlObj.children) return;

    switch (opmlObj.modifier) {
        case '!':
            // отрабатываем все подпараметры
            $result.addClass('modifier-all');
            for (var i=0; i<opmlObj.children.length; i++) {
                generateChar(opmlObj.children[i], $result, level+1);
            }
            break;
        case '?':
            // отрабатываем случайное число подпараметров
            var randoms = [];
            var count = Math.floor(Math.random()*opmlObj.children.length);
            while (randoms.length < count) {
                var cur = Math.floor(Math.random()*opmlObj.children.length);
                if (-1 == randoms.indexOf(cur)) randoms.push(cur);
            }
            for (var i=0; i<randoms.length; i++) {
                generateChar(opmlObj.children[randoms[i]], $result, level+1);
            }
            $result.addClass('modifier-some-random');
            break;
        default:
            // отрабатываем один случайный подпараметр
            $result.addClass('modifier-one-random');
            var randomChild = Math.floor(Math.random() * opmlObj.children.length);
            generateChar(opmlObj.children[randomChild], $result, level + 1);
            break;
    }

}