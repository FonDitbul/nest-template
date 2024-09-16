export type IMailSendOption = {
  to: string[];
  from: string;
  subject: string;
  html: string;
  cc: string[];
  bcc: string[];
};
