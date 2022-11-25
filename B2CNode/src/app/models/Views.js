const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const view = new Schema({
    bookid: {type: String, default: null},
    viewer: {type: String, default: null}
},  {
    timestamps: true,
});

module.exports = mongoose.model('view', view);