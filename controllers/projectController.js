import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as projectService from "../services/projectService.js";
import * as issuesService from "../services/issuesService.js";

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const removeProject = async (request) => {
    const url = new URL(request.url);
    const urlParts = url.pathname.split("/");
    await issuesService.removeIssueById(urlParts[4])
    await projectService.removeById(urlParts[2])
    return redirectTo("/projects");
}

const addProject = async (request) => {
  const formData = await request.formData();
  const name = formData.get("name");
  await projectService.newProject(name);
  return redirectTo("/projects");
};

const viewProject = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  const data = {
    project: await projectService.findById(urlParts[2]),
    issues: await issuesService.findAllIssues(urlParts[2]),
  };

  return new Response(await renderFile("project.eta", data), responseDetails);
};

const viewProjects = async (request) => {
  const data = {
    projects: await projectService.findAll(),
  };

  return new Response(await renderFile("projects.eta", data), responseDetails);
};

export { addProject, viewProjects, viewProject, removeProject };