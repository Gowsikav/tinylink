import React, { useEffect, useState } from "react";

export default function Home() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function fetchLinks() {
    const res = await fetch("/api/links");
    setLinks(await res.json());
  }
  useEffect(() => { fetchLinks(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setMsg(""); setLoading(true);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code })
    });
    if (res.status === 201) {
      setUrl(""); setCode(""); setMsg("Created");
      await fetchLinks();
    } else {
      const err = await res.json().catch(()=>({error:"Unknown"}));
      setMsg(err.error || "Error");
    }
    setLoading(false);
  }

  async function handleDelete(c) {
    if (!confirm("Delete link?")) return;
    await fetch(`/api/links/${c}`, { method: "DELETE" });
    fetchLinks();
  }

  return (
  <div className="container">
    <h1>TinyLink</h1>
    <form onSubmit={handleCreate} style={{marginBottom:20}}>
      <div>
        <label>Long URL</label><br/>
        <input placeholder="https://example.com/..." value={url} onChange={e=>setUrl(e.target.value)} />
      </div>
      <div>
        <label>Custom code (optional)</label><br/>
        <input value={code} onChange={e=>setCode(e.target.value)} />
      </div>
      <div style={{marginTop:8}}>
        <button disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        <span style={{marginLeft:12}}>{msg}</span>
      </div>
    </form>

    <h2>Dashboard</h2>
    <table>
      <thead>
        <tr><th>Code</th><th>URL</th><th>Clicks</th><th>Last clicked</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {links.length === 0 && <tr><td colSpan={5}>No links yet</td></tr>}
        {links.map(l => (
          <tr key={l.code}>
            <td><a href={`/${l.code}`}>{l.code}</a></td>
            <td style={{maxWidth:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{l.url}</td>
            <td>{l.clicks}</td>
            <td>{l.lastClicked || "-"}</td>
            <td>
              <button onClick={()=>navigator.clipboard?.writeText(window.location.origin + "/" + l.code)}>Copy</button>
              <button onClick={()=>handleDelete(l.code)} style={{marginLeft:8}}>Delete</button>
              <a href={`/code/${l.code}`} style={{marginLeft:8}}>Stats</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div style={{marginTop:20}}><small>Health: <a href="/api/healthz">/api/healthz</a></small></div>
  </div>
);

}
