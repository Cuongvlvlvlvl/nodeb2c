module.exports = {
    mulMongooseObj: function(mongooseArr){
        return mongooseArr.map(mongoose => mongoose.toObject());
    },
    mongooseObj: function(mongooses){
        return mongooses ? mongooses.toObject() : mongooses;
    }
};