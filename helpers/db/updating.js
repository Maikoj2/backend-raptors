const  UpdateRegister = ( _id, collection, data) => {
    return new Promise((resolve, reject) => {
        collection.findOneAndUpdate({_id},data )
            .exec((err, dataupdate) => {
                console.log(dataupdate);
                (err)?reject(err):resolve(dataupdate)
            });

    });

}
module.exports = UpdateRegister