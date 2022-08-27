function searchById( _id, collection, populate = []) {
    return new Promise((resolve, reject) => {
        collection.findById({ _id })
        .populate(populate)
            .exec((err, findedData) => {
                 (err)? 
                 reject(err):
                 resolve(findedData)
            });

    });

}
module.exports = searchById