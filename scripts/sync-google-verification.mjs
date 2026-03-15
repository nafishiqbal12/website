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
  const sourceCandidates = [
    sourcePath,
    path.join(workspaceRoot, `${fileName.replace('.html', '')} (1).html`),
    publicPath,
  ];

  const resolvedSourcePath = sourceCandidates.find((candidate) => fs.existsSync(candidate));

  if (!resolvedSourcePath) {
    console.warn(`Verification file not found. Skipping sync for ${fileName}.`);
    return;
  }

  // Keep public copy in sync from whichever valid source file exists.
  if (path.resolve(resolvedSourcePath) !== path.resolve(publicPath)) {
    copyExactFile(resolvedSourcePath, publicPath);
  }

  if (fs.existsSync(path.join(workspaceRoot, 'dist'))) {
    copyExactFile(resolvedSourcePath, distPath);
  }

  console.log(`Synced ${fileName} using source: ${path.basename(resolvedSourcePath)}.`);
}

main();
