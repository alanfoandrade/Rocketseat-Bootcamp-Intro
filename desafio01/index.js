const express = require('express');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  ReqCount++;
  console.log(`Numero de requisições: ${ReqCount}`);

  return next();
});

function CheckProjectExists(req, res, next) {
  const project = projects.find(p => p.id == req.params.id);

  if (!project)
    return res.status(400).json({ message: 'Projeto não encontrado' });

  req.project = project;

  return next();
}

let ReqCount = 0;
const projects = [];

app.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json({ message: 'Projeto incluído' });
});

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.put('/projects/:id', CheckProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

app.delete('/projects/:id', CheckProjectExists, (req, res) => {
  const index = projects.findIndex(p => p.id == req.params.id);

  projects.splice(index, 1); //deleta 1 posição a partir do index
  return res.json(projects);
});

app.post('/projects/:id/tasks', CheckProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(req.project);
});

app.listen(3000);
