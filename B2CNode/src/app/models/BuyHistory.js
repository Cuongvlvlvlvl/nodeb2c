const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyHistory = new Schema({
    username: {type: String},
    email: {type: String},
    vnp_TransactionNo: {type: Number},
    vnp_BankTranNo: {type: String},
    vnp_BankCode: {type: String},
    vnp_Amount: {type: Number},
    vnp_PayDate: {type: Number},
    vnp_OrderInfo: {type: String},
    vnp_CardType: {type: String},
}, {
    timestamps: true,
});

module.exports = mongoose.model('buyhistory', buyHistory);