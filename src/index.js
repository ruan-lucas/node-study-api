const express = require("express");

const app = express()

app.use(express.json());

const projects = [ ];

app.post("/projects", (req, res) => {
    const { id, title } = req.body;

    if(!id || !title) 
        return res.status(400).json({ error: "Project id or title is not defined in request body."});

    const project = {id, title, tasks: []};

    projects.push(project);

    return res.json(project);
})

app.get("/projects", (req, res) => {
    return res.json(projects);
})

app.put("/projects/:id", checkIfProjectExists, (req, res) => {
    const { title } = req.body;
    const project = req.project;

    if(!title)
        return res.status(400).json({ error: "Project title is not defined in request body."});

    project.title = title;

    return res.json(project);
})

app.delete("/projects/:id", checkIfProjectExists, (req, res) => {
    const project = req.project;
    const id = project.id;

    const index = projects.findIndex(proj => proj.id == id);

    projects.splice(index, 1);

    return res.status(204).send();
})

app.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
    const project = req.project;
    const { title } = req.body;

    if(!title) 
        return res.status(400).json({ error: "Task title is not defined in request body."});

    project.tasks.push({ title });

    return res.json(project);
})

function checkIfProjectExists(req, res, next) {
    const { id } = req.params;

    if(!id)
        return res.status(400).json({ error: "Project id is missing in URL params."});

    const project =  projects.find(proj => proj.id == id);
    
    if(!project)
        return res.status(400).json({ error: "Project doesn't exists."});

    req.project = project;

    return next();
}

app.listen(4000);
