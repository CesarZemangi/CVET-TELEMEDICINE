import sequelize from "./src/config/db.js";

const checkDDL = async () => {
  const [cases] = await sequelize.query("SHOW CREATE TABLE cases");
  console.log("CASES DDL:", cases[0]['Create Table']);
  const [animals] = await sequelize.query("SHOW CREATE TABLE animals");
  console.log("ANIMALS DDL:", animals[0]['Create Table']);
  const [consults] = await sequelize.query("SHOW CREATE TABLE consultations");
  console.log("CONSULTATIONS DDL:", consults[0]['Create Table']);
  const [lab] = await sequelize.query("SHOW CREATE TABLE lab_requests");
  console.log("LAB_REQUESTS DDL:", lab[0]['Create Table']);
  process.exit(0);
};

checkDDL();