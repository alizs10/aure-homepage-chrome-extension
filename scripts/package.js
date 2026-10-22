import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const target = process.argv[2] || 'all';
const baseManifest = JSON.parse(fs.readFileSync('manifest.base.json', 'utf8'));
const version = baseManifest.version;

const targets = target === 'all' ? ['chrome', 'firefox'] : [target];

for (const t of targets) {
    const dir = path.join('dist', t);
    if (!fs.existsSync(dir)) {
        console.error(`Directory ${dir} not found. Run "bun run build:${t}" first.`);
        process.exit(1);
    }
    const zipName = `aure-homepage-${t}-v${version}.zip`;
    console.log(`Packaging ${t} extension to ${zipName}...`);
    execSync(`cd dist/${t} && zip -q -r "../../${zipName}" . -x "*.DS_Store"`, { stdio: 'inherit' });
    console.log(`✅ Created ${zipName}`);
}
