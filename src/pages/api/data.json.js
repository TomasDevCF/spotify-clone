export async function GET({params, request}) {
  return new Response(
    JSON.stringify({
      url: 'https://astro.build/'
    })
  )
}