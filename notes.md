


App.use is to include more middlewares , same we will use in router.use to include the middlewares as well
app.use will include middleware for all the api on the file

app.use also helps us in mouting the router 
ex : app.use("/url" , router_name) -> will mount the router

one another way , is what we say in express_index.js in 14_client_server
ex : app.get(url, [middlewares] , (req,res)=>{})


Generally we have ORM and ODM 
we can separate Node based ORM , Rails based ORM etc. based on the tech stack we are using.
ORM - is for SQL. Multiple are there , we will be using sequelize 
ODM - is for NO SQL

sequelize - for this we also need a driver , to tell it to which relational db it is going to connect .
            ex : mariadb , sqlite3
            After installing drivers also , we have to do lot of coding on order to setup the ORM
            in order to avoid thet we can use a library sequelize pacakage sequelize-cli
            `https://github.com/sequelize/cli `(check the commands in usage seciton)
            `https://sequelize.org/docs/v6/core-concepts/model-basics/`

Our implementation is inside src folder 
so there is a command sequelize init , which does some init stuff
so we will run "`npx sequelize init`" inside src folder (npm is package manager , npx is package executer)
To which it says : 
Created "config/config.json"
Successfully created models folder at "/Users/prateekramani/javascript/16_Base_NODE_JS_Template/src/models".
Successfully created migrations folder at "/Users/prateekramani/javascript/16_Base_NODE_JS_Template/src/migrations".
Successfully created seeders folder at "/Users/prateekramani/javascript/16_Base_NODE_JS_Template/src/seeders".
             
config.json - gives us 3 databases env :  developement , test , production env 
            it picks up the host , on which database is hosted 
            password - we need to mention it , if it is there , same for username
            until and unless we are working on default port , we dont need to mention it 
            dialect , it will tell us which relational database it is going to connect to - mysql

            and since this file has sensitive info , we will hide it , by putting it in gitignore 

seeders - seeders is used to inject the starting data in the db 

migrations - to do version control of our database
            for us these will be js files , in which we will write how to maintain the version in DBs
            sequelize migration:generate or  sequelize migration:create


Creation of Model 
`npx sequelize model:create --name Airplane --attributes modelNumber:string,capacity:integer`  
(run inside source folder)

New model was created at /Users/prateekramani/javascript/17/NodeJS-Base-Template/src/models/airplane.js .
New migration was created at /Users/prateekramani/javascript/17/NodeJS-Base-Template/src/migrations/20230602132447-create-airplane.js .

This doesnt creates table inside DB , only model and migration is added 
migration are like git add , (git push is not done yet)

In migration we have queryInterface , via which we can write the raw query to make changes in SQL databse 

There are two types of contraints we can put 
    via JS
    via DB model

If we are making any separate changes in model those are at JS level constraint 
If we are making any separate changes in migration then those are at DB level constraint

`npx sequelize db:migrate` - applies all the pending migration , which it is able to track via uniuque num file created in migration folder.
This creates table inside DB
It also creates SequelizeMeta table , which contains the last migration applied 

We can undo the migration as well
`npx sequelize db:migrate:undo`

whenever we do migrate , async up() function of migration file is applied ,
whenever we do migrate:undo , async down() function of migration file is applied ,

Migration can  : 
1.) add a table 
2.) alter a table 
As soon as we do another model generate , another migration file will be created 

If we add Default attribute only in migration file , then it will be only added in db 
default value wont come from JS 

If we make changes to our model, then we should we take a migration of it 
else if we dont create a model, we will see the changes at JS level but not at DB level 

We shouldn't make any changes in older migration

`npx sequelize db:create`



why do we need to use logger in everyfile ?
    firstly , so that we can have a track of error stack. (this we can get it fix with the help of error stack)

so , no we have create a appError class , extending error class , so that all the errors can be consistent 
(normally we dont have anything as "explanation" in normal error class , but here we designed it amd embedded in each and every file , so that consistenct is there)
and to check where it failed  , we can use errorstack
Likewise we can also have separate Validation error , in which we can design a custom error message

Why do we need validation check in backend , it can be in Frontend also
    What if call came from some other backend 
    from Postman
    from a mobile app , where validation check is not there in the frontend



