import { graphql } from "./src/graphql";

const QUERY = `
  {
    repository(owner: "octokit", name: "graphql.js") {
      issues(last: 3, states: [OPEN]) {
        edges {
          node {
            number
            title
          }
        }
      }
    }
  }
`;

async function main() {
  try {
    const { repository } = await graphql(QUERY);
    for (const { node: issue } of repository.issues.edges) {
      console.log(`* ${issue.number}: ${issue.title}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}

main();
