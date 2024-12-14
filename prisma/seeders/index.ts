import { seedDev } from './dev';
import { seedProd } from './prod';

function seed() {
  if (process.env.NODE_ENV === 'production') {
    seedProd();
  } else {
    seedDev();
  }
}

seed();
