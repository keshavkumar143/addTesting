const express = require('express');
const app = express();
const PORT = 3002;
const path = require('path');
const fs = require('fs');
const { log } = require('console');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    fs.readdir(path.join(process.cwd(), "files"), function (err, files) {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Error reading directory");
        }
        console.log(files);
        res.render("index", { files: files });
    });
});

app.get("/files/:filename", (req, res) => {
    const head = req.params.filename
    const filePath = path.join(process.cwd(), "files", req.params.filename);
    fs.readFile(filePath, "utf-8", function(err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send(err);
        }
        console.log({ filedata });
        res.render("show", {head:head,filedata: filedata}); 
    });
});



app.get("/edit/:filename", (req, res) => {
    res.render('edit',{filename :req.params.filename}); 
});

app.post("/edit", (req, res) => {
     
    fs.rename(`./files/${req.body.previous}`, `files/${req.body.new}`, function (err) {
        if(err){
            res.status(500).send(err)
        }
        res.redirect('/')
    })
});












app.post('/create', async (req, res) => {
    const title = req.body.Title;
    const det = req.body.details;
    const filePath = path.join(process.cwd(), 'files', `${title}.txt`);

    fs.writeFile(filePath, det, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        console.log(`File created with name: ${title}.txt`);
        res.redirect("/");
    });
});

app.listen(PORT, () => {
    console.log(`Connected to server at ${PORT}`);
});
