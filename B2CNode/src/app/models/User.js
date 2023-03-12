const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Book = require('../models/Books');

const user = new Schema({
    email: {type: String, default: null, unique: true},
    username: {type: String, default: null},
    hashpassword: {type: String, default: null},
    ggid: {type: String, default: null},
    fbid: {type: String, default: null},
    vipexpire: {type: Date, default: Date.now()},
    active: {type: Boolean, default: true},
    //change to default user role on default
    uploader: {type: Boolean, default: false},
    admin: {type: Boolean, default: false}
},  {
    timestamps: true,
});

// user.virtual('totalBooks').get( async function(){
//     return await Book.findOne({email: this.email}).count();
// })

module.exports = mongoose.model('user', user);