

function DeleteMonthlyOrdailypay(search,colleccion) {
    return new Promise((resolve, reject) => {
        colleccion.findOneAndDelete({  id_SignUpclass: search })
            // .populate('usuario', 'Nombre email')
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