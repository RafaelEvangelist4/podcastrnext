import {GetStaticProps} from "next";
import Image from "next/image";
import { format, parseISO} from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { api } from "../services/api";

import { convertDurationToTimeStrig } from "../utils/convertDurationToTimeString";

import styles from "./home.module.scss";

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    description: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
  }

  type HomeProps ={
    latesEpisodes: Episode[];
    allEpisodes: Episode[];
  }
export default function Home({latesEpisodes, allEpisodes}: HomeProps) {
 return (
  <div className={styles.homepage}>
    <section className={styles.latesEpisodes}>
        <h2>Últimos lançamentos </h2>

        <ul>
          {latesEpisodes.map(episode =>{
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />
               
                
                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            )
          })}
        </ul>
    </section>

    <section className={styles.allEpisodes}>

    </section>

  </div>
 )
}

export const getStaticProps: GetStaticProps = async () =>{
  const {data} = await api.get("episodes",{
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc" 
    }
  })

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeStrig(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })
  
  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props:{
      latesEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }

}
