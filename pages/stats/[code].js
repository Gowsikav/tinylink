import prisma from "../../lib/prisma";
import { format } from "date-fns";

export async function getServerSideProps({ params }) {
  const { code } = params;

  // Fetch link directly from the database
  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) return { notFound: true };

  return { props: { link } };
}

export default function StatsPage({ link }) {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 16px" }}>
      <h1>Stats for {link.code}</h1>
      <p>
        <strong>Target:</strong> <a href={link.url}>{link.url}</a>
      </p>
      <p>
        <strong>Clicks:</strong> {link.clicks}
      </p>
      <p>
        <strong>Last clicked:</strong>{" "}
        {link.lastClicked
          ? format(new Date(link.lastClicked), "yyyy-MM-dd HH:mm")
          : "-"}
      </p>
      <p>
        <strong>Created:</strong>{" "}
        {format(new Date(link.createdAt), "yyyy-MM-dd HH:mm")}
      </p>
    </div>
  );
}
