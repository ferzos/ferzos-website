import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const repoRoot = join(import.meta.dirname, "..");
const appDir = join(repoRoot, "src", "app");
const featuresPath = join(
  repoRoot,
  ".agents",
  "skills",
  "control-ferzos-website",
  "references",
  "features",
  "README.md",
);
const stateDir = join(repoRoot, ".autopilot");
const defaultOrigin = "http://127.0.0.1:3000";

type FlagValue = string | true;

function parseArgs(argv: string[]) {
  const json = argv.includes("--json");
  const args = argv.filter((arg) => arg !== "--json");
  while (args[0] === "--") args.shift();
  const command = args[0] ?? "help";
  const positionals: string[] = [];
  const flags = new Map<string, FlagValue>();

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    const key = arg.slice(2);
    const next = args[index + 1];
    if (next === undefined || next.startsWith("--")) {
      flags.set(key, true);
      continue;
    }

    flags.set(key, next);
    index += 1;
  }

  return { command, positionals, flags, json };
}

function flag(flags: Map<string, FlagValue>, name: string) {
  const value = flags.get(name);
  return typeof value === "string" ? value : undefined;
}

function gitSha() {
  const result = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) return "unknown";
  return result.stdout.trim();
}

function originOf(flags: Map<string, FlagValue>) {
  return flag(flags, "origin") ?? process.env.CONTROL_ORIGIN ?? defaultOrigin;
}

function discoverRoutes(dir: string, segments: string[] = []): string[] {
  const routes: string[] = [];

  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("_") || entry.startsWith(".")) continue;
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      const nextSegments =
        entry.startsWith("(") && entry.endsWith(")")
          ? segments
          : [...segments, entry];
      routes.push(...discoverRoutes(fullPath, nextSegments));
      continue;
    }

    if (
      entry !== "page.tsx" &&
      entry !== "page.ts" &&
      entry !== "route.ts" &&
      entry !== "route.tsx"
    ) {
      continue;
    }

    routes.push(segments.length === 0 ? "/" : `/${segments.join("/")}`);
  }

  return routes.sort();
}

function notedRoutes(markdown: string) {
  const routes = new Map<string, string>();
  const sections = markdown.split(/^### `/m).slice(1);

  for (const section of sections) {
    const end = section.indexOf("`");
    if (end === -1) continue;
    const route = section.slice(0, end);
    if (!route.startsWith("/")) continue;
    routes.set(route, section.slice(end + 1));
  }

  return routes;
}

async function checkHealth(origin: string) {
  const response = await fetch(new URL("/health", origin), {
    signal: AbortSignal.timeout(2000),
  });
  if (!response.ok) {
    throw new Error(`/health returned ${response.status}`);
  }
  const text = await response.text();
  let body: { ok?: boolean; sha?: string };
  try {
    body = JSON.parse(text) as { ok?: boolean; sha?: string };
  } catch {
    const loginPage =
      response.url.includes("vercel.com/login") ||
      response.url.includes("vercel.com/sso-api") ||
      text.includes("vercel.com/sso-api");
    const hint = loginPage
      ? " The host redirected to Vercel Authentication. Use the public production origin."
      : "";
    throw new Error(`/health did not return valid JSON.${hint}`);
  }
  if (body.ok !== true || typeof body.sha !== "string") {
    throw new Error("/health did not return { ok: true, sha }");
  }
  return body.sha;
}

function shaMatches(actual: string, expected: string) {
  return (
    actual === expected ||
    actual.startsWith(expected) ||
    expected.startsWith(actual)
  );
}

async function commandDoctor() {
  const checks: { name: string; ok: boolean; fix: string }[] = [];
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  checks.push({
    name: "node >= 22",
    ok: nodeMajor >= 22,
    fix: "Install Node.js 22 or newer.",
  });
  checks.push({
    name: "dependencies installed",
    ok: existsSync(join(repoRoot, "node_modules", "next")),
    fix: "Run pnpm install.",
  });
  checks.push({
    name: "git hooks",
    ok:
      existsSync(join(repoRoot, ".husky", "pre-commit")) &&
      existsSync(join(repoRoot, ".husky", "pre-push")),
    fix: "The setup PR adds .husky/pre-commit and .husky/pre-push.",
  });

  let server = "not running";
  try {
    const sha = await checkHealth(defaultOrigin);
    server = `up at ${defaultOrigin} (${sha})`;
    checks.push({
      name: "local /health",
      ok: true,
      fix: "Run control-ferzos-website dev.",
    });
  } catch {
    checks.push({
      name: "local /health",
      ok: true,
      fix: "Optional until you need a running app. Run control-ferzos-website dev.",
    });
    server = "not running";
  }

  const failed = checks.filter((check) => !check.ok);
  return {
    ok: failed.length === 0,
    server,
    checks,
    fix: failed.map((check) => `${check.name}: ${check.fix}`),
  };
}

async function commandDev() {
  try {
    const sha = await checkHealth(defaultOrigin);
    return { ok: true, origin: defaultOrigin, sha, started: false };
  } catch {
    // Start one below.
  }

  mkdirSync(stateDir, { recursive: true });
  const sha = gitSha();
  const child = spawn("pnpm", ["dev"], {
    cwd: repoRoot,
    detached: true,
    stdio: "ignore",
    env: { ...process.env, CONTROL_SHA: sha },
  });
  child.unref();
  if (child.pid !== undefined) {
    writeFileSync(join(stateDir, "dev.pid"), `${child.pid}\n`);
  }

  for (let attempt = 0; attempt < 60; attempt += 1) {
    await delay(1000);
    try {
      const runningSha = await checkHealth(defaultOrigin);
      return {
        ok: true,
        origin: defaultOrigin,
        sha: runningSha,
        started: true,
      };
    } catch {
      // Keep waiting until Next is ready.
    }
  }

  return {
    ok: false,
    origin: defaultOrigin,
    fix: "next dev did not serve /health within 60s. Read the dev server log.",
  };
}

function commandLogin() {
  return {
    ok: true,
    session: null,
    note: "This app has no accounts. Requests are unauthenticated.",
  };
}

async function commandRequest(
  positionals: string[],
  flags: Map<string, FlagValue>,
) {
  const method = (positionals[0] ?? "GET").toUpperCase();
  const path = positionals[1];
  if (!path?.startsWith("/")) {
    return { ok: false, fix: "Usage: request METHOD /path [--contains text]" };
  }

  const origin = originOf(flags);
  const response = await fetch(new URL(path, origin), {
    method,
    redirect: "follow",
  });
  const body = await response.text();
  const contains = flag(flags, "contains");
  const dump = flags.get("dump") === true;
  if (dump) {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, "request-body.txt"), body);
  }

  const missing = contains !== undefined && !body.includes(contains);
  return {
    ok: response.ok && !missing,
    origin,
    method,
    path,
    status: response.status,
    contains: contains ?? null,
    finalUrl: response.url,
    fix: missing
      ? `Response from ${path} did not contain ${JSON.stringify(contains)}.`
      : response.ok
        ? undefined
        : `${method} ${path} returned ${response.status}.`,
  };
}

