Set up express boilerplate

## Copy

## sh: npx express-generator --no-view server

## Copy

sh: cd server
change_process_dir: ./server

---

Install dev dependencies

## Copy

## sh: npm i nodemon cors dotenv

Edit package.json scripts to use nodemon:

## Copy

to: package.json
inject: true
after: start
skip_if: dev

---

,
"dev": "nodemon ./bin/www"
Add .env and .gitignore . Then add node_modules to .gitignore and add PORT=8000 to .env

## Copy

## sh: echo 'node_modules/ \n .env' >.gitignore && echo 'PORT=8000' >.env

Step 0.1
Clean up boilerplate

Remove public/

## Copy

## sh: rm -R public/

Remove routes/users.js

## Copy

## sh: rm routes/users.js

Go to app.js require cors library

## Copy

to: app.js
inject: true
at_line: 0

---

require(
"dotenv"
).config()
const cors= require("cors")
Go to app.js enable cross-origin access

## Copy

to: app.js
inject: true
after: public

---

app.use(cors())
Go to app.js remove require userRouter line. Since we don't need it

## Copy

to: app.js
inject: true
remove_lines:
from: usersRouter
to: 1

---

Go to app.js remove app.use(/users) line

## Copy

to: app.js
inject: true
remove_lines:
from: /users
to: 1

---

Go to index.js remove res.render line

## Copy

to: routes/index.js
inject: true
remove_lines:
from: render
to: 1

---

Then replace with

## Copy

to: routes/index.js
inject: true
after: function

---

res.status(200).send("Welcome to CoderSchool!")

1. Add Mongo to project
   add mongo to project

Step 1.0
Add mongo uri to env

## Copy

to: .env
inject: true
at_line: 0

---

MONGODB_URI="mongodb://localhost:27017/template"
Step 1.1
Install mongoose library

## Copy

## sh: npm i mongoose

Step 1.2
Config mongoose to connect to local MongoDB

## Copy

to: app.js
inject: true
after: app\.use\(cors\(\)\)

---

const mongoose = require("mongoose")
/_ DB connection_/
const mongoURI = process.env.MONGODB_URI;

mongoose
.connect(mongoURI)
.then(() => console.log(`DB connected ${mongoURI}`))
.catch((err) => console.log(err));

2. Add helper functions
   Adding helper

Step 2.0
Create helper folder

## Copy

## sh: mkdir helpers

Step 2.1
Create utils.js file

## Copy

## sh: touch helpers/utils.js

Step 2.2
Create a sendResponse helper. This function controls the way we response to the client. Both success and error. The reusability of this helper is very high so if we need to change the way to response later on, we only need to handle it here

## Copy

## to: helpers/utils.js

const utilsHelper = {};

utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
const response = {};
if (success) response.success = success;
if (data) response.data = data;
if (errors) response.errors = errors;
if (message) response.message = message;
return res.status(status).json(response);
};
Step 2.3
Create a AppError class inherits from javascript Error class so that it could be throw. Construct the class so that error made from this class will have different identifiers : isOperational, statusCode, and errorType than uncaught system error.

## Copy

to: helpers/utils.js
inject: true
after: \}\;

---

class AppError extends Error {
constructor(statusCode, message, errorType) {
super(message);
this.statusCode = statusCode;
this.errorType = errorType;
// all errors using this class are operational errors.
this.isOperational = true;
// create a stack trace for debugging (Error obj, void obj to avoid stack polution)
Error.captureStackTrace(this, this.constructor);
}
}

utilsHelper.AppError = AppError;
module.exports = utilsHelper;

3. Add error handling
   Error handling

Step 3.0
Copy

---

to: app.js
inject: true
at_line: 0

---

const { sendResponse, AppError } =require("./helpers/utils.js")
Step 3.1
Add error handling

Create a function to catch a request that do not match any previous routes. Create an error with 404 and message.

Go to app.js add

## Copy

to: app.js
inject: true
before: module.exports

---

// catch 404 and forard to error handler
app.use((req, res, next) => {
const err = new AppError(404,"Not Found","Bad Request");
next(err);
});
Customize express error handling by using 4 args controller. This controller will be execute when ever error are throw .Error by AppError throw will have errorType and isOperational while uncaught system error throw by system will have Internal Server Error type.

## Copy

to: app.js
inject: true
before: module.exports

---

/_ Initialize Error Handling _/
app.use((err, req, res, next) => {
console.log("ERROR", err);
return sendResponse(
res,
err.statusCode ? err.statusCode : 500,
false,
null,
{ message: err.message },
err.isOperational ? err.errorType : "Internal Server Error"
);
});

4. Create template route
   Step 4.0
   Making the route - controller template for operation

Go to index.js using sendReponse and AppError

## Copy

to: routes/index.js
inject: true
at_line: 0

---

const { sendResponse, AppError}=require("../helpers/utils.js")
Step 4.1
Adding the route and controller

## Copy

to: routes/index.js
inject: true
before: module.exports

---

