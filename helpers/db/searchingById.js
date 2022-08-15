function searchById( id, collection) {
    return new Promise((resolve, reject) => {
        collection.find({ id: id })
            .exec((err, findedData) => {
                 (err)? 
                 reject(err):
                 resolve(findedData)
            });

    });

}
module.exports = searchById