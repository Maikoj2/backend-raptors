////////////////////////////////////////
function searchingAll( collection, from , limit, query,populate = '') {
    return new Promise((resolve, reject) => {
        collection.find(query)
            .skip(from)
            .limit(limit)
            .populate(populate)
            .exec((err, resp) => {

                if (err) {
                    console.log(err);
                     reject('error seachig data', err)
                } else {

                    resolve(resp)
                }

            });

    });


}
module.exports = searchingAll
