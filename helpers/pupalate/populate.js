const Athlete = [{
    path: 'id',
    populate: [{
        path: 'user',
        select: 'Nombre email'
    }]
}, { path: 'IdContact' }
];

const staff = [{
    path: 'id',
    select: 'id Names IdType SureNames Gender neighborhood Address Phone occupation email EPS img DateofBirth DepartamentBirth MunicipeBirth role ',
    populate: [{
        path: 'user',
        select: 'Names email'
    }]
}, {
    path: 'id_BaseSalary',
    select: 'position BaseSalary valuePerHour'
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
}, {
    path: 'User',
    select: 'Names email'
}]

const payroll = [
    {
        path: 'id_staff',
        select: 'TypeSalary profession TypeSalary id_BaseSalary',
        populate: [{
            path: 'id_BaseSalary',
            select: 'position BaseSalary valuePerHour',
        }]

    },
    {
        path: 'id_Deducted',
        select: 'health Pension Solarity_background source_retention , Total_Deducded',
    },
    {
        path: 'id_accrued',
        select: 'Days_worked id_ExtraHours commission bonus transportation_assistance Total_With_assistance Total_Without_assistance Total',
        populate: [{
            path: 'id_ExtraHours',
            select: 'H_E_Daytime  H_E_Night Night_Surcharge H_Holiday_Daytime H_Holiday_Night H_E_F_Daytime H_E_F_Night Total',
        }]
    },
    {
        path: 'User',
        select: 'Names email'
    }
]

module.exports = {
    Athlete,
    staff,
    SignUpClass,
    payModeSignUpClass,
    MonthlyAndDailypay,
    Class,
    Attendance,
    Loan,
    payroll
}