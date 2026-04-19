import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await login(username, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
