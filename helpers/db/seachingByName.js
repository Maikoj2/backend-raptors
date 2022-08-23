////////////////////////////////////////
function searchingByName(search, collection, from, limit, role = '') {
    if (role !== '') {
        return new Promise((resolve, reject) => {
            collection.find({ Names: search, deleted: false }).and([{role}])
                .skip(from)
                .limit(limit)
                .exec((err, resp) => {

                    if (err) {
                        reject('error to seaching', err)
                    } else {

                        resolve(resp)
                    }

                });

        });
    }
    return new Promise((resolve, reject) => {
        collection.find({ Names: search, deleted: false })
            .skip(from)
            .limit(limit)
            .exec((err, resp) => {

                if (err) {
                    reject('error to seaching', err)
                } else {

                    resolve(resp)
                }

            });

    });


}
module.exports = searchingByName
