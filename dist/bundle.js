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

        var node = xml.getElementsByTagName('body')[0];

        function parseNode(node) {
            if (node.nodeType !== 1) return null;

            var tmp = {};
            tmp.text = node.getAttribute('text');

            if (!node.childNodes || node.childNodes.length == 0) return tmp;

            tmp.children = [];
            for (var i = 0; i < node.childNodes.length; i++) {
                var parsedChild = parseNode(node.childNodes[i]);
                if (null !== parsedChild) {
                    tmp.children.push(parsedChild);
                }
            }
            return tmp;
        }

        //var wholeResult = parseNode(node);
        //return wholeResult.children ? wholeResult.children : [];
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map