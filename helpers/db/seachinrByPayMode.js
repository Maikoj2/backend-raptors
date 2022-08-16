function searchByPayMode( id, collection) {
    return new Promise((resolve, reject) => {
        collection.find({ id: id })
        .populate({
            path: 'id_class',
            select: 'id_dicipline',
            populate: [
                {
                    path: 'id_discipline',
                    select: 'valuePerHour valuePerMonth',
                }
            ]
        })
            .exec((err, findedData) => {
                 (err)? 
                 reject(err):
                 resolve(findedData)
            });

    });

}
module.exports = searchByPayMode