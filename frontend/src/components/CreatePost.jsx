import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link as LinkIcon, AlignLeft, Hash, Send } from "lucide-react";
import SearchableSelect from "./SearchableSelect";

export default function CreatePost() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("link");
  const [formData, setFormData] = useState({ title: "", url: "", content: "", sub_id: "", genre_id: "", tags: "" });

  const { data: subs = [] } = useQuery({ queryKey: ["subs"], queryFn: () => axios.get("/subs").then(res => res.data) });
  const { data: genres = [] } = useQuery({ queryKey: ["genres"], queryFn: () => axios.get("/genres").then(res => res.data) });

  const createMutation = useMutation({
    mutationFn: (payload) => axios.post("/posts", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setFormData({ title: "", url: "", content: "", sub_id: "", genre_id: "", tags: "" });
      alert("Postado!");
    }
  });

  return (
    <div className="bg-[#0f1115] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl mb-12 transition-all">
      <div className="flex border-b border-white/5 bg-black/20">
        <button onClick={() => setActiveTab("link")} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 ${activeTab==='link' ? 'bg-green-600 text-white' : 'text-slate-500'}`}><LinkIcon size={14}/> Link</button>
        <button onClick={() => setActiveTab("text")} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 ${activeTab==='text' ? 'bg-green-600 text-white' : 'text-slate-500'}`}><AlignLeft size={14}/> Resenha</button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="p-8 space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Título</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Artista - Música" className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-green-500"/>
        </div>

        {activeTab === "link" && (
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">URL (YouTube / Spotify)</label>
            <input required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-green-500 italic text-green-500"/>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SearchableSelect 
            label="Comunidade" 
            options={subs} 
            placeholder="Buscar s/..." 
            onSelect={(id) => setFormData({...formData, sub_id: id})} 
          />
          <SearchableSelect 
            label="Gênero Principal" 
            options={genres} 
            placeholder="Buscar gênero..." 
            onSelect={(id) => setFormData({...formData, genre_id: id})} 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Resenha / Descrição (Opcional)</label>
          <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows="3" className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-green-500 resize-none"/>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white font-black uppercase py-5 rounded-2xl hover:bg-green-500 transition-all shadow-xl shadow-green-600/20 active:scale-95">
          {createMutation.isPending ? "Publicando..." : "Publicar na Music Page"}
        </button>
      </form>
    </div>
  );
}
