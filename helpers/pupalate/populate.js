const Athlete = [{
    path: 'id',
    populate: [{
        path: 'user',
        select: 'Nombre email'
    }]
}, { path: 'IdContact' }
];

const Teacher = [{
    path: 'id',
    populate: [{
        path: 'user',
        select: 'Nombre email'
    }]
}, {
    path: 'id_BaseSalary',
    select: 'position position valuePerHour'
}];

const SignUpClass = [{
    path: 'id_Athlete',
    select: 'id',
    populate: [{
        path: 'id',
        select: 'Names id SureNames email'
    }]
},
{
    path: 'id_class',
    select: 'Names valuePerHour valuePerMonth',
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
    select: 'Names email'
}
];

const payModeSignUpClass = [{
    path: 'id_class',
    select: 'id_dicipline',
    populate: [{
        path: 'id_discipline',
        select: 'valuePerHour valuePerMonth',
    }]
},
{
    path: 'id_Athlete',
    select: 'id ',
    populate: [{
        path: 'id',
        select: 'names email Phone img'
    }]
}];

const MonthlyAndDailypay = [{
    path: 'id_SignUpclass',
    populate: [
        {
            path: 'id_class',
            select: 'Names schedule Place HourStart HourEnd ',
            populate: [{
                path: 'id_teacher',
                select: 'id',
                populate: [{
                    path: 'id',
                    select: 'names email Phone img'
                }]
            }]
        },
        {
            path: 'id_Athlete',
            select: 'id ',
            populate: [{
                path: 'id',
                select: 'names email Phone img'
            }]
        }]
},
{
    path: 'User',
    select: 'Names email'
}];


const Class = [{
    path: 'id_teacher',
    select: 'id id_BaseSalary profession',
    populate: [{
        path: 'id',
        select: 'Names id SureNames email'
    }]
},
{
    path: 'id_discipline',
    select: 'Names valuePerHour valuePerMonth'
},
{
    path: 'User',
    select: 'Names email'
}
];

const Attendance = [{
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
        select: 'id Names id_teacher',
        populate: [{
            path: 'id_teacher',
            select: 'id Names email img ',
        }]
    }]
},
{
    path: 'User',
    select: 'Names email'
}
]

const Loan = [{
    path: 'idPeople',
    select: 'Names id SureNames email'
},{
    path: 'User',
    select: 'Names email'
}]

module.exports = {
    Athlete,
    Teacher,
    SignUpClass,
    payModeSignUpClass,
    MonthlyAndDailypay,
    Class,
    Attendance,
    Loan
}