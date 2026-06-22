export type SingleItemSection = {
  info: Array<string>;
  solid: Array<string>;
  links: Array<{
    id: string;
    groupName: string;
    items: Array<{
      provider: string;
      address: string;
    }>;
  }>;
};

export type RemoteList = {
  pages: number;
  currentPage: number;
  items: { title?: string; image?: string; slug: string }[];
};

export type RemoteItem = {
  title: string;
  videoUrl?: string;
  images: Array<string>;
  sections: Array<SingleItemSection>;
};

export type Strategy = {
  fetchList: (
    page: number,
    search: string,
    category: string,
  ) => Promise<RemoteList>;
  fetchItem: (slug: string) => Promise<RemoteItem>;
};
