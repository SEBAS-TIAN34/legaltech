const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

// Support both DATABASE_URL and individual env vars
const connectionString = process.env.DATABASE_URL;

let sequelize;
if (connectionString) {
  // Use full connection string
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Use individual parameters
  sequelize = new Sequelize(
    process.env.DB_NAME || 'legaltech',
    process.env.DB_USER || 'admin',
    process.env.DB_PASSWORD || 'admin123',
    {
      host: process.env.DB_HOST || process.env.PGHOST || 'postgres',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true
      }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };