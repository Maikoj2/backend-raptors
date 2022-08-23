const PopulateAthlete = [{
    path: 'id',
    populate: [{
        path: 'user',
        select: 'Nombre email'
    }]
}, { path: 'IdContact' }
]

const populateTeacher =[{
    path: 'id',
    populate: [{
        path: 'user',
        select: 'Nombre email' }]
},{
    path: 'id_BaseSalary',
    select: 'position position valuePerHour'
}]

const populateDicipline ={}



module.exports ={
    PopulateAthlete,
    populateTeacher

}