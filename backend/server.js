const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { sequelize } = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Sync all models to DB (creates tables if they don't exist)
  await sequelize.sync({ alter: true });
  console.log('✅ Database synced');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();