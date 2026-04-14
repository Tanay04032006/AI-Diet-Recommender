export async function POST(req) {
  const body = await req.json();

  const res = await fetch(
    "https://diet-backend-bhera6hdgyaahcg6.southeastasia-01.azurewebsites.net/api/dietHandler",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  const data = await res.json();

  return Response.json(data);
}