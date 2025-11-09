const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

async function copySwaggerFiles() {
  const sourceDir = path.join(process.cwd(), 'node_modules', 'swagger-ui-dist');
  const destDir = path.join(process.cwd(), 'public', 'swagger-ui');

  if (!fs.existsSync(destDir)) {
    await mkdir(destDir, { recursive: true });
  }
  const filesToCopy = [
    'swagger-ui.css',
    'swagger-ui-bundle.js',
    'swagger-ui-standalone-preset.js',
    'favicon-16x16.png',
    'favicon-32x32.png'
  ];

  for (const file of filesToCopy) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    if (fs.existsSync(sourcePath)) {
      await copyFile(sourcePath, destPath);
      console.log(`Copied ${file} to ${destPath}`);
    } else {
      console.warn(`Warning: ${file} not found in ${sourceDir}`);
    }
  }
}

copySwaggerFiles().catch(console.error);
