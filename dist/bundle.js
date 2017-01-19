/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/**
 *
 * @param opmlString
 * @param DOMParser инстанс дом парсера, в браузере будет window.DOMParser, в ноде — require('xmldom').DOMParser
 * @returns {Array}
 */
module.exports = function (opmlString, DOMParser) {
    var parser = new DOMParser();
    try {
        var xml = parser.parseFromString(opmlString, "application/xml");

        //Error handling
        //Note that if the parsing process failed, DOMParser currently does not throw an exception,
        // but instead returns an error document (see bug 45566):
        if (xml.getElementsByTagName('parsererror').length > 0) return [];

        // сначала отдельно обрабатываем <title />
        var titleNode = xml.getElementsByTagName('title')[0].childNodes[0];
        var titleText = titleNode ? titleNode.nodeValue : "";

        var node = xml.getElementsByTagName('body')[0];
        // подсовываем текст в тег <body>, чтобы добиться единообразия; это экспортный файл кривой
        node.setAttribute('text', titleText);

        function parseNode(node) {
            if (node.nodeType !== 1) return null;

            var tmp = {};
            var rawText = node.getAttribute('text');

            // разбиваем на хэштег (если есть) и остальной текст
            var arr = /^#(\d*[!\?]?)\s*(.*)/.exec(rawText);
            var hashStr = arr ? arr[1] : null;
            var text = arr ? arr[2] : rawText;

            // обрабатываем хэш
            if (hashStr) {
                var a = /(\d+)([!\?]?)/.exec(hashStr);
                if (a && a[1]) tmp.sort = parseInt(a[1]);
                if (a && a[2]) tmp.modifier = a[2];
            }

            tmp.text = text;

            // примечание
            var note = node.getAttribute('_note');
            if (note) tmp.note = note;

            if (!node.childNodes || node.childNodes.length == 0) return tmp;

            tmp.children = [];
            for (var i = 0; i < node.childNodes.length; i++) {
                var parsedChild = parseNode(node.childNodes[i]);
                if (null !== parsedChild) {
                    tmp.children.push(parsedChild);
                }
            }
            tmp.children.sort(function(a,b) {
                return ('sort' in a ? a.sort : 0) - ('sort' in b ? b.sort : 0);
            });
            return tmp;
        }

        return parseNode(node);

    } catch (e) {
        return [];
    }

};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var parseOpml = __webpack_require__(0);

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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map