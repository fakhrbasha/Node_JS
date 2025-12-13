// Assignment 2 : 
const path = require("node:path")
// 1. Write a function that logs the current file path and directory. (0.5 Grade)
// • Output Example:{File:“/home/user/project/index.js”, Dir:“/home/user/project”}

function logFileAndDir() {
    console.log({ File: __filename, Dir: __dirname });
}

logFileAndDir()

// 2. Write a function that takes a file path and returns its file name. (0.5 Grade)
// • Input Example: /user/files/report.pdf
// • Output Example:"report.pdf"


function getFileName(file) {
    return path.basename(file)
}
console.log(getFileName("/user/files/report.pdf"));


// 3. Write a function that builds a path from an object (0.5 Grade)
// • Input Example: { dir: "/folder", name: "app", ext: ".js"}
// • Output Example: “/folder/app.js”

function buildPath(obj) {
    return path.format(obj)
}

console.log(buildPath({ dir: "/folder", name: "app", ext: ".js" }));


// 4. Write a function that returns the file extension from a given file path. (0.5 Grade)
// • Input Example: /docs/readme.md"
// • Output Example: “.md”

function getFileExtension(file) {
    return path.extname(file)
}
console.log(getFileExtension("/docs/readme.md"));

// 5. Write a function that parses a given path and returns its name and ext. (0.5 Grade)
// • Input Example: /home/app/main.js
// • Output Example: { Name: “main”, Ext: “.js” }


function getParsePath(file) {
    const data = path.parse(file);
    return { Name: data.name, Ext: data.ext };
}

console.log(getParsePath("/home/app/main.js"));

// 6. Write a function that checks whether a given path is absolute. (0.5 Grade)
// • Input Example: /home/user/file.txt
// • Output Example: true


function isAbs(file) {
    return path.isAbsolute(file)
}

console.log(isAbs("/home/user/file.txt"));

// 7. Write a function that joins multiple segments (0.5 Grade)
// • Input:"src","components", "App.js"
// • Output Example: src/components/App.js

function joinPath(...args) {
    return path.join(...args)
}

console.log(joinPath("src", "components", "App.js"));

// 8. Write a function that resolves a relative path to an absolute one. (0.5 Grade)
// • Input Example: ./index.js
// • Output Example: /home/user/project/src/index.js

function resolvePath(file) {
    return path.resolve(file)
}

console.log(resolvePath("./index.js"));


// 9. Write a function that joins two paths. (0.5 Grade)
// • Input Example: /folder1, folder2/file.txt
// • Output Example: /folder1/folder2/file.txt


function join2Paths(...args) {
    return path.join(...args)
}

console.log(join2Paths('/folder1', 'folder2/file.txt'));

// fs

// 10. Write a function that deletes a file asynchronously. (0.5 Grade)
// • Input Example: /path/to/file.txt
// • Output Example: The file.txt is deleted.

const fs = require("node:fs")
// const fsAsync = require("node:fs/promises")

function deleteFile(file) {
    try {
        fs.unlink(path.resolve(file), () => {
            console.log(`The ${path.basename(file)} is deleted.`);
        })
    } catch (err) {
        console.error("Error deleting file",);
    }
}

deleteFile(__dirname + "/file.txt")


// 11. Write a function that creates a folder synchronously. (1 Grade)
// • Output Example: “Success”

function createFolder(folderName) {
    fs.mkdirSync(folderName, { recursive: true })
    console.log("Success");
}

createFolder("newFolder/subFolder");


// 12. Create an event emitter that listens for a "start" event and logs a welcome message. (0.5 Grade)
// • Output Example: Welcome event triggered!

const EventEmitter = require('node:events');
const emit = new EventEmitter();
emit.on('start', () => {
    console.log("Welcome event triggered!");

});
emit.emit('start');

// 13. Emit a custom "login" event with a username parameter. (0.5 Grade)
// • Input Example:"Ahmed"
// • Output Example: “User logged in: Ahmed”
emit.on('login', (name) => {
    console.log(`User logged in: ${name}`);
})

emit.emit('login', "Ahmed")

// 14. Read a file synchronously and log its contents. (1 Grade)
// • Input Example:"./notes.txt"

const data = fs.readFileSync(path.resolve("./note.txt"), { encoding: 'utf-8' })
console.log(data);

// 15. Write asynchronously to a file. (1 Grade)
// • Input: path:"./async.txt", content:"Async save"

fs.writeFile(path.resolve("./async.txt"), "Async save", (err) => {
    if (err) {
        console.error("Error writing file:", err);
    } else {
        console.log("File written successfully.");
    }
})

// 16. Check if a directory exists. (0.5 Grade)
// • Input Example: "./notes.txt"
// • Output Example: true

fs.existsSync(path.resolve('./note.txt')) ? console.log(true) : console.log(false);


// 17. Write a function that returns the OS platform and CPU architecture. (0.5 Grade)
// • Output Example: {Platform: “win32”, Arch: “x64”}

const os = require('node:os');

function getOSInfo() {
    return { Platform: os.platform(), Arch: os.arch() }
}
console.log(getOSInfo());



