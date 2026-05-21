const mongoose = require('mongoose');
const { getMongoUri } = require('./env');

const connectDB = async () => {
  try {
    const mongoURI = getMongoUri();

    await mongoose.connect(mongoURI);

    console.log('conexion a mongodb exitosa');
    return true;
  } catch (error) {
    console.error('error conectando a mongodb:', error.message);
    console.log('\nrevisa que mongodb este ejecutandose en localhost:27017');
    console.log('o configura mongodb_uri en el archivo .env\n');
    return false;
  }
};

module.exports = connectDB;
