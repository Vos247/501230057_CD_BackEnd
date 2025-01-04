import express from 'express';
import path from 'path';
const app = express();
const __dirname = path.resolve()
const port = 5100;

app.use("/static",express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('pages/index');
})
app.get('/components', (req, res) => {
    res.render('pages/components');
})
app.get('/forms', (req, res) => {
    res.render('pages/forms');
})
app.get('/icons', (req, res) => {
    res.render('pages/icons');
})
app.get('/notifications', (req, res) => {
    res.render('pages/notifications');
})
app.get('/tables', (req, res) => {
    res.render('pages/tables');
})
app.get('/typography', (req, res) => {
    res.render('pages/typography');
})
app.listen(port, function () {
    console.log("hãy đến tại đây http://localhost:" + port);
})