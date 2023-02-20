const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Read the JSON file
const data = JSON.parse(fs.readFileSync('./output/search_objectsCluster.json', 'utf-8'));

// Define the CSV header
const header = [
    { id: 'id', title: 'ID' },
    { id: 'title', title: 'Title' },
    { id: 'description', title: 'Description' },
    { id: 'image_1', title: 'Image 1' },
    { id: 'image_2', title: 'Image 2' },
    { id: 'image_3', title: 'Image 3' },
    { id: 'image_4', title: 'Image 4' },
    { id: 'price', title: 'Price' },
    { id: 'web_slug', title: 'Web Slug' },
];

// Define the CSV writer
const csvWriter = createCsvWriter({
    path: 'data.csv',
    header,
});

// Transform the data and write it to the CSV file
const records = Object.values(data).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image_1: item.images[0]?.original || '',
    image_2: item.images[1]?.original || '',
    image_3: item.images[2]?.original || '',
    image_4: item.images[3]?.original || '',
    price: item.price,
    web_slug: item.web_slug,
}));
csvWriter.writeRecords(records)
    .then(() => console.log('CSV file has been written successfully'));