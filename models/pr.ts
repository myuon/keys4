export interface Pr {
  id: string;
  url: string;
  title: string;
  createdAt: number;
  mergedAt?: number;
  mergeCommitHash?: string;
  author?: string;
}
