import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const cors = {
  credentials: true,
  origin: [
    'http://localhost:8100',
    'http://192.168.1.108:8100',
    'http://192.168.1.2:8100',
  ],
} satisfies CorsOptions;
