export interface Repository {
  owner: string;
  name: string;
  url: string;
}

export const repositoryName = (r: Repository) => `${r.owner}/${r.name}`;
