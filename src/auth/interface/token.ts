export type ILoginToken = {
  accessToken: IToken;
  refreshToken: IToken;
};

export type IToken = {
  value: string;
  expiredAt: string;
};

export type ILoginAccessToken = {
  accessToken: IToken;
};
