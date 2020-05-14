# Random Questions

### Installation

###### Required:

[Node.js](https://nodejs.org/) to run.

[MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) (local server) to run.

- Stores Database
- Stores Passport JS login info (default to keep user logged in after server refresh `node app.js`)

Configure mongoDB connection in `App.js` file:

```javascript
//  Change mongodbAuth variable to connect to your mongoDB
let mongodbAuth = "mongodb://localhost:127.0.0.1/questions"; //excludes mongodb auth user and password
mongoose.connect(
  mongodbAuth,
  { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.log(err);
    }
  }
);
```

Install the dependencies and start the server.

```
-> Go to repo folder path
$ npm install -d //installs dependencies
$ node app.js // or nodemon
```

Then server will run locally and you can display in browser:

```
127.0.0.1:4040 or localhost:4040
```

### Contributing

Pull requests are welcome.
For major changes, please open an issue first to discuss what you would like to change.
You are currently free to clone/fork this repo.
