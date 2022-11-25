const User = require('../models/User');
const buyHistory = require('../models/BuyHistory');
var mysign = new String();
var idcheck = new String();

class VnpayController{

    // maked (req, res, next) {   
    //     var date = Date.now();
    //     var dateFormat = require('dateformat');
    
    //     var desc = 'Thanh toan don hang thoi gian: ' + dateFormat(date, 'yyyymmddHHmmss');
    //     res.render('/home', {title: 'Tạo mới đơn hàng', amount: 10000, description: desc})
    // };

    create(req, res, next) {
        mysign = makeid();
        idcheck = mysign;
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        
        var tmnCode = '3OKCBGET';
        var secretKey = 'DWYEYOENVIJZANMLNEDGDGDVIKPKULLE';
        var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        var returnUrl = 'http://localhost:8000/order/vnpay_return';

        var date = new Date(Date.now());
        var dateFormat = require('dateformat');

        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        var amount = req.query.amount;
        var bankCode = '';
        
        var orderInfo = req.query.title;
        var orderType = 'other';
        var locale = 'vn';
        if(locale === null || locale === ''){
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        //console.log(vnpUrl);

        res.redirect(vnpUrl);
    };

    async return (req, res, next) {
        var vnp_Params = req.query;
    
        var secureHash = vnp_Params['vnp_SecureHash'];
    
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
    
        vnp_Params = sortObject(vnp_Params);
    
        var tmnCode = '3OKCBGET';
        var secretKey = 'DWYEYOENVIJZANMLNEDGDGDVIKPKULLE';
    
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     
    
        if(secureHash === signed){
            if(vnp_Params['vnp_ResponseCode'] === '00'){
                if(idcheck === mysign){
                    const fromQuery = req.query;
                    const usersecc = req.user;
                    fromQuery.username = usersecc.username;
                    fromQuery.email = usersecc.email;
                    
                    var months = 0;
                    var amountPayed = 0;
                    switch (req.query.vnp_Amount) {
                        case '5000000':
                            months = 1;
                            amountPayed = 50000;
                            break;

                        case '15000000':
                            months = 3;
                            amountPayed = 150000;
                            break;

                        case '30000000':
                            months = 6;
                            amountPayed = 300000;
                            break;

                        default:
                            break;
                    }

                    fromQuery.vnp_Amount = amountPayed;
                    const buyhistory = new buyHistory(fromQuery);
                    buyhistory.save();

                    const user = await User.findById(usersecc._id);
                    const today = new Date(Date.now());
                    var vipday;
                    if(user.vipexpire < today) {
                        vipday = new Date(Date.now());
                        vipday.setMonth(today.getMonth() + months);
                    } else {
                        vipday = new Date(user.vipexpire);
                        vipday.setMonth(user.vipexpire.getMonth() + months);
                    }

                    user.vipexpire = vipday;
                    req.user.vipexpire = vipday;
                    user.save();
                    mysign = null;

                    res.render('success', {session:req.user, code: vnp_Params['vnp_ResponseCode'], info: 'Thanh toan thanh cong!'});
                }
            }
            else
                res.render('success', {session: req.user, code: '97', info: 'Thanh toan khong thanh cong!'});
        } else{
            res.render('success', {session: req.user, code: '97', info: 'Loi khong xac dinh!'});
        }
    };
    
    async ipn (req, res, next) {
        
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];
    
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
    
        vnp_Params = sortObject(vnp_Params);
        var config = require('config');
        var secretKey = config.get('vnp_HashSecret');
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     
    
        if(secureHash === signed){
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
                    // const fromQuery = req.query;
                    // const usersecc = req.user;
                    // fromQuery.username = usersecc.username;
                    // fromQuery.email = usersecc.email;
                    // const buyhistory = new buyHistory(fromQuery);
                    // buyhistory.save();
                    // var months = 0;
                    // switch (req.query.vnp_Amount) {
                    //     case '5000000':
                    //         months = 1;
                    //         break;

                    //     case '15000000':
                    //         months = 3;
                    //         break;

                    //     case '30000000':
                    //         months = 6;
                    //         break;

                    //     default:
                    //         break;
                    // }
                    // const user = await User.findById(usersecc._id);
                    // const today = new Date(Date.now());
                    // var vipday;
                    // if(user.vipexpire < today) {
                    //     vipday = new Date(Date.now());
                    //     vipday.setMonth(today.getMonth() + months);
                    // } else {
                    //     vipday = new Date(user.vipexpire);
                    //     vipday.setMonth(user.vipexpire.getMonth() + months);
                    // }

                    // user.vipexpire = vipday;
                    // req.user.vipexpire = vipday;
                    // user.save();
                    // mysign == null;
            res.status(200).json({RspCode: '00', Message: 'success'})
        }
        else {
            res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
        }
    };

}

function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

function makeid() {
    var result           = '';
    var characters       = 'abcdefghjklmnouywz0123456789';
    var charactersLength = 12;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = new VnpayController();

