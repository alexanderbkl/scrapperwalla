const barcelonaArray = require("./barcelonaArray.json");

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

//function to get the data from the api for each comarca
//create search_objects object with a list of all the search_objects from the api
var search_objectsObject = {};
var search_objectsList = [];
var count = 0;

if (cluster.isMaster) {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    // Handle worker exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
    });

    // Wait for all workers to finish before creating JSON file
    cluster.on('exit', async (worker, code, signal) => {
        if (Object.keys(cluster.workers).length === 0) {
            console.log('All workers have finished');
            console.log("search_objectsObject length: " + Object.keys(search_objectsObject).length);

            const filenames = [];
            for (let i = 1; i <= numCPUs; i++) {
                filenames.push(path.join(outputDir, `search_objectsCluster.${i}.json`));
            }
            const outputFile = path.join(outputDir, `search_objectsCluster.json`);
            const mergedData = {};
            for (const filename of filenames) {
                const data = JSON.parse(fs.readFileSync(filename));
                Object.assign(mergedData, data);
            }
            fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2));
            console.log('All workers have finished');
        }
    });
} else {
    const workerId = cluster.worker.id;
    const start = (workerId - 1) * barcelonaArray.length / 4 + 1;
    const end = workerId * barcelonaArray.length / 4;
    const promises = [];

    // create a filename for the output file
    const outputFile = path.join(outputDir, `search_objectsCluster.${workerId}.json`);



    for (let i = start; i <= end; i++) {
        if (i == end) {
            // Stop this worker
        } else {
            promises.push(getData(i));
        }
    }

    async function getData(i) {
        try {
            const response = await axios.get(`https://api.wallapop.com/api/v3/general/search?latitude=${barcelonaArray[i].Latitude}&longitude=${barcelonaArray[i].Longitude}`);

            for (let key in response.data.search_objects) {
                if (response.data.search_objects[key].flags.reserved == false) {
                    if (response.data.search_objects[key].shipping_allowed == true) {
                        if (response.data.search_objects[key].price > 15) {
                            if (response.data.search_objects[key].category_id != 12465) {
                                if (search_objectsList.includes(response.data.search_objects[key].id) == false) {
                                    search_objectsObject[i] = response.data.search_objects[key];
                                    search_objectsList.push(response.data.search_objects[key].id);
                                    count++;
                                }
                            }
                        }
                    }
                }
            }

            if (i % 10 == 0) {
                console.log("count: " + count);
            }

            if (i % 100 == 0) {
                console.log("Latitud actual: " + barcelonaArray[i].Latitude);
                console.log("Longitud actual: " + barcelonaArray[i].Longitude);
                //log the search_objects object length
                console.log("search_objectsObject length: " + Object.keys(search_objectsObject).length);
            }
            // write the output to the file
            fs.writeFileSync(outputFile, JSON.stringify(search_objectsObject, null, 2));

        } catch (error) {
            console.log("error: " + workerId)
            console.error(error);
        }
    }

    // Wait for all the promises to resolve before exiting the worker
    Promise.all(promises).then(() => {
        console.log(`Worker ${workerId} has finished processing`);
        cluster.worker.kill();
    });
}
