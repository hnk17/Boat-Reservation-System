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

// add to reserve table
exports.add = function(db, obj, cb){
    let s = checkSailorID(db, obj.S_Id);
    let b = checkBoatID(db, obj.B_Id);

    if(s === true && b === true){
        let sql = 'Call SailingAdventure.AddSailors(?,?,?,@msg); Select @msg';
        values = [obj.S_Id, obj.B_Id, obj.Day];
        
        db.query(sql, values,(err,results)=>{
            if(err) throw err;
            console.log(results[1][0]['@msg']);
            cb(200, results[1][0]['@msg']);
        });
    }else{
        cb(404, "One or more IDs do not found.")
    }
}

// display: S_Id, S_Name, B_Id, B_name Day
exports.display = function(db, cb){
    let sql = 'SELECT reserves.S_Id, S_Name, reserves.B_Id, B_name, Day FROM Reserves JOIN Sailors ON Reserves.S_Id = Sailors.S_Id JOIN Boats ON Reserves.B_Id = Boats.B_Id;';
    db.query(sql, (err,results)=>{
        if (err) throw err;
        cb(200,results);
    });
}

exports.displayReservesBefore = function(db, obj, cb){
    let sql = 'Call SailingAdventure.GetReserveBoatsBefore(?);';
    let values = [obj.date];
    db.query(sql, values,(err,results)=>{
        if(err) throw err;
        console.log(results[0]);
        cb(200, results[0]);
    });
}

exports.displayReservesAfter = function(db, obj, cb){
    let sql = 'Call SailingAdventure.GetReserveBoatsAfter(?);';
    let values = [obj.date];
    db.query(sql, values,(err,results)=>{
        if(err) throw err;
        console.log(results[0]);
        cb(200, results[0]);
    });
}

exports.delete = function(db, obj, cb){
    let sql = 'DELETE FROM Reserves WHERE $(obj) = ? AND B_Id = ? AND Day = ?';
    let values = [obj.S_Id, obj.B_Id, obj.Day];
   
    db.query(sql, values, (err, results)=>{
        if (err) throw err;
        cb(200,"OK");
    });
}