function commandExecute(flags: Map<string, FlagValue>) {
  const codeFile = flag(flags, "code-file");
  if (!codeFile) {
    return { ok: false, fix: "Usage: execute --code-file <file>" };
  }

  const origin = originOf(flags);
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", codeFile],
    {
      cwd: repoRoot,
      encoding: "utf8",
      env: { ...process.env, CONTROL_ORIGIN: origin },
    },
  );

  return {
    ok: result.status === 0,
    origin,
    codeFile,
    stdout: result.stdout,
    stderr: result.stderr,
    fix:
      result.status === 0
        ? undefined
        : `Fixture exited ${result.status ?? "unknown"}.`,
  };
}

async function commandBrowse(flags: Map<string, FlagValue>) {
  const path = flag(flags, "path");
  if (!path?.startsWith("/")) {
    return { ok: false, fix: "Usage: browse --path /path [--record]" };
  }

  const origin = originOf(flags);
  let chromium: typeof import("playwright").chromium;
  try {
    chromium = (await import("playwright")).chromium;
  } catch {
    return {
      ok: false,
      fix: "Install the browser with pnpm exec playwright install chromium.",
    };
  }

  const record = flags.get("record") === true;
  const videoDir = join(stateDir, "browse");
  if (record) mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(
    record ? { recordVideo: { dir: videoDir } } : {},
  );
  const page = await context.newPage();
  const response = await page.goto(new URL(path, origin).toString(), {
    waitUntil: "domcontentloaded",
  });
  const status = response?.status() ?? 0;
  await page.close();
  await context.close();
  await browser.close();

  return {
    ok: response?.ok() === true,
    origin,
    path,
    status,
    videoDir: record ? videoDir : null,
    fix:
      response?.ok() === true
        ? undefined
        : `GET ${path} returned HTTP ${status || "no response"}.`,
  };
}

function commandMap(flags: Map<string, FlagValue>) {
  const markdown = readFileSync(featuresPath, "utf8");
  const notes = notedRoutes(markdown);
  const discovered = discoverRoutes(appDir);
  const missingNotes = discovered.filter((route) => !notes.has(route));
  const staleNotes = [...notes.keys()].filter(
    (route) => !discovered.includes(route),
  );
  const missingReach = [...notes.entries()]
    .filter(([, body]) => !/^Reach:/m.test(body))
    .map(([route]) => route);
  const feature = flag(flags, "feature");
  const checking = flags.get("check") === true;
  const ok =
    !checking ||
    (missingNotes.length === 0 &&
      staleNotes.length === 0 &&
      missingReach.length === 0);

  return {
    ok,
    feature: feature ?? null,
    routes: feature ? { [feature]: notes.get(feature) ?? null } : discovered,
    missingNotes,
    staleNotes,
    missingReach,
    fix: ok
      ? undefined
      : "Update .agents/skills/control-ferzos-website/references/features/README.md so every App Router page and route handler has a ### `/path` note with a Reach line.",
  };
}

