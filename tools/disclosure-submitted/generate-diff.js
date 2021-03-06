"use strict";

import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

const PR_NUMBER = process.env.PR_NUMBER.toString();

const files = await octokit.pulls
  .listFiles({
    owner: "418sec",
    repo: "huntr",
    pull_number: PR_NUMBER,
  })
  .then((response) => {
    return response.data;
  })
  .catch(() => {
    return "N/A";
  });

if (files == "N/A") {
  core.setFailed("Error whilst getting list of files...");
}

if (files.length === 0) {
  core.setFailed("No difference between HEAD and BASE...");
}

let diff = [];

files.forEach((file) => {
  let change =
    file.status === "added"
      ? "A"
      : file.status === "removed"
      ? "D"
      : file.status === "modified"
      ? "M"
      : "Error";

  diff.push({
    change: change,
    path: file.filename,
  });
});

console.log(`The diff generated by this PR ${PR_NUMBER} is: \n`, diff);

core.setOutput("diff", diff);
