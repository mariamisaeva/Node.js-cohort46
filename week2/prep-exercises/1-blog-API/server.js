const express = require('express')
const app = express();
const fs = require("fs");
const path = require('path');
//const fsPromises = require('fs').promises;


app.use(express.json());

app.post('/blogs/write', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400).send(`Title and Content are required!`);
        return;
    }

    fs.writeFileSync(path.join(__dirname, 'blogs', `${title}.json`), JSON.stringify({ title, content }));
    res.setHeader('Content-Type', "application/json");
    res.send('ok');
});

app.put('/posts/:title', (req, res) => {
    // How to get the title and content from the request?
    // What if the request does not have a title and/or content?
    const { title } = req.params;
    const { content } = req.body;

    if (fs.existsSync(path.join(__dirname, 'blogs', `${title}.json`))) {
        fs.writeFileSync(path.join(__dirname, 'blogs', `${title}.json`), JSON.stringify({ title, content })); //fs.appendFileSync
        res.end('ok')
    }
    else {
        // Send response with error message
        res.status(404).send(`Post does not exist`);
    }
});

app.delete('/blogs/:title', (req, res) => {
    // How to get the title from the url parameters?
    const { title } = req.params;

    if (title) { // Add condition here
        if (fs.existsSync(path.join(__dirname, 'blogs', `${title}.json`))) {
            fs.unlinkSync(path.join(__dirname, 'blogs', `${title}.json`));
            res.end('ok');
        } else { //if not exists
            res.status(404).send(`This post does not exist`);
        }

    } else {
        // Respond with message here
        res.status(400).send(`Bad Request: Title is required!`);
    }
});

app.get('/blogs/:title', (req, res) => {
    // How to get the title from the url parameters?
    // check if post exists
    const { title } = req.params;
    if (title) {
        if (fs.existsSync(path.join(__dirname, 'blogs', `${title}.json`))) {
            const post = fs.readFileSync(path.join(__dirname, 'blogs', `${title}.json`), 'utf8');
            // send response
            // res.send(post);
            res.status(200).send(post);
        } else {
            //it doesn't  exist so respond with 404 status 
            res.status(404).send(`Sorry, This Post Does Not Found!`);
        }
    } else {
        //400 badReq title is required
        res.status(400).send(`Bad Request: Tile Parameter Is Required!`);
    }

});

app.get('/blogs', (req, res) => {
    // how to get the file names of all files in a folder??
    const files = fs.readdirSync(path.join(__dirname, 'blogs'));

    const posts = files.map(file => {
        const cont = fs.readFileSync(path.join(__dirname, 'blogs', file), 'utf8');
        return { title: path.parse(file).name, content: cont }
        //path.parse(file) shows everything (we want name only)
    });
    res.json(posts);
    //res.status(200).json(posts);
})

//using promises (async/await)
/*
app.post('/blogs/write-post', async (req, res) => {
    // How to get the title and content from the request??
    const { title, content } = req.body;

    if (!title || !content || title.trim() === '' || content.trim() === '') {
        res.status(400).json({ ERROR: `Title and Content are required!` });
        return;
    }

    let newPost = {
        title: title,
        content: content
    };


    try {
        await fsPromises.writeFile(path.join(__dirname, 'blogs', `${title}.json`), JSON.stringify(newPost));
        res.setHeader('Content-Type', 'application/json');
        res.end('ok');
        //res.json({ status: 'ok' });

    } catch (err) {
        console.error(err);
        res.status(500).json('Server Error!');
    }
});
*/


app.listen(3000, () => { console.log(`Running...`); });

