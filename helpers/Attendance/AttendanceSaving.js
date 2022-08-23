/**
 * save data on data base
 * @param {*this data is model of database} data 
 * @returns 
 */
 function saveAttendance(req,collection) {


    return new Promise((resolve, reject) => {
        collection.find({ Name: search })
            .skip(from)
            .limit(5)
            .exec((err, resp) => {

                if (err) {
                     reject('error al cargar asistencia', err)
                } else {

                    resolve(resp)
                }

            });

    });




}
module.exports = saveAttendance
