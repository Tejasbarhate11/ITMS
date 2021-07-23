const app = require('./app');

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
    console.log("Server started on  => "+(new Date()));
});

//Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error message: ${err.message}`);
    console.log("Shutting the server down due to a fatal error");

    server.close(() => {
        process.exit(1);
    });
});