router.get("/template/:test", async(req,res,next)=>{
const { test } = req.params
try{
//turn on to test error handling
if(test==="error"){
throw new AppError(401,"Access denied","Authentication Error")
}else{
sendResponse(res,200,true,{data:"template"},null,"template success")
}
}catch(err){
next(err)
}
})

5. Define foo schema & model
   STEP 5.0
   Create Foo.js module in models/

## Copy

## sh: mkdir models && touch models/Foo.js

STEP 5.1
Define schema

## Copy

## to: models/Foo.js

const mongoose = require("mongoose");
//Create schema
const fooSchema = mongoose.Schema(
{
name: { type: String, required: true },
flag: { type: Boolean, enum: [true, false], require: true },

},
{
timestamps: true,
}
);
//Create and export model
STEP 5.2
Create and export model so that this could be use across the project

## Copy

to: models/Foo.js
inject: true
after: export model

---

const Foo = mongoose.model("Foo", fooSchema);
module.exports = Foo;

6. Create template controller
   Here is a guide for create basic crud controllers

Step 6.0
Create foo.controllers.js module in controllers/

## Copy

## sh: mkdir controllers && touch controllers/foo.controllers.js

Step 6.1
Copy

---

## to: controllers/foo.controllers.js

const { sendResponse, AppError}=require("../helpers/utils.js")

const Foo = require("../models/Foo.js")

const fooController={}
//Create a foo
//Get all foo
//Update a foo
//Delete foo
Step 6.2
Create foo

## Copy

to: controllers/foo.controllers.js
inject: true
after: \/\/Create a foo

---

fooController.createFoo=async(req,res,next)=>{
//in real project you will getting info from req
const info = {
name:"foo",
flag:false
}
try{
//always remember to control your inputs
if(!info) throw new AppError(402,"Bad Request","Create Foo Error")
//mongoose query
const created= await Foo.create(info)
sendResponse(res,200,true,{data:created},null,"Create Foo Success")
}catch(err){
next(err)
}
}
Step 6.3
Get foos

## Copy

to: controllers/foo.controllers.js
inject: true
after: \/\/Get all foo

---

fooController.getAllFoos=async(req,res,next)=>{
//in real project you will getting condition from from req then construct the filter object for query
// empty filter mean get all
const filter = {}
try{
//mongoose query
const listOfFound= await Foo.find(filter)
sendResponse(res,200,true,{data:listOfFound},null,"Found list of foos success")
}catch(err){
next(err)
}
}
Step 6.4
Update a foo (by id)

## Copy

to: controllers/foo.controllers.js
inject: true
after: \/\/Update a foo

---

fooController.updateFooById=async(req,res,next)=>{
//in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as \_id to avoid duplication
//you will also get updateInfo from req
// empty target and info mean update nothing
const targetId = null
const updateInfo = ""

    //options allow you to modify query. e.g new true return lastest update of data
    const options = {new:true}
    try{
        //mongoose query
        const updated= await Foo.findByIdAndUpdate(targetId,updateInfo,options)

        sendResponse(res,200,true,{data:updated},null,"Update foo success")
    }catch(err){
        next(err)
    }

}
Step 6.5
Delete a foo (Hard delete)

## Copy

to: controllers/foo.controllers.js
inject: true
after: \/\/Delete foo

---

fooController.deleteFooById=async(req,res,next)=>{
//in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as \_id to avoid duplication

    // empty target mean delete nothing
    const targetId = null
    //options allow you to modify query. e.g new true return lastest update of data
    const options = {new:true}
    try{
        //mongoose query
        const updated= await Foo.findByIdAndDelete(targetId,options)

        sendResponse(res,200,true,{data:updated},null,"Delete foo success")
    }catch(err){
        next(err)
    }

}
//export
Step 6.6
Export the model module

## Copy

to: controllers/foo.controllers.js
inject: true
after: \/\/export

---

module.exports = fooController

7. Create template route
   Step 7.0
   Create foo api in routes

## Copy

## sh: touch routes/foo.api.js

Step 7.1
Copy

---

to: routes/foo.api.js
inject: true
at_line: 0

---

const express= require("express")
const router = express.Router()
const {createFoo, getAllFoos, updateFooById ,deleteFooById} = require("../controllers/foo.controllers.js")

//Read
//Create
//Update
//Delete
Step 7.2
Create endpoints for basic Read with informative route information

## Copy

to: routes/foo.api.js
inject: true
after: \/\/Read

---

/\*\*

- @route GET api/foo
- @description get list of foos
- @access public
  \*/
  router.get("/",getAllFoos)
  Step 7.3
  Create endpoints for basic Create with informative route information

## Copy

to: routes/foo.api.js
inject: true
after: \/\/Create

---

/\*\*

- @route POST api/foo
- @description create a foo
- @access public
  \*/
  router.post("/",createFoo)
  Step 7.4
  Create endpoints for basic Update with informative route information

## Copy

to: routes/foo.api.js
inject: true
after: \/\/Update

---

/\*\*

- @route PUT api/foo
- @description update a foo
- @access public
  \*/
  router.put("/:id",updateFooById )
  Step 7.5
  Create endpoints for basic Delete with informative route information

