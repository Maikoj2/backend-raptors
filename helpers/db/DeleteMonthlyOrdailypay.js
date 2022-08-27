

function DeleteMonthlyOrdailypay(search,colleccion) {
    return new Promise((resolve, reject) => {
        colleccion.findOneAndDelete({  id_SignUpclass: search })
            .exec((err, dataDeleted) => {

                if (err) {
                    reject(err)
                } else {
                    resolve(dataDeleted)
                }

            });

    });


}

module.exports = DeleteMonthlyOrdailypay;