const { payroll } = require('../pupalate/populate');
const { payrollModel, ValueExtraHourslModel, TransportAssitancelModel } = require('@models')

const savePayroll = async (id, req) => {
    const User = req.user._id;
    const { ...accrued } = req.body;
    const { Days_worked, commission, basic_accrued, bonus, transportation_assistance, Total_With_assistance, Total_Without_assistance, ...extraHours } = accrued;
    const { H_E_Daytime, H_E_Night, Night_Surcharge, H_Holiday_Daytime, H_Holiday_Night, H_E_F_Daytime, H_E_F_Night } = extraHours
    const payrolleData = await payrollModel.findById({ _id: id }).populate(payroll);
    let ValueEstraHours = await ValueExtraHourslModel.find({});
    ValueEstraHours = ValueEstraHours[0];
    const assstencceTranport = await TransportAssitancelModel.find({});
    const hoursWorked = ((Days_worked * 240) / 30);
    const valhour = payrolleData.id_staff.id_BaseSalary.valuePerHour;
    const idExtraHours = {
        H_E_Daytime: H_E_Daytime * ValueEstraHours.Value_H_E_Daytime * valhour,
        H_E_Night: H_E_Night * ValueEstraHours.Value_H_E_Night * valhour,
        Night_Surcharge: Night_Surcharge * ValueEstraHours.Value_Surcharge_Night * valhour,
        H_Holiday_Daytime: H_Holiday_Daytime * ValueEstraHours.Value_H_Holiday_Daytime * valhour,
        H_Holiday_Night: H_Holiday_Night * ValueEstraHours.Value_H_Holiday_Night * valhour,
        H_E_F_Daytime: H_E_F_Daytime * ValueEstraHours.Value_H_E_Holiday_Daytime * valhour,
        H_E_F_Night: H_E_F_Night * ValueEstraHours.Value_H_E_Holiday_Night * valhour,
        Total: 0
    }
    let valores = Object.values(idExtraHours); // valores = ["Scott", "Negro", true, 5];
    for (let i = 0; i < valores.length - 1; i++) {
        idExtraHours.Total += valores[i]
    }
    const Updatedaccrued = {
        Days_worked: Number(Days_worked),
        basic_accrued: hoursWorked * payrolleData.id_staff.id_BaseSalary.valuePerHour,
        commission: Number(commission),
        bonus: Number(bonus),
        transportation_assistance: assstencceTranport[0].Assitance_Daily * Days_worked,
        Total_With_assistance: 0,
        Total_Without_assistance: 0
    }

    Updatedaccrued.Total_Without_assistance = Updatedaccrued.basic_accrued +
        Number(Updatedaccrued.commission) +
        Number(Updatedaccrued.bonus) +
        + idExtraHours.Total
    Updatedaccrued.Total_With_assistance = Updatedaccrued.basic_accrued +
        Number(Updatedaccrued.commission) +
        Number(Updatedaccrued.bonus) +
        + idExtraHours.Total +
        Updatedaccrued.transportation_assistance

    const SB = ((Updatedaccrued.Total_Without_assistance >= 4000000) ? Updatedaccrued.Total_Without_assistance * 0.01 : 0)
    const SR = ((Updatedaccrued.Total_Without_assistance >= 5700600) ? Updatedaccrued.Total_Without_assistance * 0.28 : 0)
    const Deducted = {
        health: Updatedaccrued.Total_Without_assistance * 0.04,
        Pension: Updatedaccrued.Total_Without_assistance * 0.04,
        Solarity_background: SB,
        source_retention: SR,
        Total_Deducded: 0
    }
    Deducted.Total_Deducded = Deducted.health + Deducted.Pension + Deducted.Solarity_background + Deducted.source_retention;
    const Net_total = Updatedaccrued.Total_With_assistance - Deducted.Total_Deducded
    const UpdatePayroll = {
        id_staff: payrolleData.id_staff,
        id_Deducted: payrolleData.id_Deducted,
        id_accrued: payrolleData.id_accrued,
        Date: payrolleData.Date,
        Net_total,
        User
    }
    return {
        Deducted,
        idExtraHours,
        Updatedaccrued,
        UpdatePayroll
    }

}

module.exports = { savePayroll }