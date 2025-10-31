import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const filesToCopy = ['index.html', 'styles.css', 'app.js'];
const directoriesToCopy = ['assets', 'public'];

const DEFAULT_ENV = {
  COINGECKO_API_BASE: 'https://api.coingecko.com/api/v3',
  REFRESH_INTERVAL_MS: '60000'
};

async function cleanDist() {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });
}

function parseEnvFile(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const delimiterIndex = line.indexOf('=');
      if (delimiterIndex === -1) {
        return acc;
      }

      const key = line.slice(0, delimiterIndex).trim();
      let value = line.slice(delimiterIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key) {
        acc[key] = value;
      }

      return acc;
    }, {});
}

async function loadEnvFromFiles() {
  const envCandidates = ['.env.local', '.env.production', '.env'];
  const envData = {};

  for (const fileName of envCandidates) {
    const filePath = path.join(rootDir, fileName);

    try {
      const content = await fs.readFile(filePath, 'utf8');
      Object.assign(envData, parseEnvFile(content));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return envData;
}

function resolveConfigValue(envData, key, fallback) {
  if (process.env[key] && process.env[key].length > 0) {
    return process.env[key];
  }

  if (envData[key] && envData[key].length > 0) {
    return envData[key];
  }

  return fallback;
}

function normalizeInterval(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.round(parsed);
}

async function writeRuntimeConfig(envData) {
  const apiBase = resolveConfigValue(envData, 'COINGECKO_API_BASE', DEFAULT_ENV.COINGECKO_API_BASE);
  const refreshInterval = normalizeInterval(
    resolveConfigValue(envData, 'REFRESH_INTERVAL_MS', DEFAULT_ENV.REFRESH_INTERVAL_MS),
    Number(DEFAULT_ENV.REFRESH_INTERVAL_MS)
  );

  const runtimeConfig = {
    COINGECKO_API_BASE: apiBase,
    REFRESH_INTERVAL_MS: refreshInterval
  };

  const configContent = `window.__ENV__ = ${JSON.stringify(runtimeConfig, null, 2)};\n`;
  await fs.writeFile(path.join(distDir, 'config.js'), configContent, 'utf8');
}

async function copyStaticFile(fileName) {
  const sourcePath = path.join(rootDir, fileName);
  const destinationPath = path.join(distDir, fileName);

  try {
    await fs.copyFile(sourcePath, destinationPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

async function copyStaticDirectory(directoryName) {
  const sourcePath = path.join(rootDir, directoryName);

  try {
    const entries = await fs.readdir(sourcePath, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const entrySourcePath = path.join(sourcePath, entry.name);
        const entryDestinationPath = path.join(distDir, directoryName, entry.name);

        if (entry.isDirectory()) {
          await fs.mkdir(entryDestinationPath, { recursive: true });
          await copyStaticDirectory(path.join(directoryName, entry.name));
        } else if (entry.isFile()) {
          await fs.mkdir(path.dirname(entryDestinationPath), { recursive: true });
          await fs.copyFile(entrySourcePath, entryDestinationPath);
        }
      })
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

async function main() {
  console.log('🔧 Building CryptoTracker static bundle...');

  await cleanDist();

  await Promise.all(filesToCopy.map(copyStaticFile));
  await Promise.all(directoriesToCopy.map(copyStaticDirectory));

  const envData = await loadEnvFromFiles();
  await writeRuntimeConfig(envData);

  console.log('✅ Build completed. Output available in ./dist');
}

main().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
