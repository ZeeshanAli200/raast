export type BankConfig = {
  bankName: string;
  deepLinkUrl: string;
  deepLinkUrlIos: string;
  redirectUrl: string;
  autoRedirectTimerSeconds: number;
  transactionId: string;
};

export enum InquireStatusEnum {
  NOTFOUND = '1231',
  SUCCESS = '0000',
  FAILED = '0012',
  PENDING = '0037',
}

export type Inquire = {
  transactionId: string;
  status: InquireStatusEnum;
  message: string;
};
export type SlideType = { description: string; stepImage: string; step: number };

export type MongoResponse = {
  response: {
    bankName?: string | undefined;
    steps?: SlideType[];
    status: boolean;
  };
};
