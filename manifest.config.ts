import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export type TargetBrowser = 'chrome' | 'firefox';

export function getManifest(target: TargetBrowser) {
    const manifestBasePath = fileURLToPath(new URL('./manifest.base.json', import.meta.url));
    const manifest = JSON.parse(fs.readFileSync(manifestBasePath, 'utf8'));

    if (target === 'chrome') {
        manifest.key =
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqVSsWgHXNk5g1WZUuLpN/P+QgU36daupNUxHXkTCbCGhwDXXnksJ/PhXoUgJgZfLEzeNDiCmJSqqRjrTjbmxAGOb4kPgCplxUpC8nQAWOAZ+OLYE5XFqS3Sc65krb7SKxl33/ed4yq4R0Dna7lgwTwvOSxWxae8m+/MY6SZLpZ6jdUxN5hERgQmQUumMJhTx8hJ6Kdw1kscZT9w/vPtThsG3/ZfhXKdhx9R3BOlKqgZi8F5ji/+WHhU6gUw8AClJAZA8WE8vGRVxViXCcDO1oYP9/qdQlyJFKXbpricbT1iX/l7NHGYaIynJjuqhl+GpXyJlikAUrKNOAZ/MXmUMdwIDAQAB';
        manifest.permissions = ['favicon', ...manifest.permissions];
        manifest.web_accessible_resources = [
            {
                resources: ['_favicon/*'],
                matches: ['<all_urls>'],
                extension_ids: ['*'],
            },
        ];
        manifest.background = {
            service_worker: 'background.js',
        };
    } else if (target === 'firefox') {
        manifest.browser_specific_settings = {
            gecko: {
                id: 'aure-homepage@auredev.ir',
                strict_min_version: '109.0',
            },
        };
        manifest.background = {
            scripts: ['background.js'],
        };
        manifest.permissions = [
            ...(manifest.permissions || []),
            'sessions',
        ];
        manifest.host_permissions = [
            ...(manifest.host_permissions || []),
            'https://faviconapi.com/*',
        ];
    }

    return manifest;
}
