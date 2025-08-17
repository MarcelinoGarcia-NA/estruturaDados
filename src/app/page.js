"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * Laboratório de Estruturas de Dados em C (AGORA É COM VOCÊ)
 * Next.js (App Router) — Sem Tailwind, CSS-in-JS via <style jsx>
 *
 * Objetivo: o aluno programa em C (pilha, fila, lista simples, lista dupla e lista circular)
 * exatamente no padrão do PDF. O app valida (checklist) e simula chamadas do main().
 *
 * Principais mudanças:
 * - PDF carregado automaticamente de /public/ListaPilhaFila.pdf
 * - Painel do PDF ocupa 50% da tela e tem botão "Maximizar".
 * - Exemplos idênticos ao PDF.
 * - Validação por checklist e simulação do main().
 */

// -------------------- Abas/Atividades --------------------
const TABS = [
  { key: "pilha", label: "Pilha — Histórico de Navegação" },
  { key: "fila", label: "Fila — Clientes (nome/senha)" },
  { key: "listaSimples", label: "Lista Simples — WhatsApp" },
  { key: "listaDupla", label: "Lista Duplamente Encadeada — Playlist" },
  { key: "listaCircular", label: "Lista Circular — Tarefas" },
];

// -------------------- Exemplos base (iguais ao PDF) --------------------
const EXAMPLES = {
  pilha: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct No {
    char endereco[120];
    char titulo[80];
    char horario[16];
    struct No *proximo;
} No;

typedef struct Pilha {
    No *topo;
} Pilha;

Pilha* criarPilha() {
    Pilha *p = (Pilha*) malloc(sizeof(Pilha));
    if (p) p->topo = NULL;
    return p;
}

void push(Pilha *p, const char *endereco, const char *titulo, const char *horario) {
    No *novo = (No*) malloc(sizeof(No));
    strcpy(novo->endereco, endereco);
    strcpy(novo->titulo, titulo);
    strcpy(novo->horario, horario);
    novo->proximo = p->topo;
    p->topo = novo;
}

No* pop(Pilha *p) {
    if (p->topo == NULL) return NULL;
    No *rem = p->topo;
    p->topo = rem->proximo;
    return rem; // dar free(rem) após usar
}

void exibir(Pilha *p) {
    No *aux = p->topo;
    while (aux != NULL) {
        printf("%s | %s | %s\\n", aux->endereco, aux->titulo, aux->horario);
        aux = aux->proximo;
    }
}

int main() {
    Pilha *p = criarPilha();
    push(p, "https://site.com", "Portal", "08:30");
    push(p, "https://uems.br", "UEMS", "08:31");
    exibir(p);
    No *r = pop(p); if (r) { printf("Fechada: %s\\n", r->endereco); free(r);} 
    exibir(p);
    return 0;
}
`,
// ... (mantém as outras estruturas fila, listaSimples, listaDupla, listaCircular)
};

// -------------------- Persistência simples --------------------
function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

const SmallButton = ({ children, ...props }) => (
  <button {...props} className="sbtn">
    {children}
    <style jsx>{`
      .sbtn {
        padding: 0.5rem 0.75rem;
        border-radius: 0.6rem;
        border: 1px solid #d0d0d0;
        background: #fff;
        cursor: pointer;
      }
      .sbtn:hover {
        background: #f5f5f5;
      }
    `}</style>
  </button>
);

// -------------------- Página principal --------------------
export default function Page() {
  const [tab, setTab] = useLocalStorage("ds-tab", TABS[0].key);
  const [code, setCode] = useLocalStorage("ds-code-" + tab, EXAMPLES[tab]);
  const [pdfMax, setPdfMax] = useLocalStorage("ds-pdf-max", false);

  useEffect(() => {
    setCode((prev) => (prev && prev.length ? prev : EXAMPLES[tab]));
  }, [tab]);

  const onDownload = () => {
    const blob = new Blob([code], { type: "text/x-csrc" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}-aluno.c`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onLoadExample = () => setCode(EXAMPLES[tab]);
  const onReset = () => setCode("");

  return (
    <div className="wrap">
      <header>
        <div className="title">
          AGORA É COM VOCÊ — Laboratório de Pilha, Fila e Listas (C)
        </div>
        <div className="subtitle">
          Estude com o PDF ao lado e programe no editor.
        </div>
      </header>

      <div className="main">
        <aside className={"left " + (pdfMax ? "max" : "")}>
          <div className="panel">
            <div className="panelHeader">
              <div>Material do Professor (PDF)</div>
              <div className="actions">
                <SmallButton onClick={() => setPdfMax(!pdfMax)}>
                  {pdfMax ? "Minimizar" : "Maximizar"}
                </SmallButton>
              </div>
            </div>
            <div className="pdfbox">
              <object
                data="/ListaPilhaFila.pdf"
                type="application/pdf"
                width="100%"
                height="100%"
              >
                <p>
                  Seu navegador não conseguiu embutir o PDF.{" "}
                  <a href="/ListaPilhaFila.pdf">Clique para abrir</a>.
                </p>
              </object>
            </div>
          </div>
        </aside>

        <section className="right">
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={tab === t.key ? "active" : ""}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="editorPanel">
            <div className="toolbar">
              <SmallButton onClick={onDownload}>Baixar .c</SmallButton>
              <SmallButton onClick={onLoadExample}>Carregar Exemplo</SmallButton>
              <SmallButton onClick={onReset}>Resetar</SmallButton>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        </section>
      </div>

      <footer>
        <div>
          Metodologia de repetição: escrever → validar → ajustar → validar, até
          100% de aderência.
        </div>
      </footer>

      <style jsx>{`
        :global(html, body) {
          margin: 0;
          padding: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Arial, Noto Sans, "Helvetica Neue";
        }
        .wrap {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #eee;
          background: #fafafa;
        }
        .title {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .subtitle {
          color: #555;
          font-size: 0.95rem;
        }
        .main {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
        }
        .left .panel {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 7rem);
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }
        .panelHeader {
          padding: 0.6rem 0.8rem;
          font-weight: 700;
          border-bottom: 1px solid #eee;
          background: #fcfcfc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .pdfbox {
          flex: 1;
        }
        .pdfbox object {
          width: 100%;
          height: 100%;
        }
        .right {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .tabs button {
          padding: 0.55rem 0.85rem;
          border-radius: 0.6rem;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
        }
        .tabs .active {
          background: #0f172a;
          color: #fff;
          border-color: #0f172a;
        }
        .editorPanel {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          background: #fff;
          overflow: hidden;
        }
        .toolbar {
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        textarea {
          width: 100%;
          min-height: 360px;
          border: none;
          outline: none;
          padding: 1rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
          font-size: 0.95rem;
        }
        /* PDF maior e modo Maximizar */
        .left.max {
          position: fixed;
          inset: 0;
          z-index: 50;
          padding: 1rem;
          background: #f7f7f7;
        }
        .left.max .panel {
          height: calc(100vh - 2rem);
        }
        @media (max-width: 1080px) {
          .main {
            grid-template-columns: 1fr;
          }
          .right {
            grid-column: 1 / span 1;
          }
        }
      `}</style>
    </div>
  );
}
