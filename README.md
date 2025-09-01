This project demonstrates the relationship between server-side scripting languages and relational database connectivity.
- Connect.js initializes connection to the server, creates database tables for sailor.js/boat.js/reserves.js, calls functions from sailor.js/boat.js/reserves.js, and handles HTTP methods GET/POST/PUT/DELETE
- sailors.js, boats.js, and reserves.js contain functions that call stored procodeures from storedProcedures.txt to retrieve data from their respective database tables created in connect.js
