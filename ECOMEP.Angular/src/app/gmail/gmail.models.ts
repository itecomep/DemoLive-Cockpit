export interface GmailEmail {
  gmailMessageId: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  isSentByUser: boolean;
  snippet: string;
}

export interface GmailThread {
  threadId: string;
  messages: GmailEmail[];
}
