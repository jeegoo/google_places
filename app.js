let express = require('express');
let app = express();
const json2xls = require('json2xls');

//routes import
let indexRouter = require('./routes/index');
//let establishmentsRouter = require('./routes/establishment');

let companyRouter = require('./routes/company');

app.set('view engine', 'pug');
//middleware
app.use(json2xls.middleware);
app.use(express.json());


//routes uses
app.use(indexRouter);
app.use( companyRouter);

app.listen(3000);

