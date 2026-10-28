/*
* Description: Incorporating Business Logic Using MySQL Stored Procedures
* Name: Kylie Hoang
*/

const mysql = require('mysql2');
const http = require('http');
const {URL} = require('url');
const sailors = require('./lib/sailors.js');
const boats = require('./lib/boats.js');
const reserves = require('./lib/reserves.js');

//initialize the connection object
const db= mysql.createConnection({
    host : "localhost",
    user : "root", 
    password: "bread",
    database: "sailingAdventure",
    multipleStatements: true,
    });

//Check the status of the connection
db.connect((err)=>{
if (err) throw err;
console.log("Connected!!");
});

//create database
let sql = 'CREATE DATABASE IF NOT EXISTS SailingAdventure';
db.query(sql,(err)=>{
if (err){
    console.log('error: ', err.message);
} else{
console.log('Database Created');
}
});

//select database to use
let dbSelect = 'USE SailingAdventure'
db.query(dbSelect,(err)=>{
if (err){
    console.log('error: ', err.message);
} else {
    console.log('Database SailingAdventure Selected.');
}
});

//create sailors database table
let sailors_table = `CREATE TABLE Sailors(
S_Id INT AUTO_INCREMENT PRIMARY KEY,
S_name VARCHAR(25) NOT NULL,
B_date DATE NOT NULL,
Rate INT NOT NULL)`;

db.query(sailors_table, function(err){
if (err) {
console.log('Error: ', err.message);
} else {
console.log('Sailors Table Created.');
}
});

//create boats database table
let boats_table = `CREATE TABLE Boats(
B_Id INT AUTO_INCREMENT PRIMARY KEY,
B_name VARCHAR(50) NOT NULL,
Type VARCHAR(50) NOT NULL)`;

db.query(boats_table, function(err){
if (err) {
console.log('Error: ', err.message);
} else {
console.log('Boats Table Created.');
}
});

//create reserves database table
let reserves_table = `CREATE TABLE Reserves(
S_Id INT NOT NULL,
B_Id INT NOT NULL,
PRIMARY KEY (S_Id, B_Id, Day),
Day DATE NOT NULL,
FOREIGN KEY (S_Id)
    REFERENCES Sailors(S_Id),
FOREIGN KEY (B_Id)
    REFERENCES Boats(B_Id))`;

db.query(reserves_table, function(err){
if (err) {
console.log('Error: ', err.message);
} else {
console.log('Reserves Table Created.');
}
});

////////////////////////////////////////////////////////////////
//format sql date
function formatDate(date) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    const weekday = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
    var day = date.getDate();
    var dayOfWeekIndex = date.getDay();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return weekday[dayOfWeekIndex] + ' ' + monthNames[monthIndex]+ ' ' + day + ' ' + year;
    }