## Copy

to: routes/foo.api.js
inject: true
after: \/\/Delete

---

/\*\*

- @route DELETE api/foo
- @description delet a foo
- @access public
  \*/
  router.delete("/:id",deleteFooById)

//export
Step 7.6
Export the routes

## Copy

to: routes/foo.api.js
inject: true
after: \/\/export

---

module.exports= router
Step 7.7
Add foo api to index routes

## Copy

to: routes/index.js
inject: true
before: module.exports

---

const fooRouter = require("./foo.api.js")
router.use("/foo",fooRouter)

9.1 - 9.2 Define boo schema & model
Step 9.0
Create Boo.js module in models/

## Copy

## sh: touch models/Boo.js

Step 9.1
Define schema

## Copy

## to: models/Boo.js

const mongoose = require("mongoose");
//Create schema
const booSchema = mongoose.Schema(
{
name: { type: String, required: true },
description: { type:String, required:true},
referenceTo:{type: mongoose.SchemaTypes.ObjectId, ref: "Foo"} //one to one optional
},
{
timestamps: true,
}
);
//Create and export model
Step 9.2
Create and export model so that this could be use across the project

## Copy

to: models/Boo.js
inject: true
after: export model

---

const Boo = mongoose.model("Boo", booSchema);
module.exports = Boo;

9.3 Create and Read with relationship controllers
Here is a guide for create basic crud controllers

STEP 9.3.0
Create boo.controllers.js module in controllers/

## Copy

## sh: touch controllers/boo.controllers.js

STEP 9.3.1
Copy

---

## to: controllers/boo.controllers.js

const { sendResponse, AppError}=require("../helpers/utils.js")

const Boo = require("../models/Boo.js")

const booController={}
//Create a boo
//Get all boo
STEP 9.3.2
Create boo

## Copy

to: controllers/boo.controllers.js
inject: true
after: \/\/Create a boo

---

booController.createBoo=async(req,res,next)=>{
//in real project you will getting info from req
const info = {
name: "any",
description: "any boo",
}
try{
//always remember to control your inputs
if(!info) throw new AppError(400,"Bad Request","Create Boo Error")
//in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process
//mongoose query
const created= await Boo.create(info)
sendResponse(res,200,true,{data:created},null,"Create boo Success")
}catch(err){
next(err)
}
}
//updateboo
Add reference to boo

## Copy

to: controllers/boo.controllers.js
inject: true
after: \/\/updateboo

---

booController.addReference=async(req,res,next)=>{
//in real project you will getting info from req
const {targetName}= req.params
const {ref} = req.body
try{
//always remember to control your inputs
//in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process
let found = await Boo.findOne({name:targetName})
//add your check to control if boo is notfound
const refFound = await Foo.findById(ref)
//add your check to control if foo is notfound  
 found.referenceTo=ref
//mongoose query
found = await found.save()
sendResponse(res,200,true,{data:found},null,"Add reference success")
}catch(err){
next(err)
}
}
STEP 9.3.3
Get boos

## Copy

to: controllers/boo.controllers.js
inject: true
after: \/\/Get all boo

---

booController.getAllBoos=async(req,res,next)=>{
//in real project you will getting condition from from req then construct the filter object for query
// empty filter mean get all
const filter = {}
try{
//mongoose query
const listOfFound= await Boo.find(filter).populate("referenceTo")
//this to query data from the reference and append to found result.
sendResponse(res,200,true,{data:listOfFound},null,"Found list of boos success")

    }catch(err){
        next(err)
    }

}
//export
STEP 9.3.4
Export the model module

## Copy

to: controllers/boo.controllers.js
inject: true
after: \/\/export

---

module.exports = booController

9.4 Apply boo route
Step 9.4.0
Create boo api in routes

## Copy

## sh: touch routes/boo.api.js

Step 9.4.1
Copy

---

to: routes/boo.api.js
inject: true
at_line: 0

---

const express= require("express")
const router = express.Router()
const {createBoo, getAllBoos} = require("../controllers/boo.controllers.js")

//Read
//Create
//Update
Step 9.4.2
Create endpoints for basic Read with informative route information

## Copy

to: routes/boo.api.js
inject: true
after: \/\/Read

---

/\*\*

- @route GET api/boo
- @description get list of boos
- @access public
  \*/
  router.get("/",getAllBoos)
  Step 9.4.3
  Create endpoints for basic Create with informative route information

## Copy

to: routes/boo.api.js
inject: true
after: \/\/Create

---

/\*\*

- @route POST api/boo
- @description create a boo
- @access public
  \*/
  router.post("/",createBoo)

/\*\*

- @route PUT api/boo
- @description update reference to a boo
- @access public
  \*/
  router.put("/targetName",addReference)

//export
Step 9.4.4
Export the routes

## Copy

to: routes/boo.api.js
inject: true
after: \/\/export

---

module.exports= router
Step 9.4.7
Add boo api to index routes

## Copy

to: routes/index.js
inject: true
before: module.exports

---

const booRouter = require("./boo.api.js")
router.use("/boo",booRouter)
