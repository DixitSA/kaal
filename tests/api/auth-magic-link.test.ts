import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const tokens: { id: string; email: string; tokenHash: string; expiresAt: Date; consumedAt: Date | null }[] = [];
const send = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    verificationToken: {
      create: async ({ data }: { data: (typeof tokens)[number] }) => {
        tokens.push({ ...data, id: String(tokens.length), consumedAt: null });
      },
      findUnique: async ({ where }: { where: { tokenHash: string } }) =>
        tokens.find((t) => t.tokenHash === where.tokenHash) ?? null,
      updateMany: async ({ where, data }: { where: { id: string }; data: { consumedAt: Date } }) => {
        const t = tokens.find((x) => x.id === where.id && !x.consumedAt && x.expiresAt > new Date());
        if (t) t.consumedAt = data.consumedAt;
        return { count: t ? 1 : 0 };
      },
    },
  },
}));

vi.mock("loops", () => ({ LoopsClient: class { sendTransactionalEmail = send; } }));

import { POST as requestLink } from "@/app/api/auth/request-link/route";
import { GET as verifyGet, POST as verifyPost } from "@/app/api/auth/verify/route";

const post = (url: string, body: unknown) =>
  new NextRequest(url, { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });

beforeEach(() => {
  tokens.length = 0;
  send.mockReset();
  process.env.LOOPS_API_KEY = "k";
  process.env.LOOPS_MAGIC_LINK_TEMPLATE_ID = "t";
  process.env.SESSION_SECRET = "s";
  process.env.NEXT_PUBLIC_BASE_URL = "https://kaal.test";
});

describe("magic link email flow", () => {
  it("reports a failure when the email provider rejects the send", async () => {
    send.mockRejectedValue(new Error("loops down"));
    const res = await requestLink(post("https://kaal.test/api/auth/request-link", { email: "a@b.co" }));
    expect(res.status).toBe(502);
  });

  it("link survives a scanner GET and can be used exactly once", async () => {
    send.mockResolvedValue({ success: true });
    await requestLink(post("https://kaal.test/api/auth/request-link", { email: "A@b.co" }));
    const link = new URL(send.mock.calls[0][0].dataVariables.magicLink);
    const token = link.searchParams.get("token")!;

    const scan = await verifyGet(new NextRequest(link));
    expect(scan.headers.get("location")).toContain("/auth/complete?token=");
    expect(tokens[0].consumedAt).toBeNull();

    const first = await verifyPost(post("https://kaal.test/api/auth/verify", { token }));
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ email: "a@b.co" });
    expect(first.cookies.get("kaal_session")).toBeTruthy();

    const second = await verifyPost(post("https://kaal.test/api/auth/verify", { token }));
    expect(second.status).toBe(400);
  });
});
