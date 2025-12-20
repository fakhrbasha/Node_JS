const { createReadStream, createWriteStream } = require('node:fs');
const { resolve } = require('node:path');
const zlib = require('node:zlib');

// 1. Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
// • Input Example: "./big.txt"
// • Output Example: log each chunk
const fileStream = createReadStream(resolve('./big.txt'), {
    encoding: 'utf-8',
    highWaterMark: 10
});

fileStream.on("data", chunk => console.log(chunk));
fileStream.on("end", () => console.log("-------------------END--------------------"));
// 2. Use readable and writable streams to copy content from one file to another. (0.5 Grade)
// • Input Example: "./source.txt", "./dest.txt"
// • Output Example: File copied using streams
const sourceStream = createReadStream(resolve('./source.txt'), {
    encoding: 'utf-8',
    highWaterMark: 100
});
const destStream = createWriteStream(resolve('./dest.txt'), { encoding: 'utf-8' });
sourceStream.pipe(destStream);
// 3. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)
// • Input Example: "./data.txt", "./data.txt.gz"
const input = resolve('./data.txt');
const output = resolve('./data.txt.gz');
const gzip = zlib.createGzip();
createReadStream(input).pipe(gzip).pipe(createWriteStream(output));


// Part2: Simple CRUD Operations Using HTTP ( 5.5 Grades):
// in File CRUD.js

