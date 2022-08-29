Date.isLeapYear =  (year) => 
{ return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); };

Date.getDaysInMonth =  (year, month) => { 
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]; 
};

Date.prototype.isLeapYear = ()  => { 
    const y = this.getFullYear(); 
    return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)); 
};

Date.prototype.getDaysInMonth = ()=> { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth()); 
};

Date.prototype.addMonths =  (value) =>{ 
    const n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value); 
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this; 
};



const  addMonth  =  (cant) => {

    return  new Date().addMonths(cant);
}


module.exports = {addMonth}



