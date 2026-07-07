import { prisma } from "@/lib/prisma";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  dob?: string | null;
  timeOfBirth?: string | null;
  unknownTime: boolean;
  placeOfBirth?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  stripeCustomerId?: string | null;
  subscriptionStatus: "free" | "pro" | "trial";
  trialStartDate: Date;
  subscriptionId?: string | null;
  createdAt: Date;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  return (user as User) ?? undefined;
}

export async function createUser(data: {
  email: string;
  name?: string;
  dob?: string;
  timeOfBirth?: string;
  unknownTime?: boolean;
  placeOfBirth?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  stripeCustomerId?: string;
}): Promise<User> {
  const normalizedEmail = data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) return existing as User;

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: data.name,
      dob: data.dob,
      timeOfBirth: data.timeOfBirth,
      unknownTime: data.unknownTime ?? false,
      placeOfBirth: data.placeOfBirth,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      stripeCustomerId: data.stripeCustomerId,
      subscriptionStatus: "trial",
    },
  });
  return user as User;
}

export async function updateUser(
  email: string,
  updates: Partial<User>
): Promise<User | undefined> {
  try {
    const user = await prisma.user.update({
      where: { email: email.toLowerCase().trim() },
      data: updates,
    });
    return user as User;
  } catch {
    return undefined;
  }
}

export async function getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({ where: { stripeCustomerId } });
  return (user as User) ?? undefined;
}

export async function updateUserByStripeCustomerId(
  stripeCustomerId: string,
  updates: Partial<User>
): Promise<User | undefined> {
  try {
    const user = await prisma.user.update({
      where: { stripeCustomerId },
      data: updates,
    });
    return user as User;
  } catch {
    return undefined;
  }
}
