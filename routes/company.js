const express = require('express');
const router = express.Router();
const companyController = require("../controllers/company");

/* GET home page. */
router.get('/companies',companyController.getAllCompaniesByRegion);
module.exports = router;



