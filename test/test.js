'use strict';

var assert = require('chai').assert;
var opmlparser = require('../opmlparser');

var DOMParser = require('xmldom').DOMParser;

describe('opml parser', function () {
    it('correctly parses valid empty document', function () {
        var opmlString = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<opml version="1.0">' +
            '<head>' +
            '<title>CREATE ARWORK</title>' +
            '</head>' +
            '<body>' +
            '</body>' +
            '</opml>';
        var result = {
            text: "CREATE ARWORK",
        };

        assert.deepEqual(opmlparser(opmlString, DOMParser), result);
    });

    it('return [] on invalid document', function () {
        //console.log('ok to errors console output in this test');
        var saveConsoleError = console.error;

        var opmlString = "<x><!CDATA[<<>>]]></x>";
        var result = [];

        console.error = function () {};
        var parseResult = opmlparser(opmlString, DOMParser);
        console.error = saveConsoleError;

        assert.deepEqual(parseResult, result);
    });


    it('correctly parses example opml document', function () {

        var opmlString = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<opml version="1.0">' +
                '<head>' +
                    '<title>CREATE ARWORK</title>' +
                '</head>' +
                '<body>' +
                '<outline text="CHOICE SETTING">    ' +
                    '<outline text="Stoneage" />    ' +
                    '<outline text="Rome" />    ' +
                    '<outline text="Modern" />    ' +
                    '<outline text="Middle age" />    ' +
                    '<outline text="Future" />    ' +
                    '<outline text="Fantasy" />    ' +
                    '<outline text="Present day" />    ' +
                '</outline>    ' +
                '<outline text="CHOICE TIME">' +
                    '<outline text="Day" />' +
                    '<outline text="Morning" />' +
                    '<outline text="Night" />' +
                    '<outline text="Evening" />' +
                '</outline>' +
                '<outline text="CHOISE PLACEMENT">' +
                    '<outline text="INDOOR">' +
                        '<outline text="Mech" />' +
                        '<outline text="Box" />' +
                        '<outline text="Workplace" />' +
                        '<outline text="Home" />' +
                        '<outline text="Cave" />' +
                    '</outline>' +
                    '<outline text="MACRO" />' +
                    '<outline text="OUTDOOR">' +
                        '<outline text="Earn" />' +
                        '<outline text="Sea" />' +
                        '<outline text="Sky" />' +
                        '<outline text="Cosmos" />' +
                    '</outline>' +
                '</outline>' +
                '</body>' +
            '</opml>';
        var result = {
            text: "CREATE ARWORK",
            children: [
                {
                    text: 'CHOICE SETTING',
                    children: [
                        { text: 'Stoneage'},
                        { text: 'Rome'},
                        { text: 'Modern'},
                        { text: 'Middle age'},
                        { text: 'Future'},
                        { text: 'Fantasy'},
                        { text: 'Present day'},
                    ]
                },
                {
                    text: 'CHOICE TIME',
                    children: [
                        { text: 'Day'},
                        { text: 'Morning'},
                        { text: 'Night'},
                        { text: 'Evening'},
                    ]
                },
                {
                    text: 'CHOISE PLACEMENT',
                    children: [
                        {
                            text: 'INDOOR',
                            children: [
                                { text: 'Mech'},
                                { text: 'Box'},
                                { text: 'Workplace'},
                                { text: 'Home'},
                                { text: 'Cave'},
                            ]
                        },
                        { text: 'MACRO'},
                        {
                            text: 'OUTDOOR',
                            children: [
                                { text: 'Earn'},
                                { text: 'Sea'},
                                { text: 'Sky'},
                                { text: 'Cosmos'},
                            ]
                        }
                    ]
                }
            ]
        };

        assert.deepEqual(opmlparser(opmlString, DOMParser), result);
    });

    it('correctly parses new #00! format', function() {
        var opmlString = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<opml version="1.0">' +
            '<head>' +
            '<title>#01! Создание иллюстрации</title>' +
            '</head>' +
            '<body>' +
            '<outline text="#02 CHOICE SETTING" _note="Тут примечание.">    ' +
                '<outline text="Stoneage" />    ' +
                '<outline text="Rome" />    ' +
                '<outline text="Modern" />    ' +
                '<outline text="Middle age" />    ' +
                '<outline text="Future" />    ' +
                '<outline text="Fantasy" />    ' +
                '<outline text="Present day" />    ' +
            '</outline>    ' +
            '<outline text="#01 CHOICE TIME">' +
                '<outline text="Day" />' +
                '<outline text="Morning" />' +
                '<outline text="Night" />' +
                '<outline text="Evening" />' +
            '</outline>' +
            '<outline text="#04! CHOISE PLACEMENT">' +
                '<outline text="INDOOR">' +
                    '<outline text="Mech" />' +
                    '<outline text="Box" />' +
                    '<outline text="Workplace" />' +
                    '<outline text="Home" />' +
                    '<outline text="Cave" />' +
                '</outline>' +
                '<outline text="MACRO" />' +
                '<outline text="OUTDOOR">' +
                    '<outline text="Earn" />' +
                    '<outline text="Sea" />' +
                    '<outline text="Sky" />' +
                    '<outline text="Cosmos" />' +
                '</outline>' +
            '</outline>' +
            '</body>' +
            '</opml>';
        var result = {
            text: "Создание иллюстрации",
            sort: 1,
            modifier: '!',
            children: [
                {
                    text: 'CHOICE TIME',
                    sort: 1,
                    children: [
                        { text: 'Day'},
                        { text: 'Morning'},
                        { text: 'Night'},
                        { text: 'Evening'},
                    ]
                },
                {
                    text: 'CHOICE SETTING',
                    sort: 2,
                    note: 'Тут примечание.',
                    children: [
                        { text: 'Stoneage'},
                        { text: 'Rome'},
                        { text: 'Modern'},
                        { text: 'Middle age'},
                        { text: 'Future'},
                        { text: 'Fantasy'},
                        { text: 'Present day'},
                    ]
                },
                {
                    text: 'CHOISE PLACEMENT',
                    sort: 4,
                    modifier: '!',
                    children: [
                        {
                            text: 'INDOOR',
                            children: [
                                { text: 'Mech'},
                                { text: 'Box'},
                                { text: 'Workplace'},
                                { text: 'Home'},
                                { text: 'Cave'},
                            ]
                        },
                        { text: 'MACRO'},
                        {
                            text: 'OUTDOOR',
                            children: [
                                { text: 'Earn'},
                                { text: 'Sea'},
                                { text: 'Sky'},
                                { text: 'Cosmos'},
                            ]
                        }
                    ]
                }
            ]
        };

        assert.deepEqual(opmlparser(opmlString, DOMParser), result);
    });
});