import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import MusicCard from "../components/MusicCard"

export default function ArtistPage(){

    const { slug } = useParams()

    const { data, isLoading } = useQuery({

        queryKey:["artist", slug],

        queryFn:()=>axios.get(`/artists/${slug}`).then(res=>res.data)

    })

    if(isLoading) return <div className="p-10">Loading...</div>

        if(!data) return null

            return (

                <div className="max-w-5xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-black mb-6">
                {data.artist.name}
                </h1>

                {/* Gêneros */}

                <div className="flex gap-2 mb-8">

                {data.genres.map(g=>(
                    <span
                    key={g}
                    className="bg-green-600 text-white text-xs px-3 py-1 rounded-xl"
                    >
                    {g}
                    </span>
                ))}

                </div>

                {/* Artistas relacionados */}

                <h2 className="text-xl font-bold mb-4">
                Related Artists
                </h2>

                <div className="flex flex-wrap gap-3 mb-10">

                {data.related_artists.map(a=>(

                    <Link
                    key={a.slug}
                    to={`/artist/${a.slug}`}
                    className="px-3 py-1 bg-white/10 rounded-lg hover:bg-green-600"
                    >

                    {a.name}

                    </Link>

                ))}

                </div>

                {/* Posts */}

                <h2 className="text-xl font-bold mb-4">
                Top Posts
                </h2>

                <div className="flex flex-col gap-6">

                {data.posts.map(p=>(
                    <MusicCard key={p.id} post={p}/>
                ))}

                </div>

                </div>

            )

}
