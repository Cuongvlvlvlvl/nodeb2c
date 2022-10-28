const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://Cuongggg:Cu7895123@cluster0.s4rio8m.mongodb.net/?retryWrites=true&w=majority',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successfully!');
    } catch(error){
        console.log('Connect error!');
    }
}

module.exports = { connect };