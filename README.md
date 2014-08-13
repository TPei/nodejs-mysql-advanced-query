nodejs-mysql-advanced-query
===========================

nodejs mysql query module that supports advanced ('where') queries

usage example:
--------------
### usage schema
```js
generator.find(tableName, { columnName: {comparisionAction: value}, columnName2: { comparisionAction: value } });
```

### create handler and call function
```js
app.get('/someUrl', function(req, res){
    var QueryGenerator = require('mysql-query-generator');
    var generator = new QueryGenerator();
    var table = 'users';
    var query = generator.find(table, { columnName: {is: 'bla'}, columnName2: { greater: 4 } });
});
```

### returned query
select * from users where columnName = \'bla\' and columnName2 > 4;

supported comparision actions:
------------------------------
###general:
- is => "="
-- where column = value
- isNot => "!="
-- where column != value

###strings only
- contains => "like"
-- where column like '%value%'
- containsNot => "not like"
-- where column not like '%value%'
- startsWith => "like value%"
-- where column like 'value%'
- endsWith => "like %value"
-- where column like '%value'

###numbers only:
- less => "<"
-- where column < value
- lessOrEqual => "<="
-- where column <= value
- greater => ">"
-- where column > value
- greaterOrEqual => ">="
-- where column >= value

illegal (those that are not supported) modifiers will be ignored

Security
--------
### Injections
To prevent sql injections certain characters and keywords are not allowed like:
- quotes
- whitespaces

License
-------
[MIT](http://cheeaun.mit-license.org/)

