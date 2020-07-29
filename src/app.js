const express = require("express");
const { uuid, isUuid } = require('uuidv4')
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {  url, title, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({ error: "invalid ID" })
  }

  if (!isUuid(id)){
    return response.status(400).json({ error: "invalid ID" })
  }

  const updatedRepo = {
    id,
    url, 
    title, 
    techs,
    likes: 0
  };

  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0){
    return response.status(400).json({ error: "invalid ID" })
  };

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository){
    return response.status(400).json({ error: "invalid ID" })
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
