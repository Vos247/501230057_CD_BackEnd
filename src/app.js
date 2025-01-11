import express from 'express';
import path from 'path';
import routers from './routers/index.js';
import mongoConnect from './mongo/mongoConnecter.js';
const app = express();
const __dirname = path.resolve()
const port = 5100;

mongoConnect();
app.use("/static",express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

routers(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, function () {
    console.log("hãy đến tại đây http://localhost:" + port);
})