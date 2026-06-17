const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

// Convert ke PascalCase (untuk nama class)
const toPascalCase = (str) =>
  str.replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, '').toUpperCase());

// Convert ke UPPER_SNAKE_CASE (untuk nama tabel Oracle)
const toUpperSnakeCase = (str) =>
  str.replace(/([a-z])([A-Z])/g, '$1_$2')
     .replace(/-/g, '_')
     .toUpperCase();

async function main() {
  const args = process.argv.slice(2);
  const nameArg = args.find((arg) => arg.startsWith('--name='));

  if (!nameArg) {
    console.error('❌ Error: --name=NamaEntity wajib diisi');
    console.error('Contoh: pnpm entity:create --name=product');
    rl.close();
    process.exit(1);
  }

  const entityName = nameArg.split('=')[1];
  const className = toPascalCase(entityName);
  const defaultTableName = toUpperSnakeCase(entityName);

  console.log(`\n🏗️  Membuat entity: ${className}`);

  // Tanya nama tabel Oracle
  const tableName = await question(
    `📋 Nama tabel di Oracle [default: ${defaultTableName}]: `
  );
  const finalTableName = tableName.trim() || defaultTableName;

  rl.close();

  // Generate isi file entity
  const content = `import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: '${finalTableName}' })
export class ${className} {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id!: number;

  // @OneToOne(() => User, (user) => user.order)
  // @JoinColumn({name: "USER_ID"})
  // user_id!: number;

  //@OneToMany(() => User, (user) => user.order)
  //@JoinColumn({name: "USER_ID"})
  //user_id!: number;

  // @Column({ name: 'nameTable' })
  // nameTable!: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'DELETED_AT' })
  deletedAt?: Date | null;
}
`;

  // Tentukan path output
  const outputDir = path.join(__dirname, '..', 'src', 'database', 'entities');
  const fileName = `${entityName.toLowerCase()}.entity.ts`;
  const filePath = path.join(outputDir, fileName);

  // Pastikan folder ada
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Cek apakah file sudah ada
  if (fs.existsSync(filePath)) {
    console.error(`\n❌ File ${fileName} sudah ada di ${outputDir}`);
    process.exit(1);
  }

  // Tulis file
  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`\n✅ Entity berhasil dibuat!`);
  console.log(`📁 File  : src/database/entities/${fileName}`);
  console.log(`🏷️  Class : ${className}`);
  console.log(`🗄️  Tabel : ${finalTableName}`);
  console.log(`\n💡 Jangan lupa tambahkan kolom yang diperlukan di file entity tersebut.`);
}

main();