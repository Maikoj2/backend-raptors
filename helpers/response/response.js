


 function success (req, res, message, status, data = [] ,count = 0) {
     if (count === 0) return res.status(status || 200).json({
        ok: true,
        message: message,
        Data: data,
    });

    return res.status(status || 200).json({
        ok: true,
        message: message,
        Data: data,
        total: count
    });

}

 function error (req, res, message, status, err) {
    console.log(err);

    return res.status(status || 500).json({
        ok: false,
        message: message,
        error: err 
    });

} 

module.exports ={
    success,
    error
}