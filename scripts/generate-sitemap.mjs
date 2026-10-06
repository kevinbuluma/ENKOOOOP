import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Mirror Vite's local public env-file loading for values needed before Vite starts.
for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  try {
    const content = await readFile(resolve(file), 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?(VITE_SITE_URL|VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY)\s*=\s*(.*?)\s*$/);
      if (!match || process.env[match[1]]) continue;
      const rawValue = match[2].trim();
      const value = rawValue.startsWith('"') || rawValue.startsWith("'")
        ? rawValue.slice(1, rawValue.indexOf(rawValue[0], 1) > 0 ? rawValue.indexOf(rawValue[0], 1) : undefined)
        : rawValue.replace(/\s+#.*$/, '');
      process.env[match[1]] = value;
    }
  } catch { /* optional local env files */ }
}

const rawBase = process.env.VITE_SITE_URL || process.env.PUBLIC_SITE_URL || '';
if (!rawBase) {
  console.warn('Skipping sitemap generation: set VITE_SITE_URL to the verified canonical domain before production builds.');
  process.exit(0);
}

let base;
try {
  const parsedBase = new URL(rawBase);
  if (!['http:', 'https:'].includes(parsedBase.protocol)) throw new Error('Use an HTTP(S) URL.');
  base = parsedBase.origin;
} catch {
  console.error('VITE_SITE_URL must be a valid absolute URL. Sitemap was not generated.');
  process.exit(1);
}

const staticPages = [
  ['/', 'weekly', '1.0'],
  ['/properties', 'daily', '0.9'],
  ['/about', 'monthly', '0.6'],
  ['/services', 'monthly', '0.7'],
  ['/insights', 'weekly', '0.7'],
  ['/contact', 'monthly', '0.5'],
];
const records = staticPages.map(([path, frequency, priority]) => ({ path, frequency, priority }));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (supabaseUrl && anonKey) {
  for (const [table, route, frequency, priority] of [['properties', 'properties', 'weekly', '0.8'], ['insights', 'insights', 'monthly', '0.6']]) {
    try {
      const endpoint = new URL(`/rest/v1/${table}?select=slug,updated_at&is_published=eq.true`, supabaseUrl);
      const response = await fetch(endpoint, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      for (const row of Array.isArray(rows) ? rows : []) {
        if (typeof row.slug !== 'string' || !/^[a-z0-9-]+$/i.test(row.slug)) continue;
        records.push({ path: `/${route}/${row.slug}`, frequency, priority, lastmod: row.updated_at });
      }
    } catch (error) {
      console.warn(`Could not include published ${table} in the sitemap: ${error instanceof Error ? error.message : 'request failed'}`);
    }
  }
}

const escapeXml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const urls = records.map(({ path, frequency, priority, lastmod }) => `  <url><loc>${escapeXml(base + path)}</loc>${lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString().slice(0, 10))}</lastmod>` : ''}<changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
await mkdir(resolve('public'), { recursive: true });
await writeFile(resolve('public/sitemap.xml'), xml, 'utf8');
await writeFile(resolve('public/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /saved\n\nSitemap: ${base}/sitemap.xml\n`, 'utf8');
console.log(`Generated sitemap with ${records.length} public URL(s) for ${base}`);
