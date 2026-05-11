import * as migration_20260511_064557_initial from './20260511_064557_initial';

export const migrations = [
  {
    up: migration_20260511_064557_initial.up,
    down: migration_20260511_064557_initial.down,
    name: '20260511_064557_initial'
  },
];