//start server
const serverHandler = function(req, res){
    //1. Creates a new URL object from the request url
    const baseURL = 'http://'+ req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseURL);

    // //2. Get the untrimmed path from the url
    const path = parsedUrl.pathname;
    // const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //3. Get the query string as an object
    const urlquery= parsedUrl.searchParams
    let entries = urlquery.entries();
    const qs = Object.fromEntries(entries);
    
    //4. Get the HTTP method and convert it to uppercase
    const method = req.method.toUpperCase();

    //logic for determining operation recieved in command line arg
    switch(method){

        //////////////////////GET///////////////////////

        case 'GET':
            switch(path){
                case '/sailors':
                case '/sailors/': 
                    sailors.display(db,(statusCode, results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(404);
                            res.end("The table is empty or error has occured.");
                        } else{
                            //format for each date in sql results
                            console.log(results);
                            console.log(typeof results);
                            console.log(statusCode);

                            results.forEach(e => {
                                e.B_date = formatDate(new Date(e.B_date));
                            });
                            
                            //get only values in the sql results
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(sqlStr.join('\n'));
                        }
                    });
                    break;
                
                case '/sailors/older': 
                    sailors.displaySailorsOlder(db, qs,(statusCode,results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(404);
                            res.end("The table is empty or error has occured.");
                        } else{
                            //format for each date in sql results
                            results.forEach(e => {
                                e.B_date = formatDate(new Date(e.B_date));
                            });
        
                            //get only values in the sql results
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(sqlStr.join('\n'));
                        }
                    });
                    break;
                
                case '/sailors/younger': 
                    sailors.displaySailorsYounger(db, qs,(statusCode,results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(404);
                            res.end("The table is empty or error has occured.");
                        } else{
                            //format for each date in sql results
                            results.forEach(e => {
                                e.B_date = formatDate(new Date(e.B_date));
                            });
        
                            //get only values in the sql results
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(sqlStr.join('\n'));
                        }
                    });
                    break;

                case '/boats':
                case '/boats/':
                    boats.display(db,(statusCode,results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(200);
                            res.end("The table is empty or error has occured.");
                        } else{
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(sqlStr.join('\n'));
                        }  
                    });
                    break;

                case '/boats/count':
                    boats.displayCountsOfBoatType(db,qs,(statusCode,count)=>{
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(`The number of groups at the ${qs.type} is ${count}`);
                        
                    });
                    break;

                case '/boats/type':
                    boats.displayBoatsByType(db,qs,(statusCode,results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(200);
                            res.end("The table is empty or error has occured.");
                        } else{
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(sqlStr.join('\n'));
                        }  
                    });
                    break;

                case '/reserves':
                case '/reserves/':
                    reserves.display(db, qs,(statusCode,results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(200);
                            res.end("The table is empty or error has occured.");
                        } else{
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode)
                            res.end(sqlStr.join('\n'));
                        }  
                });
                break;

                case '/reserves/after':
                    reserves.displayReservesAfter(db, qs,(statusCode,results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(200);
                            res.end("The table is empty or error has occured.");
                        } else{
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(sqlStr.join('\n'));
                        }  
                });
                break;

                case '/reserves/before':
                    reserves.displayReservesAfter(db, qs,(statusCode,results)=>{
                        if(results === null || results.length === 0){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(200);
                            res.end("The table is empty or error has occured.");
                        } else{
                            let sqlStr = results.map(e => Object.values(e).join(' '));
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(sqlStr.join('\n'));
                        }  
                });
                break;
            }
            break;

        //////////////////////POST///////////////////////

        case 'POST':
            switch(path){
                case '/sailors/':
                case '/sailors':
                    sailors.add(db, qs,(statusCode, response)=>{
                        if (statusCode === 400){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(400);
                            res.end(response);
                        } else {
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode)
                            res.end(response);
                        }
                });
                break;

                case '/boats':
                case '/boats/':
                    boats.add(db, qs,(statusCode, response)=>{
                        if (statusCode === 400){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(400);
                            res.end(response);
                        } else {
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(response);
                        }
                });
                break;

                case '/reserves':
                case '/reserves/':
                    reserves.add(db, qs,(statusCode,results)=>{
                        res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                        res.writeHead(statusCode);
                        res.end(results);
                });
            }
            break;

        //////////////////////PUT///////////////////////

        case 'PUT':
            switch(path){
                case '/sailors':
                case '/sailors/':
                    sailors.update(db, qs,(statusCode, response)=>{
                        if (statusCode === 400){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(400);
                            res.end(response);
                        } else {
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(response);
                        }
                });
                break;

                case '/boats':
                case '/boats/':
                    boats.update(db, qs, (statusCode, response)=>{
                        if (statusCode === 400){
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(400);
                            res.end(response);
                        } else {
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode);
                            res.end(response);
                        }
                });
                break;

                case '/reserves':
                case '/reserves/':
                    res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                    res.writeHead(400);
                    res.end("Reserves cannot be updated.");
                }
                break;

        //////////////////////DELETE///////////////////////
        
        case 'DELETE':
            switch(path){
                case '/sailors':
                case '/sailors/':
                    sailors.delete(db, qs,(statusCode, response)=>{
                        res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                        res.writeHead(statusCode)
                        res.end(response);
                    });
                    break;

                case '/boats':
                case '/boats/':
                    boats.delete(db, qs,(statusCode, response)=>{
                        res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                        res.writeHead(statusCode)
                        res.end(response);
                    });
                    break;

                case '/reserves':
                case '/reserves/':
                    reserves.delete(db, qs,(statusCode, response)=>{
                            res.setHeader('Content-Type', 'Text/plain; charset = utf-8');
                            res.writeHead(statusCode)
                            res.end(response);
                        });
                        break;
                }
                break;
            }
        }

const server = http.createServer(serverHandler);
server.listen(3000,()=>{
    console.log('Server listenning at port 3000');

});
