import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, 'src', 'app');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(appDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Remove empty decorative blurred circles
  // e.g. <div className="absolute top-0 ... rounded-full blur-[140px] pointer-events-none" />
  const bubbleRegex = /<div className="absolute [^"]*rounded-full blur-\[[0-9]+px\] pointer-events-none" \/>/g;
  content = content.replace(bubbleRegex, '{/* Background blob removed */}');

  // Also remove {/_ Background texture removed _/} comments to clean up
  content = content.replace(/\{\/\* Background texture removed \*\/}/g, '');
  content = content.replace(/\{\/\* Background removed \*\/}/g, '');
  content = content.replace(/\{\/\* Background blob removed \*\/}/g, '');
  content = content.replace(/\{\/\* Backgrounds \*\/}/g, '');
  
  // Clean up empty lines created by these removals
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated bubbles in ${path.relative(__dirname, file)}`);
  }
});

console.log('Bubbles cleanup done.');
