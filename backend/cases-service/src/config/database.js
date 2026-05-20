const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL;

let sequelize;
if (connectionString) {
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'legaltech',
    process.env.DB_USER || 'admin',
    process.env.DB_PASSWORD || 'admin123',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      define: { timestamps: true, underscored: true }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('âœ… PostgreSQL connected successfully');
    await sequelize.sync({ force: false, alter: false });
    console.log('âœ… Database synchronized');
  } catch (error) {
    console.error('âŒ PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
