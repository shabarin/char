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