Moreover we can also create a common JSON for all the error messages , like we are doing for HTTP codes
this will be help in multiple-languaze projects 
will reduce redundancy (Something went wrong at multiple places)


We have `npx sequelize seed:generate --name add-airplanes` 
New seed was created at /Users/prateekramani/javascript/17/NodeJS-Base-Template/src/seeders/20230605153430-add-airplanes.js .

 `npx sequelize db:seed:all`         Run Async up function

 And all of the data will be inserted 

 We can also seed only a particular file 


 `npx sequelize db:seed:undo:all` - Run Async down function



 # 3 interesting problem might come in between while bokkinh
    Two people try to book same tickets at the same time
    Two people try to book at the same time , and only one ticket was there
    Request for payment but :
        Payment failed and gatewatway sent the response
        Payment failed and gatewatway was not able to sent the response 
        didnt even reach the payment serivce
        Payent succeeded but gatewatway was not able to sent the response 
        In last case even if we retried , payment will be deducted twice 


Database Transaction
In real life situtaions , we need to execute series of queries to accomplish a task 
We might do a club of CRUD operations 
These series of operations can execute a single unit of work for our product, hence these series of 
operations are called as database transaction

During the transaction execution our Db might go through a lot of changes , and can be in an inconsistent
intermediate state

Why is this set called transaction , beacuse if something fails , then whole of the trasctions fails or pass
in order to avoid Db being in inconsistent intermediate state , DB has 4 properties , 
ACID - Atomicity , Consistency , Isolation , Durability
 

# Atomicity 
A transaction is a bundle of statements that intents to achieve one final state, when we are 
attempting a transaction, we either want to complete all the statement or none of them , we never want 
an internmidiate state . this is called as Atomicity.
# States of a transaction 
Begin - when the transaction starts
Commit - All the changes are applied successfully
Rollback - Something happened in between , then whatever changes were successful will be reverted.

From begin state  - it goes to Commit state or Rollback state , nowhere in between

# Consistency
Data stored in the Db is always valid and in a consistent state 
ex : There shouldn't be a situation where non-null column should have a null value 
or primary key column has a dublicate value 

# Isolation
It is an ability of multiple transaction to execute without interferring with one another
ex: T1 (Transaction one) made a change in a row 
now T2 went and read that row data 
T1 failed in the end , and so rollbacked (so the row data got changed)
Conculsion - T2 read the wrong the data
or 
T1 and T2 are appling the changes to a same row

# Durability
If the db crashes , then the Db should be durable enough to store the records 

If we are running trasaction is sequence , then no problem would occur 
but , we wont be utilizing the CPU to the fullest 
and the execution will become slow 

