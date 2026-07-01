import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

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
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { console.log(`[SKIP] ${path.basename(dest)} already exists`); return resolve(); }
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function downloadAll() {
  for (const img of images) {
    const url = `https://images.unsplash.com/${img.id}?auto=format&fit=crop&q=80&w=1200`;
    const dest = path.join(outputDir, img.name);
    try {
      await download(url, dest);
      const size = Math.round(fs.statSync(dest).size / 1024);
      console.log(`[OK] ${img.name} (${size}KB)`);
    } catch (e) {
      console.log(`[ERR] ${img.name}: ${e.message}`);
    }
  }
  console.log('\nDone! Images saved to public/images/');
}

downloadAll();
