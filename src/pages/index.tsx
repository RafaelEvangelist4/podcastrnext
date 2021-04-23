
export default function Home(props) {
 return (
  <div>
    <p>{JSON.stringify(props.episode)}</p>
  </div>
 )
}

export async function getStaticProps(){
  const response = await fetch("http://localhost:3333/episodes")
  const data = await response.json()

  return {
    props:{
      episode:data,
    },
    revalidate: 60 * 60 * 8,
  }

}
