/**
 * save data on data base
 * @param {*this data is model of database} data 
 * @returns 
 */
function saveRegister(data) {
    return new Promise((resolve, reject) => {
        data.save((err, data) => {
            (err) ? reject(err) : resolve(data);
        });
    });



}
module.exports = saveRegister
