export class RemoteIdpCall {
  constructor(public code: string) {
  }

  GV = 0;
  SV = 0;
  NB = 0;
  inference = 2;
  stable = false;
  cp = false;
  filename = 'main';
  eInput = '';
}

export class RemoteIdpResponse {
  stdout: string;
  stderr: string;
}
