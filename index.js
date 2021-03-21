import { /* Migrations, */ Commands } from './cli/commands';

(async () => {
  const [command, ...options] = process.argv.slice(2);
  console.log(`Running ${command}`);

  try {
    const output = await Commands[command](...options);
    if(output)
      console.log(output);
  }
  catch(error) {
    console.error(error);
  }

  process.exit();
})();
