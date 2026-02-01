export async function onRequestPost({ request, env }) {
  const body = await request.json()
  const { name, email, password } = body

  if (!email || !password || !name) {
    return new Response(
      JSON.stringify({ error: "Missing fields" }),
      { status: 400 }
    )
  }

  // TEMP: fake user storage (replace later with DB)
  const user = { id: 1, name, email }

  return new Response(
    JSON.stringify({ success: true, user }),
    { headers: { "Content-Type": "application/json" } }
  )
}
