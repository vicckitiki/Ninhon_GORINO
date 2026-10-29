# Ninhon_GORINO
# 🌸 Nihongo Duo

O **Nihongo Duo** é uma aplicação web interativa e competitiva de estudo da língua japonesa, desenvolvida especificamente para ser alojada de forma gratuita no **GitHub Pages** e partilhada entre amigos (com suporte opcional a sincronização em tempo real via Firebase).

---

## 🚀 Funcionalidades Principais

* **🏆 Sistema de Duelo & Dashboard Comparativo:**
  * Alterne facilmente entre perfis (Você vs. Amigo).
  * Acompanhe estatísticas detalhadas de precisão, ofensiva (*streak* de dias seguidos), total de acertos/erros e itens dominados.
  * Barras de progresso e comparação direta divididas por categorias (*Hiragana*, *Katakana*, *Kanji*, *Vocabulário* e *Gramática Genki*).
* **あ Módulo de Alfabeto & Kanjis (JLPT N5 a N1):**
  * Escolha combinar Hiragana, Katakana e/ou Kanjis (divididos por lotes e níveis de proficiência até o N1 / +2.136 Kanjis).
  * Inclui o modo especial **Katakana ➔ Hiragana**, exigindo a escrita direta no caractere japonês com um teclado assistido de blocos.
  * Dinâmica mista entre digitação de Romaji e múltipla escolha reversa, com áudio nativo integrado (`Web Speech API`).
* **語 Módulo de Vocabulário Duplo:**
  * Modo de compreensão (*Japonês ➔ Romaji + Português*) e de produção ativa (*Português ➔ Romaji + Escrita Japonesa* com construtor de blocos).
  * Filtro integrado por lições oficiais do livro **Genki I (3ª Edição)**.
* **📖 Trilha Genki I (Lições 1 a 12):**
  * Resumos de gramática estruturados por capítulo com exemplos em áudio e quiz prático de partículas e conjugação.
* **⚡ Algoritmo Smart Queue (Repetição Espaçada SRS):**
  * Prioriza automaticamente os símbolos e vocabulários que você mais erra, gerando recomendações personalizadas no painel inicial.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3** (com Tailwind CSS via CDN para design responsivo e Modo Escuro).
* **JavaScript (Vanilla ES6+)** para toda a lógica de estado, conversão e motores de quiz.
* **Firebase Realtime Database (REST API)** para a sincronização leve e instantânea entre jogadores (~1 KB por commit).
* **GitHub Pages** para alojamento gratuito e estático.

---

## 📂 Estrutura de Ficheiros

O repositório está organizado em ficheiros estáticos modulares na raiz:

```text
├── index.html       # Interface gráfica (Single Page Application) e estrutura visual
├── data.js          # Base de dados compactada (Kana, Kanjis N5-N1, Vocabulário e Trilha Genki I)
├── db.js            # Camada de persistência (LocalStorage + Sincronização REST com o Firebase)
└── app.js           # Motor da aplicação (quizzes, validações, relatórios e renderização dinâmica)
