export default async function handler(request, response) {
  const qValue = Array.isArray(request.query?.q)
    ? request.query.q[0]
    : request.query?.q;
  const query = (qValue ?? "").toString().trim();

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Cache-Control",
    "public, max-age=60, s-maxage=600, stale-while-revalidate=600",
  );

  if (!query) {
    response.status(400).json({ error: "Missing q parameter", suggestions: [] });
    return;
  }

  const upstreamUrl = new URL("https://duckduckgo.com/ac/");
  upstreamUrl.searchParams.set("q", query);
  upstreamUrl.searchParams.set("type", "list");

  const klValue = Array.isArray(request.query?.kl)
    ? request.query.kl[0]
    : request.query?.kl;
  if (typeof klValue === "string" && klValue.trim()) {
    upstreamUrl.searchParams.set("kl", klValue.trim());
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!upstreamResponse.ok) {
      response
        .status(502)
        .json({ error: "Upstream error", suggestions: [] });
      return;
    }

    const data = await upstreamResponse.json();
    const suggestions = Array.isArray(data)
      ? data
        .map((item) => (typeof item?.phrase === "string" ? item.phrase : null))
        .filter((item) => typeof item === "string")
      : [];

    response.status(200).json({ query, suggestions });
  } catch (error) {
    response.status(502).json({ error: "Upstream fetch failed", suggestions: [] });
  }
}
