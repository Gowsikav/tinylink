import { format } from "date-fns";

export async function getServerSideProps({ params }) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/links/" + params.code
  );
  if (res.status !== 200) return { notFound: true };
  const link = await res.json();
  return { props: { link } };
}

export default function CodePage({ link }) {
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
 