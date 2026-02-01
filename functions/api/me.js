export async function onRequestGet({ request }) {
  const cookie = request.headers.get("Cookie") || ""

  if (!cookie.includes("session=loggedin")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    )
  }

  return new Response(
    JSON.stringify({
      id: 1,
      name: "Test User",
      email: "test@example.com"
    }),
    { headers: { "Content-Type": "application/json" } }
  )
}
