const { response, SavingOnDB } = require("../../helpers");
const { AttendanceModel, LoanModel, SignUpClassModel } = require("../../models");

const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    const count = await AttendanceModel.estimatedDocumentCount();
    AttendanceModel.find({})
        .populate([{
            path: 'id_SignUpclass',
            select: ' id_Athlete id_class payMode',
            populate: [{
                path: 'id_Athlete',
                select: 'id age',
                populate: [{
                    path: 'id',
                    select: 'id Names SureNames email img ',
                }]
            }, {
                path: 'id_class',
                select: 'id Name id_teacher',
                populate: [{
                    path: 'id_teacher',
                    select: 'id Names email img ',
                }]
            }]
        },
        {
            path: 'User',
            select: 'Name email'
        }
        ])
        .skip(from)
        .limit(5)
        .exec(
            (err, Attendance) => {
                if (err) return response.error(res, res, 'error loandig  Attendance', 500, err);
                response.success(res, res, 'load completed', 200, Attendance, count)
            });
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const id_user = req.user._id;
    const { body } = req;
    const timeElapsed = Date.now();

    const today = new Date(timeElapsed);
    const Attendance = new AttendanceModel({
        id_SignUpclass: body.id_SignUpclass,
        Date: body.Date,
        Attendance: body.Attendance,
        pay: body.pay,
        User: id_user
    });
    Attendance.id = Attendance._id;

    // hago una busqueda de registro para poder obtener  los precios diario o mensual  de cada diciplina
    // y poder guardarlos en la en prestamos por si no pagan el dia que se hace la asistencia
    SignUpClassModel.findOne({ _id: body.id_SignUpclass })
        .populate({
            path: 'id_class',
            select: 'id_discipline',
            populate: [{
                path: 'id_discipline',
                select: 'valuePerHour valuePerMonth '
            }
            ]
        })
        .exec((err, regDb) => {
            if (err) response.error(req, res, 'error loandig  register', 500, err)
            if (regDb) {
                switch (regDb.payMode) {
                    case 'DIARIO':
                        AttendanceModel.findOne({ id_SignUpclass: body.id_SignUpclass, Date: body.Date })
                            .exec((err, search) => {
                                if (err)  return response.error(req, res, 'error loandig  Attendance', 500, err);
                                if (!search || search == null) {
                                    SavingOnDB(Attendance).then((resp) => {
                                        if (!Attendance.pay && Attendance.Attendance) {
                                            const loan = new LoanModel({
                                                id_SignUpclass: body.id_SignUpclass,
                                                valueToPay: regDb.id_class.id_discipline.valuePerHour,
                                                Date: body.Date,
                                                description: `No pago la clase `,
                                                User: id_user
                                            });
                                            loan.id= loan._id;
                                            
                                            SavingOnDB(loan).then( (Data) => {
                                                response.success(res, res, 'data saved successfully', 200, [resp ,Data ])
                                            }
                                            ).catch((e) => response.error(req, res, 'error loandig  loan', 500, e))
                                           
                                        }
                                        else {
                                            response.success(res, res, 'data saved successfully', 200, resp )
                                        }

                                    }).catch( (e) => response.error(req, res, 'error loandig loan', 500, e));


                                } else {
                                    console.log(search);

                                    search.Attendance = body.Attendance;
                                    search.pay = body.pay;
                                    SavingOnDB(search).then( (resp) => {
                                        if (!resp.pay) {
                                            LoanModel.findOne({ id_SignUpclass: body.id_SignUpclass, Date: body.Date})
                                            .exec((err, data) => {
                                                if (err)  return response.error(req, res, 'error loandig  Attendance', 500, err);
                            
                                                if (!data || data == null) {
                                                    const loan = new LoanModel({
                                                        id_SignUpclass: body.id_SignUpclass,
                                                        valueToPay: regDb.id_class.id_discipline.valuePerHour,
                                                        Date: body.Date,
                                                        description: `No pago la clase `,
                                                        User: id_user
                                                    });
                                                    loan.id= loan._id;
                                                    SavingOnDB(loan)
                                                    .then( (respon) => response.success(res, res, 'data saved successfully', 200, [resp ,respon]))
                                                    .catch( (e) => response.error(req, res, 'error saving  loan', 500, e) );
                                                }else response.success(res, res, 'data saved successfully', 200, resp)
                                                })
                                           
                                        }
                                        response.success(res, res, 'data saved successfully', 200, resp)
                                    })
                                    .catch((e) => response.error(req, res, 'error loandig loan', 500, e));
                                }
                            });
                 break;
                    //     case 'MENSUAL':
                    //         mensualidad.findOne({ id_registro: body.idregistro })
                    //             .exec((err, registro) => {
                    //                 if (err) {
                    //                     return res.status(500).json({
                    //                         ok: false,
                    //                         mensaje: 'Error buscar contacto',
                    //                         erros: err
                    //                     });
                    //                 }
                    //                 if (today <= registro.fechaFin) {

                    //                     Attendance.Pago = true
                    //                     dato = GuadarAsistencia(Attendance);
                    //                     res.status(200).json({
                    //                         ok: true,
                    //                         Registro: dato
                    //                     });

                    //                     // let did = hoy.getTime()   - registro.fechaFin.getTime() ;
                    //                     // console.log(' faltan '+ Math.round(did / (1000 * 60 * 60 * 24)) + ' para vencerce el pago' );
                    //                 } else {

                    //                     dato = GuadarAsistencia(Attendance);
                    //                     if (Attendance.asistencia && !Attendance.Pago) {
                    //                         // let did = hoy.getTime()   - registro.fechaFin.getTime() ;
                    //                         // console.log('vencido hace  ' + Math.round(did / (1000 * 60 * 60 * 24)) +' dias');
                    //                         prestamo = new loanModel({
                    //                             idRegistro: body.idregistro,
                    //                             ValorDeuda: registrobd.id_clase.id_diciplina.valor_hora,
                    //                             Fecha: body.fecha,
                    //                             Descripcion: 'tienes vencido el mes y No pago la clase',
                    //                             Usuario: id_usuario
                    //                         });
                    //                         prestamo.save((err, claseGuardado) => {
                    //                             if (err) {
                    //                                 return res.status(400).json({
                    //                                     ok: false,
                    //                                     mensaje: 'Error crear registro asistencia de clase',
                    //                                     erros: err
                    //                                 });
                    //                             }
                    //                             dato += claseGuardado;
                    //                             res.status(200).json({
                    //                                 ok: true,
                    //                                 Registro: dato
                    //                             });

                    //                         });
                    //                     }

                    //                 }



                    //             })


                    //         break;
                };
            } else {
                response.error(req, res, 'error loandig  Attendance', 500, `Attendance ${body.id_SignUpclass} not exist`)
            };
        });
};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const id_user = req.user._id;
    const id = req.params.id;
    const { body } = req;
    const Discipline = new ClassModel({
        Name: body.Name,
        id_discipline: body.id_discipline,
        id_teacher: body.id_teacher,
        DateStart: body.DateStart,
        DateEnd: body.DateEnd,
        schedule: body.schedule,
        Place: body.Place,
        HourStart: body.HourStart,
        HourEnd: body.HourEnd,
        User: id_user,
    });
    Discipline._id = id;
    Discipline.id = id;

    UpdatingOnDB(id, ClassModel, Discipline)
        .then(resp => response.success(req, res, 'class was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating class', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem

}
