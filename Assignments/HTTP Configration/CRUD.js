const { createReadStream, writeFileSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const http = require('node:http');

let port = 3001;
const path = resolve('./users.json');

const server = http.createServer((req, res) => {
    const { method, url } = req;
    // GET all users
    if (method === "GET" && url === "/users") {
        const users = JSON.parse(readFileSync(path, 'utf-8'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: true, data: users }));
    }
    // GET user by id
    else if (method === "GET" && url.startsWith("/users/")) {
        const users = JSON.parse(readFileSync(path, 'utf-8'));
        const id = url.split("/")[2];
        const user = users.find(u => u.id == id);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "User not found" }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: true, data: user }));
    }
    // POST 
    else if (method === "POST" && url === "/users") {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            const { name, email, age } = JSON.parse(data);
            const users = JSON.parse(readFileSync(path, 'utf-8'));
            const existEmail = users.find(u => u.email === email);
            if (existEmail) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Email already exists' }));
            }
            const newUser = { id: Date.now().toString(), name, email, age };
            users.push(newUser);
            writeFileSync(path, JSON.stringify(users, null, 2));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User created successfully', data: newUser }));
        });
    }
    // update user by id
    else if (method === "PATCH" && url.startsWith("/users/")) {
        const id = url.split("/")[2];
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            const { email, age } = JSON.parse(data);
            const users = JSON.parse(readFileSync(path, 'utf-8'));
            const userIndex = users.findIndex(u => u.id == id);
            if (userIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'User not found' }));
            }
            users[userIndex].age = age;

            writeFileSync(path, JSON.stringify(users));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User updated successfully', data: users[userIndex] }));
        });
    }
    // delete user by id
    else if (method === "DELETE" && url.startsWith("/users/")) {
        const id = url.split("/")[2];
        const users = JSON.parse(readFileSync(path, 'utf-8'));
        const userIndex = users.findIndex(u => u.id == id);
        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found' }));
        }
        const deletedUser = users.splice(userIndex, 1)[0];
        writeFileSync(path, JSON.stringify(users, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User deleted successfully', data: deletedUser }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});
server.listen(port, () => console.log(`Server listening on port ${port}`));
