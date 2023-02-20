const turf = require('@turf/turf');
const fs = require('fs');

const polygon = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              1.9926286229731431,
              41.26312647463851
            ],
            [
              2.147798064706649,
              41.29584056322878
            ],
            [
              2.266457049562007,
              41.46390052202116
            ],
            [
              2.148500188877449,
              41.42021512346568
            ],
            [
              1.9926286229731431,
              41.26312647463851
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
};

const latStep = 0.5;
const lngStep = 0.5;

//get a list of all the latitude and longitude points in the polygon with the given step
const points = turf.pointsWithinPolygon(turf.pointGrid([1.9926286229731431, 41.26312647463851, 2.266457049562007, 41.46390052202116], latStep, lngStep), polygon);

//put them on a list and print them
const pointsList = points.features.map(point => point.geometry.coordinates);
console.log(pointsList);

//put all the poinstList in a file called barcelonaArray.json with the following format:
/*
[
    {
      "Latitude": lat,
      "Longitude": long
    },
    ...
]
*/
//CREATE A Latitude and Longitude OBJECT
var latLongObject = {};
//CREATE A Latitude and Longitude LIST
var latLongList = [];
//CREATE A COUNT VARIABLE
var count = 0;
//ITERATE OVER THE POINTS LIST
for (let i = 0; i < pointsList.length; i++) {
    //CREATE A LATITUDE AND LONGITUDE OBJECT
    latLongObject = {
        "Latitude": pointsList[i][1],
        "Longitude": pointsList[i][0]
    };
    //ADD THE LATITUDE AND LONGITUDE OBJECT TO THE LATITUDE AND LONGITUDE LIST
    latLongList.push(latLongObject);
    //INCREMENT COUNT
    count++;
}
//WRITE THE LATITUDE AND LONGITUDE LIST TO A FILE
fs.writeFileSync("barcelonaArray.json", JSON.stringify(latLongList, null, 2));
