require("dotenv").config({ path: "./.env" });
const DB = require(`${__dirname}/data/dbConnection`);
const app = require(`${__dirname}/app`);

DB();

const port = 9000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});