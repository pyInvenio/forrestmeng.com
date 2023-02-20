import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'main',
  repo: 'https://github.com/pyInvenio/pyInvenio.github.io.git', // Update to point to your repository
  user: {
   name: 'Forrest Meng', // update to use your name
   email: 'forrestm.a113@gmail.com' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);