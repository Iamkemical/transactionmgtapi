const { Sequelize, Op, QueryTypes } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config");

const sequelize = new Sequelize(process.env.DATABASE_URL, config[env]);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // Test query
    const result = await sequelize.query("SELECT NOW()", {
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log("📊 Test query result:", result);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

testConnection();

module.exports = { sequelize, Op, QueryTypes };
