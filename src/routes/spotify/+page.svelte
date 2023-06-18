<script>
    import { Canvas, useFrame } from "svelte-three";
    import * as THREE from "three";
  
    export let playlistURI = "";
    export let embedWidth = "300";
    export let embedHeight = "380";
  
    let group;
  
    const accessToken = "your_spotify_access_token";
    /**
	 * @type {string | any[]}
	 */
    let trackData = [];
  
    /**
	 * @param {string} playlistURI
	 */
    async function fetchPlaylistData(playlistURI) {
      const playlistId = playlistURI.split(":")[2];
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
  
      trackData = data.items.map((item) => ({
        track: item.track.name,
        artist: item.track.artists[0].name,
        url: item.track.external_urls.spotify,
        position: new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).multiplyScalar(Math.random() * 20),
      }));
    }
  
    function handleClick(cubeData) {
      window.open(cubeData.url, "_blank");
    }
  
    function setRotation(component) {
      useFrame(() => {
        if (component.el) {
          component.el.rotation.x += 0.01;
          component.el.rotation.y += 0.01;
          component.el.rotation.z += 0.01;
        }
      });
      return component;
    }
  </script>
  
  {#if playlistURI}
    <div>
      <iframe
        title="Spotify Playlist Embed"
        src={`https://open.spotify.com/embed/playlist/${playlistURI.split(':')[2]}`}
        width={embedWidth}
        height={embedHeight}
        frameborder="0"
        allowtransparency={true}
        allow="encrypted-media"
        sveltekit:prefetch
      ></iframe>
      <button on:click={() => fetchPlaylistData(playlistURI)}>
        Load Playlist 3D Visualization
      </button>
    </div>
  {:else}
    <p>No playlist URI provided.</p>
  {/if}
  
  <Canvas>
    <scene>
      {#if trackData.length > 0}
        <group bind:this="{group}">
          {#each trackData as cubeData, i}
            <mesh
              on:click={() => handleClick(cubeData)}
              bind:this={setRotation}
              position="{cubeData.position}"
              scale="{new THREE.Vector3(1, 1, 1)}"
            >
              <boxBufferGeometry arguments="{[1, 1, 1]}" />
              <meshStandardMaterial color="{new THREE.Color(`hsl(${(i / trackData.length) * 360}, 100%, 50%)`)}" />
            </mesh>
          {/each}
        </group>
      {/if}
  
      <ambientLight />
      <pointLight position="{new THREE.Vector3(2, 0, -70)}" />
    </scene>
  </Canvas>