# Express-backend 
this repo is a simple boilerplate for express application with basic features as:

**This setup works with local instance of mongo only if you have mongo installed on your machine**
if you dont have mongo installed you can follow [this](https://docs.mongodb.com/manual/administration/install-community/) instructions. then to start it simply run `sudo mongod` from the command line.


# built-in Auth - using passport-mongoose 
this boilerplate built with passport auth with mongo database: 
simply add your login data in the config.js file and uncomment the necessary part from db/mongoos.js
or , use it as is on localhost. 
passport have to get two fields from the client to work: 
**password** // (must be named "password")
**username** // (must be name "username")

# built-in email activation 
on signup the user will get an email to activate their account 
**note** - that require from you to have a domain name or smtp server to send the email. 
simply add the username and the password from your smtp account in the config.js file and you good to go. 
on activation - the user schema in the db will be updated with the value "true" on "active" prop. 
then passport can recognize the user as verified account. 
You can find smtp providers [here](https://github.com/discourse/discourse/blob/master/docs/INSTALL-email.md)

# built-in password reset using email
I added an end point for your users to reset their password if they need to

# protected routes with JWT
when you login token will be generated for you and will be sent to the client where it will be stored in `localstorage`.
then you can use the token to gain access to functions and routes. 

**front end example**
```js
    protectedRoute = () => {
        axios.post(`${config.backEndServer}/protected`, {
            token:this.state.token // passing the token to access the route
        })
        .then(() => {
            Swal('yey', 'awesome! I see you signed in(:', 'success') // show if the token is right
        })
        .catch((e) => {
            if (e) {
                Swal('oops' , 'login to see it(:' , 'error') // show if token is wrong or there is no token passed
            }
        })
    }
```


here you can see the backend in action [protected route](./server/routes/protected.js) that you can simply duplicate in any route toy want
**example:**
```js
    router.post('/' , function(req, res) {

        var token = req.body.token; // taking the token we passed in the request
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' }); // send 401 if there is no token provided
    
        jwt.verify(token, config.JWTsecret, function(err, decoded) { // using the token we passed to authonticate the account
            if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' }); // if the token wrong send 401 status

            // if auth was successful
            // do stuff here
            res.send('auth success')
        })
    });
```

# React-frontend
the frontend use React and built with **react-router** by default. You can add your routes in the [Main.js](client/src/Screens/Main/Main.js) file 

# to use 
* simply clone the repo, add the smtp cords as described above inside [config.js](./server/routes/config.js).




**to use with your remote server dont forget to update the username and the password to your db in [config.js](./server/routes/config.js)**

* then:
```sh
cd server/ 
npm install && npm start
cd client/
npm install && npm start
```
Thats it! now your React front end run on `http://localhost:3000`. and your server run on `http://localhost:3010` 

# Known issues
* setting 
`server` inside [config.js](./server/routes/config.js) to numeric address (i.e 10.0.0.11) will couse the confirmation email not to be sent. make sure to use alphabetical address

# [demo](https://express-react-boilerplate.herokuapp.com/)
email: demo@demo.com
password: demodemo

you can also check the activation process by signing up new email! (:

**pull requests are welcome (:**



 