async function commandPreview(
  flags: Map<string, FlagValue>,
  positionals: string[],
) {
  const pr = flag(flags, "pr") ?? positionals[0];
  if (!pr) return { ok: false, fix: "Usage: preview --pr <n>" };

  const view = spawnSync(
    "gh",
    [
      "pr",
      "view",
      pr,
      "--repo",
      "ferzos/ferzos-website",
      "--json",
      "url,headRefOid",
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );
  if (view.status !== 0) {
    return { ok: false, fix: view.stderr || "gh pr view failed." };
  }

  const payload = JSON.parse(view.stdout) as {
    url: string;
    headRefOid?: string;
  };
  const origin = payload.headRefOid
    ? previewAppOrigin(payload.headRefOid)
    : undefined;
  if (!origin) {
    return {
      ok: false,
      pr: payload.url,
      fix: "No Vercel preview app URL on this pull request yet.",
    };
  }

  const requestSpec = flag(flags, "request");
  if (!requestSpec) {
    return { ok: true, pr: payload.url, origin };
  }

  const [method, path, ...rest] = requestSpec.split(" ");
  const containsFlag = rest.join(" ");
  const contains = containsFlag.startsWith("--contains ")
    ? containsFlag.slice("--contains ".length)
    : undefined;
  const result = await commandRequest(
    [method, path],
    new Map([
      ["origin", origin],
      ...(contains ? ([["contains", contains]] as const) : []),
    ]),
  );
  return { ...result, pr: payload.url, origin };
}

function previewAppOrigin(headSha: string) {
  const list = spawnSync(
    "gh",
    [
      "api",
      `repos/ferzos/ferzos-website/deployments?sha=${headSha}&environment=Preview&per_page=5`,
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );
  if (list.status !== 0) return undefined;

  const deployments = JSON.parse(list.stdout) as { id: number }[];
  for (const deployment of deployments) {
    const statuses = spawnSync(
      "gh",
      [
        "api",
        `repos/ferzos/ferzos-website/deployments/${deployment.id}/statuses`,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );
    if (statuses.status !== 0) continue;

    const ready = (
      JSON.parse(statuses.stdout) as {
        state?: string;
        environment_url?: string;
      }[]
    ).find(
      (status) =>
        status.state === "success" &&
        status.environment_url?.startsWith("https://") &&
        !status.environment_url.startsWith("https://vercel.com/"),
    );
    if (ready?.environment_url) return ready.environment_url;
  }

  return undefined;
}

async function commandHealth(flags: Map<string, FlagValue>) {
  const origin = flag(flags, "origin");
  const sha = flag(flags, "sha");
  if (!origin || !sha) {
    return { ok: false, fix: "Usage: health --origin <url> --sha <sha>" };
  }

  try {
    const actual = await checkHealth(origin);
    const ok = actual !== "unknown" && shaMatches(actual, sha);
    return {
      ok,
      origin,
      expected: sha,
      actual,
      fix: ok ? undefined : `Running sha ${actual} did not match ${sha}.`,
    };
  } catch (error) {
    return {
      ok: false,
      origin,
      fix: error instanceof Error ? error.message : "Health check failed.",
    };
  }
}

function helpText() {
  return [
    "control-ferzos-website",
    "  doctor",
    "  dev",
    "  login",
    "  request METHOD /path [--contains text] [--dump] [--origin url]",
    "  execute --code-file <file> [--origin url]",
    "  browse --path /path [--record] [--origin url]",
    "  map [--feature /path] [--check]",
    "  preview --pr <n> [--request 'GET /path --contains text']",
    "  health --origin <url> --sha <sha>",
    "Add --json for a machine-readable result.",
  ].join("\n");
}

async function run() {
  const parsed = parseArgs(process.argv.slice(2));
  let result: { ok: boolean; fix?: string | string[] } & Record<
    string,
    unknown
  >;

  switch (parsed.command) {
    case "doctor":
      result = await commandDoctor();
      break;
    case "dev":
      result = await commandDev();
      break;
    case "login":
      result = commandLogin();
      break;
    case "request":
      result = await commandRequest(parsed.positionals, parsed.flags);
      break;
    case "execute":
      result = commandExecute(parsed.flags);
      break;
    case "browse":
      result = await commandBrowse(parsed.flags);
      break;
    case "map":
      result = commandMap(parsed.flags);
      break;
    case "preview":
      result = await commandPreview(parsed.flags, parsed.positionals);
      break;
    case "health":
      result = await commandHealth(parsed.flags);
      break;
    default:
      result = { ok: parsed.command === "help", help: helpText() };
  }

  if (parsed.json) {
    console.log(JSON.stringify({ command: parsed.command, ...result }));
  } else if (typeof result.help === "string") {
    console.log(result.help);
  } else {
    console.log(
      JSON.stringify({ command: parsed.command, ...result }, null, 2),
    );
  }

  if (!result.ok && result.fix) {
    const fix = Array.isArray(result.fix) ? result.fix.join("\n") : result.fix;
    console.error(fix);
  }

  process.exit(result.ok ? 0 : 1);
}

run().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Control CLI failed.";
  console.error(message);
  process.exit(1);
});
