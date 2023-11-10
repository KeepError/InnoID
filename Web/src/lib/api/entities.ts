export interface User {
  [key: string]: string | undefined;
  user_id: string;
  email: string;
}

export interface App {
  app_id: string;
  name: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

// export interface LoginContext {}
