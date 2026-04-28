import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), ".data", "users.json");

interface User {
  id: string;
  email: string;
  name?: string;
  dob?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  stripeCustomerId?: string;
  subscriptionStatus: "free" | "pro" | "trial";
  trialStartDate?: string;
  subscriptionId?: string;
  createdAt: string;
}

function ensureDb(): User[] {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function saveDb(users: User[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function getUserByEmail(email: string): User | undefined {
  const users = ensureDb();
  return users.find((u) => u.email === email.toLowerCase().trim());
}

export function createUser(data: {
  email: string;
  name?: string;
  dob?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  stripeCustomerId?: string;
}): User {
  const users = ensureDb();
  const existing = users.find((u) => u.email === data.email.toLowerCase().trim());
  if (existing) return existing;

  const user: User = {
    id: crypto.randomUUID(),
    email: data.email.toLowerCase().trim(),
    name: data.name,
    dob: data.dob,
    timeOfBirth: data.timeOfBirth,
    placeOfBirth: data.placeOfBirth,
    stripeCustomerId: data.stripeCustomerId,
    subscriptionStatus: "trial",
    trialStartDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveDb(users);
  return user;
}

export function updateUser(email: string, updates: Partial<User>): User | undefined {
  const users = ensureDb();
  const idx = users.findIndex((u) => u.email === email.toLowerCase().trim());
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates };
  saveDb(users);
  return users[idx];
}
