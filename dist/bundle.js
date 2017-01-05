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

        var wholeResult = parseNode(node);

        return wholeResult.children ? wholeResult.children : [];

    } catch (e) {
        return [];
    }

};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var parseOpml = __webpack_require__(0);

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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map