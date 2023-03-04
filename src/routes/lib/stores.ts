import { writable } from 'svelte/store';

export const activeLargeComponent = writable(null);
export const activeSmallComponent = writable(null);