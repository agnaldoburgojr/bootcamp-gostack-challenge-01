const express = require("express");
const server = express();
server.use(express.json());

let numberOfRequests = 0;
const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id == id.toString());

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.project = project;
  next();
}

function countRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Requests Number: ${numberOfRequests}`);
  next();
}

server.use(countRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkProjectExists, (req, res) => {
  return res.json(req.project);
});

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  project = projects.find(project => project.id == id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id == id);
  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  project = projects.find(project => project.id == id);
  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
