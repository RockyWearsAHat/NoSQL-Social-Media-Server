# NoSQL Social Media API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?logo=typescript&logoColor=blue)](https://www.npmjs.com/package/typescript)
[![Express](https://img.shields.io/badge/Express-4.19.2-yellow?logo=express&logoColor=yellow)](https://www.npmjs.com/package/express)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-lime?logo=mongodb&logoColor=lime)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.3.1-red?logo=mongodb&logoColor=red)](https://www.npmjs.com/package/mongoose)

## [Demo](https://www.youtube.com/watch?v=RsMCjqcUlW4)

## Description

This is a simple project made to demonstrate an example API for a social media app running in MongoDB, no SQL queries, relitively decent (not perfect) error handling, and some interesting things learned along the way with Mongoose/MongoDB models. Includes login, logout, register, a simple session store for keeping track of who is logged in on what computer, as well as routes for users, "thoughts" (posts), and "reactions" (comments).

## Table of Contents

- [Installation](#installation)
- [Set Up Mongo](#set-up-mongodb-and-the-local-environment)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository using `git clone https://github.com/RockyWearsAHat/NoSQL-Social-Media-Server.git`
2. cd into the folder, `cd NoSQL-Social-Media-Server`
3. `code .`
4. Open terminal and run `npm install` or `npm i`
5. To run with TypeScript directly, run `npm run dev`
6. To run with JavaScript, run `npm run build-n-start`

## Set Up MongoDB And The Local Environment

There are many many routes defined, but currently the project is looking for a local MongoDB instance, so make sure you have set up a connection to MongoDB by installing the [MongoDB driver here](https://www.mongodb.com/try/download/community) (or go [here for instructions, only community is needed](https://www.mongodb.com/docs/manual/installation/)); once the driver has been installed, install [MongoDB compass here](https://www.mongodb.com/try/download/compass). Once both the driver and compass have been downloaded and installed, make sure MongoDB is running (if you installed via the driver it's in settings or an application on windows, if you installed on mac via homebrew, the command is `brew services start mongodb-community@7.0`, for more help [go here](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)). When MongoDB is installed locally, simply open MongoDB Compass and connect to `mongodb://localhost:27017`, as long as the drivers are running it should successfully connect. Then simply just make a new database with the **+** button in the top left of the application window right next to **Databases**. For the application to work without changing the config in db/connect.ts, please use the database name `social-media`. Once everything as been set up, `npm run dev`, `npm start`, and `npm run build-n-start` should all work

## Features

As I said, there are many many routes defined, they are listed below:

- http://localhost:3000/api/user/register - POST, self explanitory expects a json body like:

```json
{
  "username": "alex",
  "email": "alex@gmail.com",
  "password": "testing123"
}
```

- http://localhost:3000/api/user/login - POST, again, pretty self explanitory (accepts email or username):
- Wide margin of error, if username is entered as email, it will search via username, and vice versa

```json
{
  "username": "alex@gmail.com", / "email": "alex",
  "password": "testing123"
}
```

- http://localhost:3000/api/user/logout - POST, again, somewhat self explanitory, send post and destroys the session:
- No body, works of stored session of user

- http://localhost:3000/api/user/users/getAll - GET all users, send a get request and sends back all user data (besides passwords)

- http://localhost:3000/api/user/users/id? - GET single user, either by id or by stored session id, replace id? with object id for any user e.g. http://localhost:3000/api/user/users/661c830623f9bc2ef1a24d97

- http://localhost:3000/api/user/users - PUT to update a single user, works from session id so users cannot modify the data of another user, update any property like, passwords get rehashed on updating

```json
{
  "email": "newemail@test.com",
  "password": "aNewPassword"
}
```

- http://localhost:3000/api/user/users - DELETE to delete a user and all of their corresponding data, works off session id so a user must be logged in and request it themselves

- http://localhost:3000/api/user/friends - POST to add a new friend, expects a valid username OR uid of another user in the body

```json
{
  "username": "anotherUsername",
  "uid": "661c830623f9bc2ef1a24d97"
}
```

- http://localhost:3000/api/user/friends - DELETE to remove a friend, expects a valid username OR uid of a friend user in the body

```json
{
  "username": "anotherUsername",
  "uid": "661c830623f9bc2ef1a24d97"
}
```

- http://localhost:3000/api/user/friends/ - GET to get all friends of the logged in user

- http://localhost:3000/api/user/friends/id? - GET to get all friends of any user, replace id? with a valid ID for a user to see their friends

- http://localhost:3000/api/user/thoughts/ - POST to create a new thought, expects a thoughtText on the body

```json
{
  "thoughtText": "This is a thought"
}
```

- http://localhost:3000/api/user/thoughts/getAll - GET all thoughts of all users in the database

- http://localhost:3000/api/user/thoughts/id? - GET a specific thought, replace id? with a valid thought ID

- http://localhost:3000/api/user/thoughts/id? - PUT to update a thought, expects id? to be replaced with a valid thought ID and the body can contain any of the following 2 properties

```json
{
  "thoughtText": "This is a test",
  "createdAt": "4/20/24"
}
```

- http://localhost:3000/api/user/thoughts/id? - DELETE to remove a specific thought by it's id, id? should be replaced with a valid thought ID, and validation is done to ensure that the user is the owner of the thought

- http://localhost:3000/api/user/thoughts/thoughtId?/reaction - POST to add a reaction to a thought, replace thoughtId? with a valid thought ID and the body should be something similar to

```json
{
  "reactionBody": "A reaction"
}
```

- http://localhost:3000/api/user/thoughts/thoughtId?/reaction - DELETE to remove a reaction from a thought, replace thoughtId? with a valid thought ID, reactionId is required on the body, and validation is done to ensure the user that is calling the request owns the reaction being deleted

```json
{
  "reactionId": "661dfec4d2f6e3548fec0f1e"
}
```

## Contributing

Contribute whatever additions

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
