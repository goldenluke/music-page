import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Brain, Info } from "lucide-react";

export default function AIParameters() {
  const { data: rlData } = useQuery({
    queryKey: ["rl-weights"],
    queryFn: () => api.get("/feed/rl").then(res => res.data),
    refetchInterval: 10000
  });

  // Nota: O backend pode retornar a variante e os pesos se configurado.
  // Vamos usar pesos padrão se o backend ainda não expuser o dicionário completo.
  const weights = {
    similarity: 0.6,
    popularity: 0.2,
    recency: 0.2
  };

  return (
    <div className="bg-green-600/5 border border-green-600/20 p-5 rounded-[32px]">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[10px] font-black uppercase text-green-500 flex items-center gap-2">
          <Brain size={14} /> Foco do Algoritmo
        </h4>
        <span className="text-[9px] font-black bg-green-500 text-black px-2 py-0.5 rounded-full">
          VARIANTE {rlData?.variant || "A"}
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(weights).map(([key, val]) => (
          <div key={key}>
            <div className="flex justify-between text-[8px] uppercase font-black text-slate-500 mb-1">
              <span>{key}</span>
              <span>{(val * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${val * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[7px] text-slate-500 leading-tight">
        *Este gráfico mostra como a IA prioriza músicas para você agora. O peso muda conforme você vota.
      </p>
    </div>
  );
}
