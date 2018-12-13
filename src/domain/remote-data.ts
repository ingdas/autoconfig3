export class RemoteIdpCall {
  GV = 0;
  SV = 0;
  NB = 0;
  inference = 2;
  stable = false;
  cp = false;
  filename = 'main';
  eInput = '';

  constructor(public code: string) {
  }
}

export class RemoteIdpResponse {
  stdout: string;
  stderr: string;
}
