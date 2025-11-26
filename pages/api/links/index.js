import prisma from "../../../lib/prisma";
import { nanoid } from "nanoid";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const links = await prisma.link.findMany({ orderBy: { createdAt: "desc" } });
    return res.json(links);
  }

  if (req.method === "POST") {
    const { url, code } = req.body || {};
    if (!url) return res.status(400).json({ error: "Missing url" });

    try { new URL(url); } catch { return res.status(400).json({ error: "Invalid URL" }); }

    const finalCode = code?.trim() || nanoid(7);
    if (!CODE_REGEX.test(finalCode)) return res.status(400).json({ error: "Code must be 6–8 alphanumeric characters" });

    const exists = await prisma.link.findUnique({ where: { code: finalCode } });
    if (exists) return res.status(409).json({ error: "Code already exists" });

    const created = await prisma.link.create({ data: { code: finalCode, url } });
    return res.status(201).json(created);
  }

  res.setHeader("Allow", ["GET","POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
