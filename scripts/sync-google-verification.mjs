import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const fileName = 'google3f437b20b9da007e.html';
const sourcePath = path.join(workspaceRoot, fileName);
const publicPath = path.join(workspaceRoot, 'public', fileName);
const distPath = path.join(workspaceRoot, 'dist', fileName);

function copyExactFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing required verification file at project root: ${fileName}`);
    process.exit(1);
  }

  copyExactFile(sourcePath, publicPath);

  if (fs.existsSync(path.join(workspaceRoot, 'dist'))) {
    copyExactFile(sourcePath, distPath);
  }

  console.log(`Synced ${fileName} to public/ and dist/ (if present).`);
}

main();
