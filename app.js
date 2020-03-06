const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const date = require(__dirname + '/date.js')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

const lists = [];
const works = [];

app.get('/', (req, res) => {
    const dayInfo = date.getDate();
    res.render("list", { title: dayInfo, lists: lists })
});

app.get('/work', (req, res) => {
    res.render('list', { title: 'Work List', lists: works })
})


app.post('/', (req, res) => {
    console.log(req.body)

    if (req.body.item != null) {
        if (req.body.item.trim() !== '') {

            if (req.body.list === "Work") {
                works.push(req.body.item);
                res.redirect('/work')
            }
            else {
                lists.push(req.body.item)
                res.redirect('/')
            }
        }
    }
    if (req.body.delete != null) {
        const deletePos = req.body.delete.indexOf('::');
        const deleteId = req.body.delete.slice(0, deletePos);
        if (req.body.delete.includes("Work List")) {
            works.splice(deleteId, 1);
            res.redirect('/work')
        }
        else {
            lists.splice(deleteId, 1);
            res.redirect('/')
        }
    }
    if (req.body.up != null) {
        const pos = req.body.up.indexOf('::');
        const id = req.body.up.slice(0, pos);
        if (id != 0) {
            if (req.body.up.includes("Work List")) {
                [works[id], works[id - 1]] = [works[id - 1], works[id]];
                res.redirect('/work')
            }
            else {
                [lists[id], lists[id - 1]] = [lists[id - 1], lists[id]];
                res.redirect('/')
            }
        }
    }

    if (req.body.down != null) {
        const pos = req.body.down.indexOf('::');
        const id = +req.body.down.slice(0, pos);
        console.log(id);
        console.log(lists.length);
        
        if (req.body.down.includes("Work List")) {
            if (id != works.length-1) {
                console.log(works)
                const temp = works[id];
                works[id] = works[id+1];
                works[id+1] = temp;
                res.redirect('/work')
            }
        }
        else {
            if (id != lists.length-1) {
                console.log(lists)
                const temp = lists[id];
                lists[id] = lists[id+1];
                lists[id+1] = temp;
                res.redirect('/');
            }
        }
    }
    // if (req.body.delete != null){
    //     lists.splice(0,1);
    //     res.redirect('/')
    // }
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.listen(port, function () {
    console.log(`Server is running on port ${port}`)
})