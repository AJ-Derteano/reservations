import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS: CorsOptions = {
  origin: [
    'https://ajderteano.nom.pe',
    'https://www.ajderteano.nom.pe',
    'http://ajderteano.nom.pe',
    'http://www.ajderteano.nom.pe',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};
