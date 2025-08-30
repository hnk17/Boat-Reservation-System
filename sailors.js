exports.add = function(db, obj, cb){ //done
    let sql = 'Call SailingAdventure.AddSailors(?,?,?,@msg); Select @msg';
    let values = [obj.S_name, obj.B_date, obj.Rate];
    
    db.query(sql, values,(err,results)=>{
        if(err) throw err;
        console.log(results[1][0]['@msg']);
        cb(200, results[1][0]['@msg']);
    });
}


exports.display = function(db,cb){
    if (typeof cb !== 'function') {
        console.error('Error display Sailors');
        return; 
    }
    let sql = 'Select * from sailors';
    db.query(sql, (err,results)=>{
        if (err) throw err;
        cb(200, results);
    });
}

exports.displaySailorsOlder = function(db, obj, cb){
    if (typeof cb !== 'function') {
        console.error('Error displaySailorsOlder');
        return;  // or handle the error in another way
    }

    let sql = 'Call SailingAdventure.GetSailorsOlder(?);';
    let values = [obj.age];
    db.query(sql, values,(err,results)=>{
        if(err) throw err;
        console.log(results[0]);
        cb(200, results[0]);
    });
}

exports.displaySailorsYounger = function(db, obj, cb){
    if (typeof cb !== 'function') {
        console.error('Error displaySailorsYounger');
        return;  // or handle the error in another way
    }

    let sql = 'Call SailingAdventure.GetSailorsYounger(?);';
        let values = [obj.age];
        db.query(sql, values,(err,results)=>{
            if(err) throw err;
            console.log(results[0]);
            cb(200, results[0]);
        });
}

// private function to check if Sailor ID from qs exists
function checkSailorID(db, S_Id, cb) { 
    let sql = 'SELECT COUNT(*) AS c FROM Sailors WHERE S_Id = ?';
    let value = [S_Id];

    db.query(sql, value, (results) => {
        const c = results[0].c;
        if (c > 0) {
            cb(true);
        } else {
            cb(false);
        }
    });
}

//Updates/deletions for any of the tables should be done to a single row, 
//and the update/deleted row should be identified by its primary key
//if id exists check if the key(name,etc) exists
exports.update = function(db, obj, cb){
    let s = checkSailorID(db, obj.S_Id);
    if (s === true){
        if (obj.S_name !== undefined){
            let sql = 'UPDATE Sailors SET S_name=? WHERE S_Id =? ';
            let values = [obj.S_name, obj.S_Id];
            
            db.query(sql, values, (err)=>{
                if (err){
                    console.error(err);
                    cb(400,"Error fulfilling SQL");
                } else {
                    cb(200,"Update is successful");
                }});
        }
        if (obj.B_date !== undefined){
            let sql = 'UPDATE Sailors SET B_date=? WHERE S_Id =? ';
            let values = [obj.B_date, obj.S_Id];

            db.query(sql, values, (err)=>{
                if (err){
                    console.error(err);
                    cb(400,"Error fulfilling SQL");
                } else {
                    cb(200,"Update is successful");
                }});
        }
        if (obj.Rate !== undefined){
            let sql = 'UPDATE Sailors SET Rate=? WHERE S_Id =? ';
            let values = [obj.Rate, obj.S_Id];
            
            db.query(sql, values, (err)=>{
                if (err){
                    console.error(err);
                    cb(400,"Error fulfilling SQL");
                } else {
                    cb(200,"Update is successful");
                }});

        } else {
            cb(400, 'Record not found');
        }
        
        };
    } 

exports.delete = function(db, obj, cb){
    let sql = 'DELETE FROM Sailors WHERE S_Id = ? ';
    values = [obj.S_Id];
   
    db.query(sql, values, (err)=>{
        if (err) {
            cb(400, 'Error fulfilling SQL');
        } else {
            cb(200, 'OK');
        }
    });
}