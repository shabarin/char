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
