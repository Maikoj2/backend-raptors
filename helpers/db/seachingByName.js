////////////////////////////////////////
function searchingByName(search, colleccion, from) {
    return new Promise((resolve, reject) => {
        colleccion.find({ Name: search })
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
module.exports = searchingByName
