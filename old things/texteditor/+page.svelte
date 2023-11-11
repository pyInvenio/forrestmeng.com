
<script>
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    
    let letters = writable([]);
    
    let id = 0;
  
    const addLetter = (letter) => {
      letters.update(n => [...n, { id: id++, letter }]);
      setTimeout(() => {
        letters.update(n => {
          n.shift();
          return n;
        });
      }, 3000);
    };
  
    onMount(() => {
      window.addEventListener("keypress", (event) => {
        if (event.key === "Enter") return;
        if (event.key === "Backspace") return;
        addLetter(event.key);
      });
    });
  </script>
  
  <style lang="postcss">
    .container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 2em;
    }
    
    .smoke {
      animation: smoke 2s linear 0s forwards;
      opacity: 0;
    }
    
    @keyframes smoke {
      0% { opacity: 1; }
      100% {
        opacity: 0;
        transform: translateY(-50px);
      }
    }
  </style>
  
  <div class="container">
    {#each $letters as letter (letter.id)}
      <span class="smoke" key={letter.id}>{letter.letter}</span>
    {/each}
  </div>