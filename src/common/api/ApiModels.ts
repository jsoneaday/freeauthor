export type Work = {
  id: number;
  updated_at: string;
  title: string;
  content: string;
  author_id: number;
};

export type Profile = {
  id: number;
  updated_at: string;
  username: string;
  fullname: string;
  description: string;
  owner_address: string;
  social_link_primary: string;
  social_link_second: string;
};
