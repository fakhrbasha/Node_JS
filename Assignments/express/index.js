const express = require("express")
const { createReadStream, createWriteStream, readFileSync, writeFileSync } = require('node:fs')
const { resolve } = require("node:path")
const app = express()

const port = 3000
app.use(express.json())


const path = resolve('./users.json')
const users = JSON.parse(readFileSync(path, 'utf-8'))


// post user
app.post('/users', (req, res, next) => {
    const { id, name, email, age } = req.body
    const emailExist = users.find((user) => {
        return user.email === email
    })
    if (emailExist) {
        return res.status(404).json({ message: "user is exist" })
    }
    const newUser = { id, name, email, age }
    users.push(newUser)
    writeFileSync(path, JSON.stringify(users))
    return res.status(201).json({ message: "create user successfully", newUser })
})

// update user by id /:id
app.patch('/users/:id', (req, res, next) => {
    const id = Number(req.params.id)

    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1) {
        return res.status(404).json({ message: "User ID not exist" })
    }
    const { name, email, age } = req.body
    if (name !== undefined) users[userIndex].name = name
    if (email !== undefined) users[userIndex].email = email
    if (age !== undefined) users[userIndex].age = age
    writeFileSync(path, JSON.stringify(users))
    return res.status(200).json({ message: "success", user: users[userIndex] })

})


// get user by name

app.get('/users/getByName', (req, res, next) => {
    // console.log({ query: req.query });
    const { name } = req.query
    if (!name) {
        return res.status(400).json({ message: "name query is required" })
    }
    const user = users.find(user => user.name === name)
    if (!user) {
        return res.status(404).json({ message: "user name not found" })
    }
    return res.status(200).json({ message: "success", user })
})


// filter users by minimum age

app.get('/users/filter', (req, res) => {
    const { minAge } = req.query
    if (!minAge) {
        return res.status(400).json({ message: "minAge query is required" })
    }
    const ageNumber = Number(minAge)
    if (!Number(ageNumber)) {
        return res.status(400).json({ message: "minAge must be a number" })
    }
    const filteredUsers = users.filter(user => user.age >= ageNumber)
    return res.status(200).json({
        message: "success",
        users: filteredUsers
    })
})

// get user by id /:id
app.get('/users/:id', (req, res, next) => {
    const id = Number(req.params.id)
    const userIndex = users.find((user) => user.id === id)
    if (!userIndex) {
        return res.status(404).json({ Message: "User ID not exist" })
    }
    return res.status(200).json({ message: "success", user: userIndex })

})

// delete

app.delete('/users/:id', (req, res, next) => {
    const id = Number(req.params.id)
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex == -1) {
        return res.status(404).json({ message: "user id not found" })
    }

    const deleteUser = users.splice(userIndex, 1)
    writeFileSync(path, JSON.stringify(users))
    return res.status(200).json({ message: "user deleted successfully", users })

})



// get users
app.get('/users', (req, res, next) => {
    return res.status(200).json({ message: 'success', users })
})









app.listen(port, () => {
    console.log(`server listen in port ${port}`);
})