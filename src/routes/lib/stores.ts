import { writable } from 'svelte/store';

export const activeLargeComponent = writable(null);
export const largeComponentActive = writable(false);
export const activeSmallComponent = writable(null);