// app/page.tsx
"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const temas = [
    "Rotação Simples à Esquerda e Simples à Direita",
    "Rotação Dupla (Dir-Esq)",
    "Rotação Dupla (Esq-Dir)"
  ];

  const [nome, setNome] = useState("");
  const [sorteado, setSorteado] = useState(null);

  const sortear = async () => {
    if (!nome) {
      alert("Digite seu nome!");
      return;
    }
    const escolhido = temas[Math.floor(Math.random() * temas.length)];
    setSorteado(escolhido);

    // Envia para a API que manda o e-mail
    await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, escolhido })
    });
  };

  return (
       <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎲 Sorteio de Temas - AVL</h1>
         <p className={styles.instrucao}>
          📌 <b>Atividade:</b> Crie uma explicação sobre o tema sorteado.  
          Sua apresentação pode ser em <b>slides</b> e deve ter como objetivo usar 
          uma <b>analogia</b> para explicar o conceito de rotação em árvores AVL.
        </p>

        <input
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={styles.input}
        />

        <button onClick={sortear} className={styles.button}>
          Sortear Tema
        </button>

        {sorteado && (
          <p className={styles.resultado}>
            🎉 <b>{nome}</b>, seu tema sorteado foi: <br />
            <span>{sorteado}</span>
          </p>
        )}
        <p>Desenvolvido por: Professor Marcelino Garcia</p>
      </div>
    </main>
  );
}

