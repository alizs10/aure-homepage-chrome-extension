import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export type TargetBrowser = 'chrome' | 'firefox';

export function getManifest(target: TargetBrowser) {
    const manifestBasePath = fileURLToPath(new URL('./manifest.base.json', import.meta.url));
    const manifest = JSON.parse(fs.readFileSync(manifestBasePath, 'utf8'));

    // In Manifest V3, origins must be in optional_host_permissions to allow
    // permissions.request() and permissions.remove() at runtime in Chrome and Firefox.
    const baseHostPerms = [
        ...(manifest.host_permissions || []),
        ...(manifest.optional_host_permissions || []),
    ];
    delete manifest.host_permissions;

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
            type: 'module',
        };
        manifest.optional_host_permissions = Array.from(new Set(baseHostPerms));
    } else if (target === 'firefox') {
        manifest.browser_specific_settings = {
            gecko: {
                id: 'aure-homepage@auredev.ir',
                strict_min_version: '142.0',
                data_collection_permissions: {
                    required: ['none'],
                },
            },
        };
        manifest.background = {
            scripts: ['background.js'],
            type: 'module',
        };
        manifest.permissions = [
            ...(manifest.permissions || []),
            'sessions',
            'tabs',
        ];
        manifest.optional_host_permissions = Array.from(
            new Set([...baseHostPerms, 'https://faviconapi.com/*'])
        );
    }

    return manifest;
}
