"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const comarcas = require("./comarcas.json");
//create a get request on https://api.wallapop.com/api/v3/general/search?latitude={lat}&longitude={lon} on the object of the comarcas.json file
//and log the response
//imports:
const axios = require("axios");
const fs = require("fs");
//function to get the data from the api
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`https://api.wallapop.com/api/v3/general/search?latitude=${comarcas[0].lat}&longitude=${comarcas[0].lon}`);
            console.log(response.data);
        }
        catch (error) {
            console.error(error);
        }
    });
}
getData();
