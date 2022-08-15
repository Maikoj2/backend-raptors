function UpdateRegister( id, collection, data) {
    return new Promise((resolve, reject) => {
        collection.findOneAndUpdate({_id: id},data )
            .exec((err, dataupdate) => {
                (err)?reject(err):resolve(dataupdate)
            });

    });

}
module.exports = UpdateRegister