but if we are haviing interweaving (Transaction running not in order)
then we have execution Anomalies 
    - Read Write conflict - T1 read some data (haven't commited yet), T2 also read the same value and made the change and commited, so now the value T1s read value dosent makes sense
                        
    - Write Read conflict (Dirty Read) - T1 read the data and updated it (didnt commit), T2 read the updated data and further updated it , now T1 aborts and rollbacks  , so T2 had read a uncommited/dirty data 

    - Write Write conflict - T1 write the data and not commited it , T2 write the data 1 and data 2 and not commited , now T1 is writing that data 2 again , since it didnt knew about the T2 update as T2 had not commited . This is over-writing uncommited data 


How Databases ensure Atomicity ?
First way - Logging - DBMS logs all the action it is doing so that later it can undo it , thse logs can be maintained in memory or disk 

Second way - Shadow paging - DBMS makes copies of actions and then this copy is initially consider as a temporary copy .If txn succeeds , then it starts pointing to the new temporary copy. This copy can be maintained anywhere 

Logging is most prefereed mechanism to ensure Atomicity 

Transaction - beginning state ----> Commited state (changes applied) , Rollback State (something wrogn happen)


Atomicity of Mysql
after each commit or rollback , database remains in a consistent state 
in order to handle rollback - we have undo logs , redo logs

# undo log -
this log contains records about how to undo the last change done by the txn .if any other txn need the 
orignal data as a part of consistent read operation , the unmodified data is retieved from the undo logs 

# redo log -
by definintion redo log is a disk based data structure used for crash recovery to correct data written by incomplete transaction . The changes which could make it upto the data files before the crash or any other reasons are replayed automatically during restart of server after crash
Changes which were done just before the crash

Read about Isolations and its levels :
https://en.wikipedia.org/wiki/Isolation


# levels of Isolation
# Read Uncommited 
Almost no isolation level 
it reads the latest uncommited value at any step that can be updated from other uncommited txn
Dirty Reads are possible 
But , this will be fast 

# Read Commited 
dirty read is avoided (reading uncommited data) , because any uncommited changes are not visible to any other trasaction until we commit 
In this level , each Select statement will have it own snapshot of the data which can be probelematic if we execute same Select again , because , some other txn might commit and update , and we will see a new data in the second Select


# Reapeatable Read
A snapshot of Select is taken first time it runs during a txn , and same snapshot is used throughtout the txn when same Select is selected 
A txn running at this level does not take into account any changes to data made by other txn , (any other txn is updating data , then also select of T1 remains same)
But this brings phantom read problem ie new row can exist in between txn which was not before 

# Serializable 
It completely isolates the effect of one txn from other
it is a repeatable read with more isolation to avoid phantom read 



# Durability 
The DB should be durable enough to hold all the latest updates even if system fails or restarts 
If a txn updats a chunk of data in Db and commits . the Db will hold the new data 
If the txn commits , but the system fails , before data could be written , then data should be written back when the system restarts 

InnoDb -  Storage System can be understood as a layer between the DBMS and the actual Disk using which all the corresponding queries are being executed   

# Consistency 
Consistenct in InnoDb involves protecting data from crashes and maintain data integrety and consistency 
2 main features :
Double Write Buffer 
Crash Recovery

Page - is a unit that specifies how much data can be transferred disk and the memory
    It can contain one or more rows , if one row dosen't fits in the page, InnoDb sets up additional pointers style data structures so that whole info of one row can go in a page 

Flush - When we write something to the DB it is not written instanly for performance reasons in mySQL instead stores that in memory or disk storage 
InnoDB storage structures that are periodically flushed include redo logs , undo logs , and buffer pool
Flushing can happen because memory area can get full , and system needs to free some space because if there is a commit involved then txn has to finalized 

# Doble Write buffer - 
storage area where InnoDb writes pages flushed from buffer pool before writing the pages to their positions in theit data files . 
If a system crashes in middle of a page write InnoDb can find a good copy from Doble Write buffer

Basically it's a temporary storage area where all the changes persisi , and slowly one by one they are written in data file 

# Crash Recovery - 
InndoDb recovers via logs (undo or redo)


This is how MySQL implements ACID .

Transactions in Sequqlize does that for us - via Unmanaged and Managed Transaction 

# Race condition
When two or more different entities try to access same resource 
For this mysql provides Locking mechanism to avoid it 
Some types of Locks:
`Shared Locks` - This allows multiple txn to read data at the same time but restricts any of them from writing 

`Exclusive Locks` - This prevents txn from reading or writing the same data at same time 

`Intent Locks` - This is use to specify that a txn is planning to read or write a certain section of data 

`Row - level Locks` - This allows txn to lock only a specific row 

All the locks apart from Row - level Locks , locks the enire table 

MySQL is a `MVCC` database - ie `multi version concurrency control`
and it is compatible to allow multiple txn to read and write same data without any conflict 
How ?
every txn in mySQL captures the data , it is about to modify at start of txn and writes the changes in entire diff version of data 
This allows txn to continue working with orignal data without conflict

So for our Booking System 
when tow different users are booking same room , we can have 2 mechanism
- Pessimistic Concurrency Control 
    set the txn serializable (to make txn go one after another)
    implement row level lock (Select * from  table where ... For Update )

- Optimistic Concurrency Control
    put manual checks for conflict before commiting the change , (check the remaining seats count before commiting  booking txn everytime)


Here while Booking Service , there will be a inter service connection between Bokking service and Flight Service
Since both of them are running on separate server , we will make use of Axios to make a inter service connection

Why is there a inter service connection b/w Booking and Flight Service ?
- As when we do a Booking, 
    we need to get the price of each flight from the Flight Service 
    we need to update the remaining seats in the flight model (reduce the amount of Flights booked by the user)


Since While Booking is more about Reading Flights is a heavier operation than Booking a Flight , so we are making 2 service , so that we can scale them differently as per our need 
plus , Booking service can used by some other project also



3 major problems were 
- concurrency (1 & 2) (bokking same seats by 2 person and only 1 seat left) = handled by locks and transactions
- last problem is retring payemnt - soln is to try tcp connection , because Tcp is a reliable connection and we definately get the response back 

But what if we get the response as processing and we never get the processing completed notification, in this case also users end up doing double transactions 

There can be situtaion like , somehow , User initiates 2 payment request for the same booking (and money got deducted twice)

There is a concept called as idempotency - it is a property of certain operations in Maths and CS where they can be applied multiple times without chanigng the result beyond first successful application

This means , if first request is successfull , and same request is sent again , then it will be ignored or will have no effect 

From here we get concept of Idempotent APIs , (after first successful request , no other request make sense (will be ignored)) , so for only one time ,if everything wents well, payment will be deducted 

This process will need idempotency key to be sent via request body from the client , which will be saved in the server somewhere after the use
And before using this key , we will check whether its already saved or not , if it were already saved that means one successful call has already happened (payment is already done) , so no repeat request 
else if key is not there , then one the code executed , key is stored  

And if we are not getting any idempotency key , then also we will not allow request to be proceed 


- in the request header we can have the idempotency key - with unique value
This key and value can be written manaully , or taken help of UUID package in Node

- npm install uuid

- idempotency key can be stored in DB , for faster implementation , it can be stored in Cache Redis , or some internal memory object (in case of internal memory object , object will be deleted as soon as server stops)

# Notes for API Gateway Project 

Similar to triggers , we have Hooks in Sequelize 
Which can used while creating the user , we can encrypt the password by addind the hook
Hook can be added in the User Model, or we can write User.addhook in the same model file
For that we will be using bCrypt
User.beforeCreate is like a Hook in Api Gateway Project


Authentication and Authorization
Authentication - means who are you ?
Authorization - what can you do 

`Passport.Js` is one of the famous package to establish authentication

we will be doing Jwt (JSON web toekn) authentication 

- Steps in JWT Authentication
User send the request sending (mail , password) to servers (User controller).
Server controller decides to forward it to User service by checking , 
Whether User exixts or not with coressponding email id , if not , we throw error User not FOund
whether the pwd is valid or not If pwd is not valid ,we will direclty throw the error 
if pwd is valid , we generate the JWT token (secret token) , and send it back to the user 
and the User on the client side stores the JWT token in ex Cookie 

Why do we need to store the token ?
so that inside the request header , we can have something like `x-access-token` as jwt token , send it to the server
Now the controller will first check if Jwt is there 
If not , throw error 
If yes , we verify JWT token via package , if its valid , then Businees Logic is executed 

This process can be followed for all the auth based API/resources , inside the middleware only 
We can also expire the JWT token.
`https://jwt.io`

JSON web token is the package , we'll use

`npm i jsonwebtoken`


`npm i express-rate-limit` - rate limiter 

- Forward Proxy
Forward Proxy sits between a client and the internet .
Client requests a resource, from the internet through forward proxy which acts as an intermediate layer

Why to use it ?
Filterration of request logic can be done before only 
Catching control can be done 
Access Control can be done , so that not every api is accessible to the user 
User anomility - if we dont want to expose the ip to the user , then forward proxy raise the request on the behalf of user to the corresponding IP

Disadvantages 
Complex to develop.
if it fails (in case of a lot request being sent and we haven't scaled it), no request can be forwarded , as it is a single point entry.
Introducing a new layer might come with latency.


- Reverse Proxy
Sits between internet and servers , such that when the request goes from client to internet , post that it should go to reverse proxy , and then to the servers 
Also , the response from server first goes to proxy and then to client
It helps us to protect the origin server from direct client access.
Sometimes it helps in load balancing as well

Disadvantages - same as above 

Nginx is one common already built reverse proxy

We will make a custom reverse proxy by installing a package 
`npm i http-proxy-middleware`

Lets say user sent request to localhost:3000/api/vi/flights
SO we will define a API Gateway , localhost:5000 which will then make the call to localhost:3000/api/vi/flights or 
localhost:4000/api/vi/flights-booking

