

//create a get request on https://api.wallapop.com/api/v3/general/search?latitude={lat}&longitude={lon} on the object of the comarcas.json file
//and log the response
//imports:
const comarcasArray = require("./barcelonaArray.json");

const axios = require("axios");
const fs = require("fs");

//function to get the data from the api for each comarca
//create search_objects object with a list of all the search_objects from the api
var search_objectsObject = {};
var search_objectsList = [];
var count = 0;
async function getData() {

    try {
        for (let i = comarcasArray.length - 1; i > 0; i--) {
            try {

                const response = await axios.get(`https://api.wallapop.com/api/v3/general/search?latitude=${comarcasArray[i].Latitude}&longitude=${comarcasArray[i].Longitude}`);
                //iterate over the search_objects object
                for (let key in response.data.search_objects) {
                    //if flags.reserved is false:
                    if (response.data.search_objects[key].flags.reserved == false) {
                        //if shipping_allowed is true:
                        if (response.data.search_objects[key].shipping_allowed == true) {
                            //if price is higher than 15:
                            if (response.data.search_objects[key].price > 15) {

                                //if this search_object is not already in the search_objects list:
                                if (search_objectsList.includes(response.data.search_objects[key].id) == false) {
                                    //add the search_object to the search_objects object
                                    search_objectsObject[count] = response.data.search_objects[key];
                                    //add the search_object id to the search_objects list
                                    search_objectsList.push(response.data.search_objects[key].id);
                                    count++;

                                }

                            }
                        }
                    }

                }

                //if i is divisible by 10, print count
                if (i % 10 == 0) {
                    console.log(count);

                }
                if (i % 100 == 0) {
                    //latitude:
                    console.log("Latitud actual: " + comarcasArray[i].Latitude);
                    //longitude:
                    console.log("Longitud actual: " + comarcasArray[i].Longitude);

                }


            }
            catch (error) {
                console.error(error);
            }
        }
    }
    catch (error) {
        console.error(error);

    }
}
async function startGettingData() {
    await getData();
    console.log();
    //print the length of the search_objects object
    console.log(Object.keys(search_objectsObject).length);
    console.log(search_objectsList.length);


    //write the search_objects object to a json file
    fs.writeFileSync("search_objects.json", JSON.stringify(search_objectsObject, null, 2));

    //print search_objects object
    //console.log(search_objects);
    //print length of search_objects object
    //console.log(Object.keys(search_objects).length);
}

startGettingData();
