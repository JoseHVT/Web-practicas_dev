const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/login_db';

    await mongoose.connect(mongoURI);

    console.log('✓ Conexión a MongoDB exitosa');
    return true;
  } catch (error) {
    console.error('✗ Error conectando a MongoDB:', error.message);
    console.log('\n⚠️  Asegúrate de que MongoDB está ejecutándose en localhost:27017');
    console.log('   O configura MONGODB_URI en el archivo .env\n');
    return false;
  }
};

module.exports = connectDB;
