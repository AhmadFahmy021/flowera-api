const { execSync } = require('child_process');

const args = process.argv.slice(2);
const nameArg = args.find((arg) => arg.startsWith('--name='));

if (!nameArg) {
  console.error('❌ Error: --name=NamaMigration wajib diisi');
  console.error('Contoh: pnpm migration:generate --name=CreateUserTable');
  process.exit(1);
}

const name = nameArg.split('=')[1];
const path = `src/database/migrations/${name}`;

console.log(`📦 Generating migration: ${name}`);

try {
  execSync(
    `pnpm typeorm migration:generate ${path}`,
    { stdio: 'inherit' }
  );
} catch (error) {
  process.exit(1);
}