const mongoose = require('mongoose');
const Personal = require("../models/personal");


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/mila';

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl);

const seedDB = async () => {
    await Personal.deleteMany({});
}

seedDB();