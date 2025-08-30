exports.add = function(db, obj, cb){ 
    let sql = 'INSERT INTO Boats(B_name, Type) VALUES(?,?)';
    let values = [obj.B_name, obj.Type];
    
    db.query(sql, values, (err)=>{
        if (err){
            cb(400,"Error fulfilling SQL");
        }else{
            cb(200,"OK");
        }
    });
}

//CALL GetBoatCountByType('YourBoatType', @count);
exports.display = function(db, cb){
    if (typeof cb !== 'function') {
        console.error('Error display');
        return; 
    }
    let sql = 'SELECT * FROM Boats';
    db.query(sql, (err,results)=>{
        if (err) throw err;
        cb(200, results);
    });
}

exports.displayBoatsByType = function(db, obj, cb){
    let sql = 'Call SailingAdventure.GetBoatsByType(?);';
    let values = [obj.type];
    
    db.query(sql, values,(err,results)=>{
        if(err) throw err;
        console.log(results[0]);
        cb(200, results[0]);
    });
}

exports.displayCountsOfBoatType = function(db, obj, cb){
    let sql = 'Call SailingAdventure.CountBoatsByType(?, @cnt); Select @cnt';
    let values = [obj.type];

    db.query(sql, values,(err,results)=>{
        if(err) throw err;
        console.log(`The number of boats of ${obj.type} type is ${results[1][0]['@cnt']}`);
        cb(200, results[1]['@cnt']);
    });
}

// private function to check if Boat ID from qs exists
function checkBoatID(db, B_Id, cb) {
    let sql = 'SELECT COUNT(*) AS c FROM Boats WHERE B_Id = ?';
    let value = [B_Id];

    db.query(sql, value, (results) => {
        const c = results[0].c;
        if (c > 0) {
            cb(true);
        } else {
            cb(false);
        }
    });
}

exports.update = function(db, cb){
    let b = checkBoatID(db, obj.B_Id);
    if (b === true){
        if (obj.B_name !== undefined){
            let sql = 'UPDATE Sailors SET B_name=? WHERE S_Id =? ';
            let values = [obj.B_name, obj.B_Id];
            
            db.query(sql, values, (err)=>{
                if (err){
                    console.error(err);
                    cb(400,"Error fulfilling SQL");
                } else {
                    cb(200,"Update is successful");
                }});
        }
        if (obj.Type !== undefined){
            let sql = 'UPDATE Sailors SET Type=? WHERE B_Id =? ';
            let values = [obj.Type, obj.B_Id];

            db.query(sql, values, (err)=>{
                if (err){
                    console.error(err);
                    cb(400,"Error fulfilling SQL");
                } else {
                    cb(200,"Update is successful");
                }});
        }else {
            cb(400, 'Record not found');
        }
}}

exports.delete = function(db, obj, cb){
    let sql = 'DELETE FROM Boats WHERE B_Id = ? ';
    values = [obj.B_Id];
   
    db.query(sql, values, (err)=>{
        if (err) {
            cb(400, 'Error fulfilling SQL');
        } else {
            cb(200, 'OK');
        }
        
    });
}