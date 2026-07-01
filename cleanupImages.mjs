import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, 'src', 'app');

const images = [
  { id: 'photo-1451187580459-43490279c0fa', name: 'img-global-scale.jpg' },
  { id: 'photo-1558494949-ef010cbdcc31',   name: 'img-server-rack.jpg' },
  { id: 'photo-1526374965328-7f61d4dc18c5', name: 'img-matrix-code.jpg' },
  { id: 'photo-1507208773393-40d9fc670acf', name: 'img-team-meeting.jpg' },
  { id: 'photo-1618005182384-a83a8bd57fbe', name: 'img-discovery.jpg' },
  { id: 'photo-1550751827-4bd374c3f58b',    name: 'img-servers.jpg' },
  { id: 'photo-1498050108023-c5249f4df085', name: 'img-coding-laptop.jpg' },
  { id: 'photo-1677442136019-21780ecad995', name: 'img-ai-tech.jpg' },
  { id: 'photo-1512941937669-90a1b58e7e9c', name: 'img-mobile-dev.jpg' },
  { id: 'photo-1561070791-2526d30994b5',    name: 'img-design-tools.jpg' },
  { id: 'photo-1551288049-bebda4e38f71',    name: 'img-analytics.jpg' },
  { id: 'photo-1517694712202-14dd9538aa97', name: 'img-coding-workspace.jpg' },
  { id: 'photo-1620712943543-bcc4688e7485', name: 'img-ai-future.jpg' },
  { id: 'photo-1555066931-4365d14bab8c',    name: 'img-code-editor.jpg' },
  { id: 'photo-1618401471353-b98afee0b2eb', name: 'img-network-abstract.jpg' },
  { id: 'photo-1607799279861-4dd421887fb3', name: 'img-cloud-servers.jpg' },
  { id: 'photo-1552664730-d307ca884978',    name: 'img-team-collab.jpg' },
  { id: 'photo-1573164713988-8665fc963095', name: 'img-developer-desk.jpg' },
  { id: 'photo-1497366216548-37526070297c', name: 'img-office.jpg' },
  { id: 'photo-1461749280684-dccba630e2f6', name: 'img-programming.jpg' },
  
  // A few extra mappings seen in contact/portfolio
  { id: 'photo-1516387938699-a93567ec168e', name: 'img-office.jpg' },
  { id: 'photo-1432888498266-38ffec3eaf0a', name: 'img-team-collab.jpg' },
  { id: 'photo-1504639725590-34d0984388bd', name: 'img-code-editor.jpg' },
  { id: 'photo-1526304640581-d334cdbbf45e', name: 'img-mobile-dev.jpg' },
  { id: 'photo-1518770660439-4636190af475', name: 'img-server-rack.jpg' },
];

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

  // 1. Remove background texture wrapper blocks
  // Specifically: <div ...> <Image ... alt="Background texture" ... /> </div>
  const bgTextureRegex = /<div className="absolute inset-0 z-0 pointer-events-none rounded-\[inherit\] overflow-hidden">\s*<Image src="https:\/\/images\.unsplash\.com\/photo-[^"]+" alt="Background texture" fill className="[^"]+" \/>\s*<\/div>/g;
  content = content.replace(bgTextureRegex, '{/* Background texture removed */}');
  
  // Also remove other background images in sections (like "Hero background", "Channels background")
  // For these, they might be in a wrapper with other things, or standalone
  const otherBgRegex = /<div className="z-10 relative absolute inset-0 z-0 pointer-events-none rounded-\[inherit\] overflow-hidden">\s*<Image src="https:\/\/images\.unsplash\.com\/photo-[^"]+" alt="[^"]+ background" fill className="[^"]+" \/>\s*<div className="absolute inset-0 bg-[^"]+" \/>\s*<\/div>/g;
  content = content.replace(otherBgRegex, '{/* Background removed */}');

  // One more variant: simple background without inner gradient
  const simpleBgRegex = /<div className="absolute inset-0 z-0 pointer-events-none rounded-\[inherit\] overflow-hidden">\s*<Image src="https:\/\/images\.unsplash\.com\/photo-[^"]+" alt="[^"]+ background" fill className="[^"]+" \/>\s*(<div className="absolute inset-0 bg-[^"]+" \/>)?\s*<\/div>/g;
  content = content.replace(simpleBgRegex, '{/* Background removed */}');

  // 2. Map remaining URLs to local images
  images.forEach(img => {
    const regex = new RegExp(`https://images\\.unsplash\\.com/${img.id}[^"']*`, 'g');
    content = content.replace(regex, `/images/${img.name}`);
  });
  
  // Fallback for any remaining unmapped images
  content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[A-Za-z0-9\-]+\?[^"']*/g, '/images/img-servers.jpg');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${path.relative(__dirname, file)}`);
  }
});

console.log('All files updated successfully.');
