const express = require('express')
var fs = require('fs');
const app = express()

const pg = require('pg');

app.listen(3000, function () {})

const config = fs.readFileSync("database_config.json")

const client = new pg.Client(JSON.parse(config))
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
    console.time('getObjects')
    getObjects().then(data => {
        console.timeEnd('getObjects')
        res.send(data);
    })
})

function getObjects() {
    const objectsColumns = ["object_id Id", "object_title Title", "object_abstract Abstract", "object_version VersionNb", "object_status Status"];
    const spatialColumns = ["ST_AsText(spatial_geometry_mock_up) Geometry", "spatial_latitude Latitude", "spatial_longitude Longitude"];
    const objectsQuery = `SELECT ${objectsColumns.join(',')}, ${spatialColumns.join(',')} 
                        FROM object.object
                        LEFT JOIN spatial.has_spatial ON spatial.has_spatial.has_spatial_object = object.object.object_id
                        LEFT JOIN spatial.spatial ON spatial.has_spatial.has_spatial_spatial = spatial.spatial.spatial_id
                        WHERE object.object.object_title is not null
                        ORDER BY object.object.object_id`
    return getData(objectsQuery);
}

//#endregion


//#region GETTING RELATIONS

app.get('/Relations', (req, res) => {
    console.time('getRelations')
    getRelations().then(data => {
        console.timeEnd('getRelations')
        res.send(data);
    })
})

function getRelations() {
    const objectsColumns = ["object_relation_first A", "object_relation_second B"];
    const objectsQuery = `SELECT ${objectsColumns.join(',')}
                            FROM object.object
                            WHERE object_relation_first is not null`;
    return getData(objectsQuery);
}

//#endregion



//#region GETTING SPATIAL DATA

app.get('/Spatial', (req, res) => {
    console.time('getSpatial')
    getSpatialData().then(data => {
        console.timeEnd('getSpatial')
        res.send(data);
    })
})

function getSpatialData() {
    const spatialColumns = ["has_spatial_object Id", "spatial_latitude Latitude", "spatial_longitude Longitude"];
    const spatialQuery = `SELECT ${spatialColumns.join(',')} from spatial.spatial
                        INNER JOIN spatial.has_spatial ON spatial.has_spatial.has_spatial_spatial = spatial.spatial.spatial_id`;
    return getData(spatialQuery);
}

//#endregion