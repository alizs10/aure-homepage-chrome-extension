import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const target = process.argv[2] || 'all';
const baseManifest = JSON.parse(fs.readFileSync('manifest.base.json', 'utf8'));
const version = baseManifest.version;

if (target === 'source') {
    const zipName = `aure-homepage-source-v${version}.zip`;
    if (fs.existsSync(zipName)) {
        fs.unlinkSync(zipName);
    }
    console.log(`Packaging source code to ${zipName}...`);
    const excludes = [
        'node_modules/*',
        '*node_modules*',
        'dist/*',
        '*dist/*',
        'dist.pem',
        '*.pem',
        '.git/*',
        '*/**/.git/*',
        '.github/*',
        '*/**/.github/*',
        '*.zip',
        '*/**.zip',
        '*.DS_Store',
        '*/**/.DS_Store',
        '*/**/__MACOSX*',
        'plans/*',
        '*plans/*',
        'ARCHITECTURE_AUDIT.md',
        'PROJECT_LOGIC.md',
        '.mimocode/*',
        '*/**/.mimocode/*',
        '.vscode/*',
        '*/**/.vscode/*',
        '.idea/*',
        '*/**/.idea/*'
    ].map(pattern => `-x "${pattern}"`).join(' ');

    execSync(`zip -q -r "${zipName}" . ${excludes}`, { stdio: 'inherit' });
    console.log(`✅ Created ${zipName}`);
    process.exit(0);
}

const targets = target === 'all' ? ['chrome', 'firefox'] : [target];

for (const t of targets) {
    const dir = path.join('dist', t);
    if (!fs.existsSync(dir)) {
        console.error(`Directory ${dir} not found. Run "bun run build:${t}" first.`);
        process.exit(1);
    }
    const zipName = `aure-homepage-${t}-v${version}.zip`;
    console.log(`Packaging ${t} extension to ${zipName}...`);
    execSync(`cd dist/${t} && zip -q -r "../../${zipName}" . -x "*.DS_Store" "*/**/.DS_Store" "__MACOSX*" "*/**/__MACOSX*"`, { stdio: 'inherit' });
    console.log(`✅ Created ${zipName}`);
}

