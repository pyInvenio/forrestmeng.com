<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
  
    export let data: any;
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
  
    inject({ mode: dev ? 'development' : 'production' });
  
    let state = 'out'; // Add this state variable
  
    // Function to handle the transition end
    function handleTransitionEnd() {
      state = 'in';
    }
  </script>
  
  <div
    transition:fly="{{ y: 100, duration: 500, easing: cubicOut }}"
    on:transitionend={handleTransitionEnd}
    class="bg-white text-black absolute inset-0"
    style="opacity: {state === 'in' ? 1 : 0}"
  >
    <slot />
  </div>
  
  <style>
    /* Add your styles here as needed */
  </style>
  