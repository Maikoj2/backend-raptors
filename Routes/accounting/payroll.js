const expres = require('express')
const app = expres();
const { check } = require('express-validator');
const Nomina = require('../../models/payroll/payroll');
const Horasextras = require('../../models/payroll/ExtrasHours');
const Devengados = require('../../models/payroll/Accrued');
const Deducidos = require('../../models/payroll/Deducded');
const { token, valid } = require('../../middleware');
const Devengado = require('../../models/payroll/Accrued');
const {getItemsExtrasHours, updateItemExtrasHours } = require('../../Controllers/accounting/payroll/ValueEstraHours');
const { ExistById } = require('../../helpers/Validators/dbValidators');
const { ValueExtraHourslModel,  TransportAssitancelModel, payrollModel, StaffModel, DeductedModel, AccruedModel, ExtraHourslModel } = require('../../models');
const { getItemsTransportAssitance, updateItemTransportAssitance } = require('../../Controllers/accounting/payroll/TransportAssitance');
const { getItems, createItem, updateItem } = require('../../Controllers/accounting/payroll/payroll');



/*********************************************************************************************** /
*                                      payroll rutes                                            *   
************************************************************************************************/


                             //get items of  payrolls //
app.get('/',getItems);


                             //create all  items of  payrolls in a specific Date and type salary //
app.post('/:TypeSalary',[
    check(['Date' , 'TypeSalary' ], `data can't be empty`).not().isEmpty(),
    valid.validateFields,
    token.verificatoken],
   createItem);


   app.put('/:id', [
    check('id').isMongoId().bail().custom((id) => ExistById(id, payrollModel)),
    check('id_staff').isMongoId().bail().custom((id) => ExistById(id, StaffModel)),
    check('id_Deducted').isMongoId().bail().custom((id) => ExistById(id, DeductedModel)),
    check('id_accrued').isMongoId().bail().custom((id) => ExistById(id, AccruedModel)),
    valid.validateFields,
    token.verificatoken],updateItem);

/*********************************************************************************************** */

/*********************************************************************************************** /






/*********************************************************************************************** /
 *                              getItems value per percentage Extra hours                        *   
 ************************************************************************************************/

app.get('/ValueExtrasHours', getItemsExtrasHours);

/**
 * Update value   per percentage Extra hours
 */
app.put('/ValueExtrasHours/:id',[
    check('id').isMongoId().bail().custom((id) => ExistById(id, ValueExtraHourslModel)),
    valid.validateFields,
    token.verificatoken] ,updateItemExtrasHours);
/*********************************************************************************************** */

/*********************************************************************************************** /
 * getItems value TransportAssitance
 */

 app.get('/ValueTransportAssitance', getItemsTransportAssitance);

 /**
  * Update value  TransportAssitance
  */
 app.put('/ValueTransportAssitance/:id',[
     check('id').isMongoId().bail().custom((id) => ExistById(id, TransportAssitancelModel)),
     valid.validateFields,
     token.verificatoken] ,updateItemTransportAssitance);
 /*********************************************************************************************** */
app.put('/devengados/:id', (req, res) => {

    const id = req.params.id;
    const body = req.body;
    BuscarpotId(id, Devengados)
        .then(resp => {

            if (!resp) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Horasextras con ' + id + ' no existe',
                    erros: { message: 'no existe el nomina con ese id ' }
                });
            }


            resp[0].Dias_laborados = body.Dias_Laborados;
            resp[0].Basico_devengado = body.Basico_devengado;
            resp[0].Comiciones = body.Comiciones;
            resp[0].Bonificaciones = body.Bonificaciones;
            resp[0].Auxilio_transporte = body.Auxilio_transporte;
            resp[0].Total_conAuxiolioT = body.Total_conAuxiolioT;
            resp[0].Total_Sin_auxilio = body.Total_Sin_auxilio;
            guardardato(resp[0]).then(
                resp2 => {
                    res.status(200).json({
                        ok: true,
                        message: ' datos fueron almacenado Correcamente',
                        registro: resp2,
                    })
                }
            ).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
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

});
// /////////////////////////////////////////

app.put('/deducidos/:id', (req, res) => {

    const id = req.params.id;
    const body = req.body;
    BuscarpotId(id, Deducidos)
        .then(resp => {

            if (!resp) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Horasextras con ' + id + ' no existe',
                    erros: { message: 'no existe el nomina con ese id ' }
                });
            }


            resp[0].Salud = body.Salud;
            resp[0].Pension = body.Pension;
            resp[0].Fondo_Solidadridad = body.Fondo_Solidadridad;
            resp[0].Retencion_fuente = body.Retencion_fuente;
            resp[0].Total_Deducido = body.Total_Deducido;
            guardardato(resp[0]).then(
                resp2 => {
                    res.status(200).json({
                        ok: true,
                        message: ' datos fueron almacenado Correcamente',
                        registro: resp2,
                    })
                }
            ).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
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

});
// ==============================
// eliminar  nomina
// ==============================

app.delete('/:id', token.verificatoken, (req, res) => {

    const id = req.params.id;


    BuscarpotId(id, Nomina).then(resp => {


        if (!resp) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Horasextras con ' + id + ' no existe',
                erros: { message: 'no existe el nomina con ese id ' }
            });
        }
        
        Promise.all([
            EliminarRegistro(resp[0].id_Devengado.id_HoraEXtra, Horasextras),
            EliminarRegistro(resp[0].id_Devengado, Devengado),
            EliminarRegistro(resp[0].id_Deducidos, Deducidos),
            EliminarRegistro(id, Nomina)
        ]).then(respuestas => {
            res.status(200).json({
                ok: true,
                message: ' datos Borrados almacenado Correcamente',
                registro: respuestas[0],
                registro2: respuestas[1],
                registro3: respuestas[2],
                registro4: respuestas[3],
            })
        }).catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivos',
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

});




// funciones 
function guardardato(dato) {
    return new Promise((resolve, reject) => {
        dato.save((err, datos) => {

            if (err) {
                reject('error al cargar asistencia')
                console.log(err);
            } else {
                resolve(datos)
            }

        });

    });


}
function BuscarPorIdDate(id, Date, Colleccion) {
    return new Promise((resolve, reject) => {
        Colleccion.find({ id_personal: id, Date: Date })
            // .populate('usuario', 'Nombre email')
            .exec((err, clase) => {

                if (err) {
                    reject('error al cargar asistencia')

                } else {
                    resolve(clase)
                }

            });

    });


}
function BuscarpotId(id, Colleccion) {
    return new Promise((resolve, reject) => {
        Colleccion.find({ _id: id })
            .populate('id_Devengado', 'id_HoraEXtra')
            .exec((err, clase) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(clase)
                }

            });

    });


}
function EliminarRegistro(busqueda, colleccion) {
    return new Promise((resolve, reject) => {
        colleccion.findOneAndDelete({ _id: busqueda })
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}


module.exports = app;