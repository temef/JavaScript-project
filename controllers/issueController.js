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

const newIssues = async (request) => {
  const formData = await request.formData()
  const descr = formData.get("description")
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  await issuesService.newIssue(urlParts[2], descr)

  return redirectTo(`/projects/${urlParts[2]}`);
};

const resolveIssue = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  await issuesService.removeIssueById(urlParts[4])

  return redirectTo(`/projects/${urlParts[2]}`);
}

export { newIssues, resolveIssue };