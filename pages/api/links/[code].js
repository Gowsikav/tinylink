import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Missing code" });

  if (req.method === "GET") {
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) return res.status(404).json({ error: "Not found" });
    return res.json(link);
  }

  if (req.method === "DELETE") {
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) return res.status(404).json({ error: "Not found" });
    await prisma.link.delete({ where: { code } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET","DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
 