import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import MusicCard from "../components/MusicCard"

export default function SubPage() {

    const { slug } = useParams()

    const [posts, setPosts] = useState([])

    useEffect(() => {

        fetch(`/api/posts?sub_slug=${slug}`)
        .then(res => res.json())
        .then(data => setPosts(data))

    }, [slug])

    return (
        <div className="max-w-3xl mx-auto p-4">

        <h1 className="text-2xl font-bold mb-4">
        s/{slug}
        </h1>

        {posts.map(post => (
            <MusicCard key={post.id} post={post} />
        ))}

        </div>
    )
}
