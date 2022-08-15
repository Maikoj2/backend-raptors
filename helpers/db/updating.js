function UpdateRegister( id, collection, data) {
    return new Promise((resolve, reject) => {
        collection.findByIdAndUpdate({id: id},data )
            .exec((err, dataupdate) => {
                (err)?reject(err):resolve(dataupdate)
            });

    });

}
module.exports = UpdateRegister