import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS: CorsOptions = {
  origin: [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'https://ajderteano.nom.pe',
    'http://ajderteano.nom.pe',
    'https://www.ajderteano.nom.pe',
    'http://www.ajderteano.nom.pe',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};
