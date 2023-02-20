const fs = require("fs");

const highest_lat = 43.79170;
const lowest_lat = 36.00000;
const highest_lon = 4.50000;
const lowest_lon = -9.50000;

const lat_step = 0.05;
const lon_step = 0.05;

const lat_range = highest_lat - lowest_lat;
const lon_range = highest_lon - lowest_lon;

const lat_steps = lat_range / lat_step;
const lon_steps = lon_range / lon_step;

const lat_array = [];
const lon_array = [];

for (let i = 0; i < lat_steps; i++) {
    lat_array.push(lowest_lat + i * lat_step);
}

for (let i = 0; i < lon_steps; i++) {
    lon_array.push(lowest_lon + i * lon_step);
}

const comarcas = [];

for (let i = 0; i < lat_array.length; i++) {
    for (let j = 0; j < lon_array.length; j++) {
        comarcas.push({
            Latitude: lat_array[i],
            Longitude: lon_array[j],
        });
    }
}

fs.writeFileSync("comarcasArray.json", JSON.stringify(comarcas, null, 2));

