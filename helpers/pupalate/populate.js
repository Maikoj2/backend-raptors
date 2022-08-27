const Athlete = [{
    path: 'id',
    populate: [{
        path: 'user',
        select: 'Nombre email'
    }]
}, { path: 'IdContact' }
]

const Teacher = [{
    path: 'id',
    populate: [{
        path: 'user',
        select: 'Nombre email'
    }]
}, {
    path: 'id_BaseSalary',
    select: 'position position valuePerHour'
}]

const SignUpClass = [{
        path: 'id_Athlete',
        select: '',
        populate: [{
            path: 'id',
            select: 'Names id SureNames email'
        }]
    },
    {
        path: 'id_class',
        select: 'Name valuePerHour valuePerMonth',
        populate: [{
            path: 'id_teacher',
            select: 'id id_BaseSalary profession',
            populate: [{
                path: 'id',
                select: 'Names id SureNames email'
            }]
        }]
    },
    {
        path: 'User',
        select: 'Name email'
    }
    ]

    const payModeSignUpClass = [{
        path: 'id_class',
        select: 'id_dicipline',
        populate: [{
                path: 'id_discipline',
                select: 'valuePerHour valuePerMonth',
            }]
    }]


module.exports = {
    Athlete,
    Teacher,
    SignUpClass,
    payModeSignUpClass

}