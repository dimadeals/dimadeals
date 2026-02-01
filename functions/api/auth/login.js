export async function onRequestPost({ request }) {
  const { email, password } = await request.json()

  if (email === "test@test.com" && password === "123456") {
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(
    JSON.stringify({ error: "Invalid credentials" }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  )
}
