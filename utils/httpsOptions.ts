import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'fs';

export const httpsOptions = {
  key: readFileSync('./.nginx/127.0.0.1+2-key.pem'),
  cert: readFileSync('./.nginx/127.0.0.1+2.pem'),
} satisfies HttpsOptions;
