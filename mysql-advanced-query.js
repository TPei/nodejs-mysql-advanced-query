/**
 * @author TPei
 * created: 13/08/14.
 */
function QueryGenerator() {
}

/**
 * create select request
 * @param table to be queried
 * @param queryObject columns, modifiers and values for subquery
 * @returns {string} complete mysql query
 */
QueryGenerator.prototype.find = function(table, queryObject) {
    return queryHandler('select', table, queryObject);
}

/**
 * create delete request
 * @param table to be queried
 * @param queryObject columns, modifiers and values for subquery
 * @returns {string} complete mysql query
 */
QueryGenerator.prototype.delete = function(table, queryObject) {
    return queryHandler('delete', table, queryObject);
}

function queryHandler(keyword, table, queryObject) {

    // if it it is json string, parse it
    try {
        var o = JSON.parse(queryObject);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object",
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null)
            queryObject = o;
    }
    catch (e) {}

    // sql injection protection
    if(!isAllowed(table))
        return "select 1 = 1;";

    var query = keyword + ' * from '+table+' where ';

    // no queryObject was given, do simple select
    if(!queryObject)
        return query.substring(0, query.length-7) + ';';

    query = query + createSubQuery(queryObject);

    if(query.substring(query.length-8, query.length) == ' where ;')
        return query.substring(0, query.length-8) + ';';

    return query;
}

/**
 * creates wheree subquery
 * @param queryObject columns, modifiers and values for subquery
 * @returns {string} 'where ...' subquery
 */
function createSubQuery(queryObject) {
    // dictionary of allowed queries
    this.queryDictionary = {};
    // general
    this.queryDictionary['is'] = '=';
    this.queryDictionary['isNot'] = '!=';
    //this.queryDictionary['limit'] = 'limit';

    // string only
    this.queryDictionary['contains'] = 'like';
    this.queryDictionary['containsNot'] = 'not like';
    this.queryDictionary['startsWith'] = 'like %';
    this.queryDictionary['endsWith'] = '% like';

    // number only
    this.queryDictionary['less'] = '<';
    this.queryDictionary['lessOrEqual'] = '<=';
    this.queryDictionary['greater'] = '>';
    this.queryDictionary['greaterOrEqual'] = '>=';

    var query = '';

    for(column in queryObject){
        if(isNaN(column)) {
            if(!isAllowed(column))
                continue;
        }

        for(modifier in queryObject[column]) {

            if(isNaN(queryObject[column][modifier])) {
                if(isAllowed(queryObject[column][modifier]))
                    queryObject[column][modifier] = '\''+queryObject[column][modifier]+'\'';
                else
                    continue;
            }

            if(!this.queryDictionary[modifier])
                continue;

            query += column + ' ' + this.queryDictionary[modifier] + ' ' + queryObject[column][modifier] + ' and ';
        }
    }

    // remove trailing ' and'
    query = query.substring(0, query.length-5) + ';';

    return query;
}

/**
 * check if request part is allowed
 * slashes and quotes are not allowed for sql injection security reasons
 * @param request
 * @returns {boolean}
 */
function isAllowed(request) {
    if(request.match(/[\'"]/)) // no quotes allowed
        return false;
    if(request.match(/[\/\\\\]/)) // no slashes allowed
        return false;

    return true;
}

module.exports = QueryGenerator;