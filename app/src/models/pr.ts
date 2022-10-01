export interface Pr {
  id: string;
  url: string;
  title: string;
  mergedAt?: number;
  mergeCommitHash?: string;
  author?: string;
}
