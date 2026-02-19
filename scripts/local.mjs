import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import net from 'node:net';

function findRepoRoot(startDir) {
  let current = startDir;
  while (true) {
    const candidate = path.join(current, 'package.json');
    if (fs.existsSync(candidate)) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function listListeningPids(port) {
  try {
    const out = execFileSync('lsof', ['-ti', `TCP:${port}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!out) return [];
    return out
      .split('\n')
      .map((line) => Number(line.trim()))
      .filter((pid) => Number.isInteger(pid) && pid > 0);
  } catch {
    return [];
  }
}

function killPids(pids, signal) {
  for (const pid of pids) {
    try {
      process.kill(pid, signal);
    } catch {
      // ignore
    }
  }
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function canConnect(host, port, timeoutMs = 500) {
  return await new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const onDone = (ok) => {
      try {
        socket.destroy();
      } catch {}
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.on('connect', () => onDone(true));
    socket.on('timeout', () => onDone(false));
    socket.on('error', () => onDone(false));
  });
}

async function freePort(port, label) {
  const pids = listListeningPids(port);
  if (pids.length === 0) return;

  process.stdout.write(`[local] ${label}: liberando puerto ${port} (pid(s): ${pids.join(', ')})\n`);
  killPids(pids, 'SIGTERM');
  await sleep(800);

  const still = listListeningPids(port);
  if (still.length === 0) return;

  process.stdout.write(`[local] ${label}: forzando kill puerto ${port} (pid(s): ${still.join(', ')})\n`);
  killPids(still, 'SIGKILL');
  await sleep(300);
}

function runNpm(repoRoot, script) {
  const child = spawn('npm', ['run', script], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });
  return child;
}

function runNpmSync(repoRoot, args) {
  const result = spawn('npm', args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });
  return result;
}

const repoRoot = findRepoRoot(process.cwd());
if (!repoRoot) {
  process.stderr.write('[local] No se encontró package.json hacia arriba desde el directorio actual.\n');
  process.exit(1);
}

// Ensure apps/api/.env exists so Prisma can read DATABASE_URL in local dev
try {
  const apiEnv = path.join(repoRoot, 'apps', 'api', '.env');
  const apiEnvExample = path.join(repoRoot, 'apps', 'api', '.env.example');
  if (!fs.existsSync(apiEnv) && fs.existsSync(apiEnvExample)) {
    fs.copyFileSync(apiEnvExample, apiEnv);
    process.stdout.write('[local] Creado apps/api/.env desde apps/api/.env.example\n');
  }
} catch {
  // ignore
}

const webPort = Number(process.env.WEB_PORT || 5173);
const apiPort = Number(process.env.API_PORT || 3000);
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT || 5432);

await freePort(webPort, 'web');
await freePort(apiPort, 'api');

// Ensure DB is reachable (Docker only DB)
if (!(await canConnect(dbHost, dbPort))) {
  process.stdout.write(`[local] DB no disponible en ${dbHost}:${dbPort}. Intentando levantar Docker DB...\n`);
  // Quick check: Docker daemon running?
  try {
    execFileSync('docker', ['info'], { stdio: ['ignore', 'ignore', 'ignore'] });
  } catch {
    process.stderr.write(
      '[local] Docker daemon no está disponible. Abrí Docker Desktop (o iniciá tu runtime tipo Colima/OrbStack) y reintentá.\n'
    );
    process.stderr.write('[local] Alternativa: setear DATABASE_URL a un Postgres local que ya esté corriendo.\n');
    process.exit(1);
  }
  const up = spawn('docker', ['compose', '-f', 'docker-compose.db.yml', 'up', '-d'], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });
  const code = await new Promise((resolve) => up.on('exit', resolve));
  if (code !== 0) {
    process.stderr.write('[local] No pude levantar la DB con Docker. Corré `npm run dev:db` manualmente.\n');
    process.exit(code ?? 1);
  }

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (await canConnect(dbHost, dbPort, 500)) break;
    await sleep(500);
  }
  if (!(await canConnect(dbHost, dbPort, 500))) {
    process.stderr.write(`[local] DB sigue sin responder en ${dbHost}:${dbPort}.\n`);
    process.exit(1);
  }
}

// Apply pending migrations (safe/idempotent)
process.stdout.write('[local] Aplicando migraciones pendientes (Prisma)...\n');
const migrate = spawn('npm', ['run', 'db:migrate', '--workspace', '@terrahaus/api'], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});
const migrateCode = await new Promise((resolve) => migrate.on('exit', resolve));
if (migrateCode !== 0) process.exit(migrateCode ?? 1);

process.stdout.write(`[local] Iniciando web (dev:web) en :${webPort}\n`);
const web = runNpm(repoRoot, 'dev:web');

process.stdout.write(`[local] Iniciando api (dev:api) en :${apiPort}\n`);
const api = runNpm(repoRoot, 'dev:api');

function shutdown(code) {
  try {
    if (web?.pid) web.kill('SIGTERM');
  } catch {}
  try {
    if (api?.pid) api.kill('SIGTERM');
  } catch {}
  process.exit(code);
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

web.on('exit', (code) => {
  process.stdout.write(`[local] web salió con code=${code}\n`);
  shutdown(code ?? 0);
});
api.on('exit', (code) => {
  process.stdout.write(`[local] api salió con code=${code}\n`);
  shutdown(code ?? 0);
});
