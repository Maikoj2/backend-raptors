var expres = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = expres();
var Usuario = require('../../modelos/usuario')
var personal = require('../../modelos/Profesor')
var deportista = require('../../modelos/deportista')

// default options
app.use(fileUpload());
//  rutas
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;
    var tiposValidos = ['deportista', 'Usuario', 'personal']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de collecion no es valida',
            erros: { message: ' Extension validas son ' + tiposValidos.join(', ') }
        });

    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Nocargo ningun archivo',
            erros: { message: ' no selecciono ninguna imagen' }
        });
    }
    var archivo = req.files.img;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    var extensioneValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG'];

    if (extensioneValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida ',
            erros: { message: ' Extension validas son ' + extensioneValidas.join(', ') }
        });
    }

    // nombre archivo personalizado
    var nombrearchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`
    //  mover archivo
    var path = `./uploads/${tipo}/${nombrearchivo}`



    archivo.mv(
        path, err => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error subir archivo',
                    erros: err
                });
            }
            subirportipo(tipo, id, nombrearchivo, res);
        })
});

function subirportipo(tipo, id, nombrearchivo, res) {

    switch (tipo) {
        case 'deportista':
            BuscarPorId(id, deportista).then(respuesta => {
                var pathViejo = './uploads/deportista/' + respuesta[0].img;
                //  si exite, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo)

                }

                respuesta[0].img = nombrearchivo;
                actualizarImg(respuesta[0]).then(respuesta => {
                    res.status(200).json({
                        ok: true,
                        message: '  dato actalizado',
                        asistencia: respuesta
                    });
                }).catch(e => {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar archivos cuando actualiza',
                        registro: e
                    });
                })

            }).catch(e => {
                console.log(e);
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos al buscar',
                    registro: e
                });
            })

            break;
        case 'Usuario':
            BuscarPorId(id, Usuario).then(respuesta => {
                var pathViejo = './uploads/Usuario/' + respuesta[0].img;
                //  si exite, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo)

                }

                respuesta[0].img = nombrearchivo;
                actualizarImg(respuesta[0]).then(respuesta => {
                    res.status(200).json({
                        ok: true,
                        message: '  dato actalizado',
                        asistencia: respuesta
                    });
                }).catch(e => {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar archivos cuando actualiza',
                        registro: e
                    });
                })

            }).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
                    registro: e
                });
            })

            break;
        case 'personal':
            BuscarPorId(id, personal).then(respuesta => {
                var pathViejo = './uploads/personal/' + respuesta[0].img;
                //  si exite, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo)

                }

                respuesta[0].img = nombrearchivo;
                actualizarImg(respuesta[0]).then(respuesta => {
                    res.status(200).json({
                        ok: true,
                        message: '  dato actalizado',
                        asistencia: respuesta
                    });
                }).catch(e => {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar archivos cuando actualiza',
                        registro: e
                    });
                })

            }).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos al buscar ppor id',
                    registro: e
                });
            })

            break;

        default:
            break;
    }

}

function actualizarImg(datos) {
    return new Promise((resolve, reject) => {
        datos.save((err, datosactualizado) => {
            if (err) {
                reject('error al cargar Profesor')
            } else {
                resolve(datosactualizado)
            }

        });

    })
}
function BuscarPorId(busqueda, colleccion) {
    return new Promise((resolve, reject) => {
        colleccion.find({ _id: busqueda })
            .exec((err, Datoencontrada) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(Datoencontrada)
                }

            });

    });


}
module.exports = app;