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

//#region GETTING OBJECTS

app.get('/Objects', (req, res) => {
    getObjects().then(data => {
        res.send(data); // HACK
    })
})

function getObjects() {
    const objectsColumns = ["object_id", "object_title", "object_abstract", "object_description", "object_version", "object_status"];
    const objectsQuery = `SELECT ${objectsColumns.join(',')} from object.object`;
    return getData(objectsQuery)
        .then(addKeywords)
        .then(addSpatial);
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

function addSpatial(objects) {
    var promises = [];
    objects.forEach(object => {
        promises.push(
            getSpatialObject(object).then(spatial => {
                if (spatial){
                    Object.keys(spatial).forEach(prop => {
                        object[prop] = spatial[prop];
                    })
                }
                return object;
            })
        )
    })
    return Promise.all(promises).then(objectsWithSpatial => {
        return objectsWithSpatial;
    })
}

function getSpatialObject(object) {
    const spatialColumns = ["spatial_geometry_mock_up", "spatial_zone", "spatial_adress_text", "spatial_latitude", "spatial_longitude"];
    const spatialQuery = `SELECT ${spatialColumns.join(',')} from spatial.spatial
                        INNER JOIN spatial.has_spatial ON spatial.has_spatial.has_spatial_spatial = spatial.spatial.spatial_id
                        INNER JOIN object.object ON spatial.has_spatial.has_spatial_object = object.object.object_id
                        WHERE object.object.object_id = ${object.object_id}`;
    return getData(spatialQuery).then(spatials => {
        return spatials[0];
    })
}

//#endregion


//#region GETTING RELATIONS

app.get('/Relations', (req, res) => {
    getRelations().then(data => {
        res.send(data);
    })
})

function getRelations() {
    const objectsColumns = ["object_relation_first", "object_relation_second"];
    const objectsQuery = `SELECT ${objectsColumns.join(',')}
                            FROM object.object
                            WHERE object_relation_first is not null`;
    return getData(objectsQuery);
}

//#endregion



//#region GETTING SPATIAL DATA

app.get('/Spatial', (req, res) => {
    getSpatialData().then(data => {
        res.send(data);
    })
})

function getSpatialData() {
    const spatialColumns = ["has_spatial_object as object_id", "spatial_latitude", "spatial_longitude", "spatial_adress_text"];
    const spatialQuery = `SELECT ${spatialColumns.join(',')} from spatial.spatial
                        INNER JOIN spatial.has_spatial ON spatial.has_spatial.has_spatial_spatial = spatial.spatial.spatial_id`;
    return getData(spatialQuery);
}

//#endregion