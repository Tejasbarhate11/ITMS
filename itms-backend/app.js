const express = require('express');
const app = express();

const cors = require('cors');
//const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const path = require("path");
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models/index');

//CRON
const cron = require('node-cron');

// const limiter = rateLimit({
//     windowMs : 30*60*1000,  //30 minutes
//     max : 100   //100 requests per 30 min
// });

dotenv.config({path: './config/config.env'});
app.use(cors());
app.use(helmet());
//app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set("view engine", "hbs");

app.use(morgan('combined'));

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://cdn.quilljs.com https://fonts.googleapis.com https://stackpath.bootstrapcdn.com https://code.jquery.com https://cdn.jsdelivr.net https://stackpath.bootstrapcdn.com https://cdn.datatables.net 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: *; font-src 'self' fonts.gstatic.com cdn.jsdelivr.net"
  );
  next();
});


const sequelizeStore = new SequelizeStore({
  db: db.sequelize,
  checkExpirationInterval: 1000 * 60 * 60 * process.env.INTERVAL,
  expiration: 1000 * 60 * 60 * 24 * process.env.SESSION_EXPIRATION
});

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    store: sequelizeStore,
    name: process.env.SESSION_NAME,
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * process.env.COOKIE_AGE,
        sameSite: true,
    }
  }
))


const ErrorHandler = require('./utils/errorHandler');


//Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const testRoutes = require('./routes/test.routes');
const questionRoutes = require('./routes/question.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const departmentRoutes = require('./routes/department.routes');
const designationRoutes = require('./routes/designation.routes');
const assignmentRoutes = require('./routes/assignment.routes');


app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', testRoutes);
app.use('/', questionRoutes);
app.use('/', dashboardRoutes);
app.use('/', departmentRoutes);
app.use('/', designationRoutes);
app.use('/', assignmentRoutes);


app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} does not exist`, 404));
});

const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware);

const {
  unattemptedTests
} = require('./utils/testUtils')

// cron.schedule('*/2 * * * *', async () => {
//   console.log('Task Called: ' + (new Date()));
//   await unattemptedTests();
// })

module.exports = app;