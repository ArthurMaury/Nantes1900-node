const express = require('express')
const app = express()

const pg = require('pg');

app.listen(3000, function () { })

const client = new pg.Client({
    host: 'localhost',
    port: 5432,
    database: 'nantes1900',
    user: 'postgres',
    password: 'toor',
})
client.connect();

function getData(query) {
    return client.query(query)
        .then(result => {
            var data = [];
            result.rows.forEach(row => {
                data.push(row);
            })
            return data;
        })
}

///////////////// GETTING OBJECTS //////////////////////////

app.get('/Objects', (req, res) => {
    getObjects().then(data => {
        res.send(data.slice(0, 10));
    })
})

function getObjects() {
    const objectsColumns = ["object_id", "object_title", "object_abstract", "object_description", "object_version", "object_status"];
    const objectsQuery = `SELECT ${objectsColumns.join(',')} from object.object`;
    return getData(objectsQuery).then(addKeywords);
}

function addKeywords(objects) {
    var promises = [];
    objects.forEach(object => {
        promises.push(
            getKeywords(object).then(keywords => {
                object["keywords"] = keywords.map(keyword => {
                    return keyword.keyword_name;
                });
                return object;
            })
        )
    })
    return Promise.all(promises).then(objectsWithKeywords => {
        return objectsWithKeywords;
    })
}

function getKeywords(object) {
    const keywordsQuery = `SELECT keyword_name from category.keyword
                    INNER JOIN category.has_keyword ON category.has_keyword.has_keyword_keyword = category.keyword.keyword_id
                    INNER JOIN object.object ON category.has_keyword.has_keyword_object = object.object.object_id 
                    WHERE object.object.object_id = ${object.object_id} `;
    return getData(keywordsQuery).then(keywords => {
        return keywords;
    })
}


///////////////// GETTING RELATIONS //////////////////////////


