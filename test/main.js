/**
 * @author TPei
 * created: 13/08/14.
 */
var QueryGenerator = require('../mysql-advanced-query');
var generator = new QueryGenerator();

var assert = require('assert');
var mocha = require('mocha');

describe("QueryGenerator", function () {
    describe('#find', function () {
        it('should target correct table', function () {
            var table = 'users';
            var query = generator.find(table);
            assert.equal(query, 'select * from ' + table + ';')
        });

        it('should be able to find without queryObject ', function () {
            var table = 'users';
            var query = generator.find(table);
            assert.equal(query, 'select * from ' + table + ';')
        });

        it('should be able to find with empty queryObject ', function () {
            var table = 'users';
            var query = generator.find(table);
            assert.equal(query, 'select * from ' + table + ';')
        });

        it('should add where subquery targeting the correct columns', function () {
            var table = 'users';
            var query = generator.find(table, { columnName: {is: 'bla'}, columnName2: { greater: 4 } });
            assert.equal(query, 'select * from ' + table + ' where columnName = \'bla\' and columnName2 > 4;')
        });

        it('should ignore illegal queryObject columns', function () {
            var table = 'users';
            var query = generator.find(table, { columnName: {is: '\'bla'}, columnName2: { greater: 4 } });
            assert.equal(query, 'select * from ' + table + ' where columnName2 > 4;')
        });

        it('should ignore illegal queryObject comparisionActions', function () {
            var table = 'users';
            var query = generator.find(table, { columnName: {is: '\'bla'}, columnName2: { greater: 4 } });
            assert.equal(query, 'select * from ' + table + ' where columnName2 > 4;')
        });

        it('should ignore queryObject comparisionActions that are not supported', function () {
            var table = 'users';
            var query = generator.find(table, { columnName: {is: 'bla'}, columnName2: { above: 4 } });
            assert.equal(query, 'select * from ' + table + ' where columnName = \'bla\';')
        });

        it('should be able to work when all comparisionActions where illegal or unsupported', function () {
            var table = 'users';
            var query = generator.find(table, { columnName: {is: '\'bla'}, columnName2: { above: 4 } });
            assert.equal(query, 'select * from ' + table + ';')
        });

        it('should be able to work if given table was illegal', function () {
            var query = generator.find('\'bla', { columnName: {is: '\'bla'}, columnName2: { above: 4 } });
            assert.equal(query, 'select 1 = 1;')
        });

        it('should be able to work if if given multiple comparisionActions for a table', function () {
            var table = 'users';
            var query = generator.find(table, { columnName2: { greater: 4, greaterOrEqual: 5 } });
            assert.equal(query, 'select * from ' + table + ' where columnName2 > 4 and columnName2 >= 5;')
        });
    });
});