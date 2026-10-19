with open("db.js", "w", encoding="utf-8") as f:
    f.write("""/**
 * NIHONGO DUO - PASSO 2: db.js
 * Micro-Schema Ultra-Otimizado (LocalStorage + Firebase Realtime Sync)
 * + Algoritmo de Recomendação Inteligente (Smart Queue SRS)
 */

const STORAGE_KEY_DB = "nd_compact_db_v1";
const STORAGE_KEY_FB_URL = "nd_fb_url_v1";
const STORAGE_KEY_ACTIVE_USER = "nd_active_user_v1";

// Caso queira deixar a URL do seu Firebase fixa no GitHub para seu amigo não precisar colar,
// basta preencher abaixo (ex: "https://seu-projeto-default-rtdb.firebaseio.com")
const DEFAULT_FIREBASE_URL = "";

/**
 * Estrutura vazia ultracompacta de um jogador (~80 bytes)
 * s: [totalHits, totalMisses, streakDays, lastStudyYYYYMMDD]
 * c: [hiraHit, hiraMiss, kataHit, kataMiss, kanjiHit, kanjiMiss, vocabHit, vocabMiss]
 * w: { "id_item": [hits, misses] }
 */
function createEmptyUser(name) {
  return {
    n: name,
    s: [0, 0, 0, 0],
    c: [0, 0, 0, 0, 0, 0, 0, 0],
    w: {}
  };
}

const NihongoDB = {
  data: {
    u1: createEmptyUser("Jogador 1"),
    u2: createEmptyUser("Jogador 2")
  },
  activeUser: localStorage.getItem(STORAGE_KEY_ACTIVE_USER) || "u1",
  firebaseUrl: localStorage.getItem(STORAGE_KEY_FB_URL) || DEFAULT_FIREBASE_URL,
  syncStatus: "local", // "local" | "syncing" | "online" | "error"
  listeners: [],
  pollTimer: null,

  /**
   * Inicializa o banco local e conecta ao Firebase se configurado
   */
  async init() {
    this.loadLocal();
    if (this.firebaseUrl) {
      await this.pullFromFirebase();
      this.startRealtimePolling();
    }
    this.notify();
  },

  /**
   * Inscreve callbacks da interface para atualizar a tela automaticamente
   */
  subscribe(cb) {
    this.listeners.push(cb);
  },

  notify() {
    this.listeners.forEach(cb => cb(this.data, this.activeUser, this.syncStatus));
  },

  /**
   * Carrega cache do navegador
   */
  loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DB);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.u1 && parsed.u2) {
          this.data = parsed;
        }
      }
    } catch (e) {
      console.warn("Erro ao ler cache local:", e);
    }
  },

  /**
   * Salva no navegador instantaneamente
   */
  saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Erro ao salvar cache local:", e);
    }
  },

  /**
   * Alterna entre Você (u1) e Seu Amigo (u2)
   */
  setActiveUser(userKey) {
    if (userKey === "u1" || userKey === "u2") {
      this.activeUser = userKey;
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, userKey);
      this.notify();
    }
  },

  /**
   * Altera o nome de exibição do jogador atual
   */
  setUserName(userKey, newName) {
    const clean = (newName || "").trim().slice(0, 18);
    if (!clean) return;
    this.data[userKey].n = clean;
    this.saveLocal();
    this.pushUserToFirebase(userKey);
    this.notify();
  },

  /**
   * Configura a URL do Firebase Realtime Database
   */
  async setFirebaseConfig(url) {
    let cleanUrl = (url || "").trim().replace(/\\/+$/, "");
    if (cleanUrl && !cleanUrl.startsWith("https://")) {
      throw new Error("A URL do Firebase deve começar com https://");
    }
    this.firebaseUrl = cleanUrl;
    localStorage.setItem(STORAGE_KEY_FB_URL, cleanUrl);

    if (this.pollTimer) clearInterval(this.pollTimer);

    if (cleanUrl) {
      await this.pullFromFirebase();
      await this.pushAllToFirebase();
      this.startRealtimePolling();
    } else {
      this.syncStatus = "local";
      this.notify();
    }
  },

  /**
   * Sincronização leve via REST JSON (Zero bibliotecas pesadas externas, pacotes de ~1KB)
   */
  async pullFromFirebase() {
    if (!this.firebaseUrl) return;
    try {
      this.syncStatus = "syncing";
      this.notify();
      const res = await fetch(`${this.firebaseUrl}/nd_duo.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const remote = await res.json();

      if (remote) {
        ["u1", "u2"].forEach(uk => {
          if (remote[uk]) {
            this.mergeUserProfile(uk, remote[uk]);
          }
        });
        this.saveLocal();
      } else {
        // Se o banco remoto está vazio, sobe os dados locais iniciais
        await this.pushAllToFirebase();
      }
      this.syncStatus = "online";
    } catch (e) {
      console.warn("Falha ao sincronizar com Firebase:", e);
      this.syncStatus = "error";
    }
    this.notify();
  },

  /**
   * Faz o merge inteligente mantendo o maior progresso entre nuvem e local
   */
  mergeUserProfile(uk, remoteUser) {
    const localUser = this.data[uk] || createEmptyUser(uk === "u1" ? "Jogador 1" : "Jogador 2");
    const rTotal = (remoteUser.s?.[0] || 0) + (remoteUser.s?.[1] || 0);
    const lTotal = (localUser.s?.[0] || 0) + (localUser.s?.[1] || 0);

    // Prevalece o estado com mais respostas registradas
    if (rTotal >= lTotal) {
      this.data[uk] = {
        n: remoteUser.n || localUser.n,
        s: remoteUser.s || [0, 0, 0, 0],
        c: remoteUser.c || [0, 0, 0, 0, 0, 0, 0, 0],
        w: remoteUser.w || {}
      };
    }
  },

  /**
   * Envia apenas o nó do jogador ativo (Economiza metade da banda!)
   */
  async pushUserToFirebase(userKey) {
    if (!this.firebaseUrl) return;
    try {
      this.syncStatus = "syncing";
      this.notify();
      const res = await fetch(`${this.firebaseUrl}/nd_duo/${userKey}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.data[userKey])
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.syncStatus = "online";
    } catch (e) {
      console.warn("Erro ao enviar perfil para o Firebase:", e);
      this.syncStatus = "error";
    }
    this.notify();
  },

  async pushAllToFirebase() {
    if (!this.firebaseUrl) return;
    try {
      await fetch(`${this.firebaseUrl}/nd_duo.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.data)
      });
      this.syncStatus = "online";
    } catch (e) {
      this.syncStatus = "error";
    }
    this.notify();
  },

  startRealtimePolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    // Atualiza placar do amigo a cada 25 segundos se a aba estiver visível
    this.pollTimer = setInterval(() => {
      if (document.visibilityState === "visible" && this.firebaseUrl) {
        this.pullFromFirebase();
      }
    }, 25000);
  },

  /**
   * Retorna data atual no formato inteiro compacto YYYYMMDD (ex: 20261019)
   */
  getTodayInt() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },

  /**
   * Registra um acerto ou erro no perfil ativo e já atualiza ofensiva (Streak)
   * category: "hiragana" | "katakana" | "kanji" | "vocab"
   */
  recordAttempt(itemId, category, isCorrect) {
    const user = this.data[this.activeUser];
    const hitIdx = isCorrect ? 0 : 1;

    // 1. Atualiza placar geral
    user.s[hitIdx] = (user.s[hitIdx] || 0) + 1;

    // 2. Atualiza Streak de dias seguidos
    const today = this.getTodayInt();
    const lastDay = user.s[3] || 0;
    if (lastDay !== today) {
      // Verifica se foi ontem (aproximação rápida ou dia consecutivo)
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayInt = yesterdayDate.getFullYear() * 10000 + (yesterdayDate.getMonth() + 1) * 100 + yesterdayDate.getDate();

      if (lastDay === yesterdayInt) {
        user.s[2] = (user.s[2] || 0) + 1;
      } else {
        user.s[2] = 1; // Reinicia/Inicia streak
      }
      user.s[3] = today;
    }

    // 3. Atualiza contadores por categoria no vetor 'c'
    const catMap = { hiragana: 0, katakana: 2, kanji: 4, vocab: 6 };
    const baseIdx = catMap[category] ?? 6;
    user.c[baseIdx + hitIdx] = (user.c[baseIdx + hitIdx] || 0) + 1;

    // 4. Atualiza histórico específico do item (w[itemId] = [hits, misses])
    if (!user.w) user.w = {};
    if (!user.w[itemId]) user.w[itemId] = [0, 0];
    user.w[itemId][hitIdx] += 1;

    this.saveLocal();
  },

  /**
   * Salva o lote da sessão no Firebase ao finalizar ou pausar um treino
   * (Evita dezenas de requisições HTTP a cada tecla pressionada!)
   */
  async commitSession() {
    this.saveLocal();
    if (this.firebaseUrl) {
      await this.pushUserToFirebase(this.activeUser);
    } else {
      this.notify();
    }
  },

  /**
   * ALGORITMO SMART QUEUE (Repetição Espaçada & Priorização de Erros)
   * Ordena e embaralha os itens dando peso maior para:
   * 1. Itens com maior taxa de erro pelo usuário ativo
   * 2. Itens nunca vistos antes (para expandir vocabulário)
   */
  buildSmartQueue(pool, maxItems = null) {
    const userW = this.data[this.activeUser]?.w || {};

    const scoredPool = pool.map(item => {
      const stats = userW[item.id]; // [hits, misses]
      let priorityScore = 1.0;

      if (!stats) {
        // Item inédito: prioridade média-alta para descoberta
        priorityScore = 2.2 + Math.random() * 0.8;
      } else {
        const [hits, misses] = stats;
        const total = hits + misses;
        const errorRate = misses / (total || 1);
        // Peso alto para itens com erros; peso reduzido para itens já dominados
        priorityScore = 1.0 + (errorRate * 4.5) + (misses * 0.6) - Math.min(hits * 0.15, 0.7) + (Math.random() * 0.6);
      }

      return { item, priorityScore };
    });

    scoredPool.sort((a, b) => b.priorityScore - a.priorityScore);
    const selected = maxItems ? scoredPool.slice(0, maxItems) : scoredPool;

    // Embaralha levemente os selecionados para não ficar previsível
    return selected
      .map(x => ({ item: x.item, sortRoll: Math.random() }))
      .sort((a, b) => a.sortRoll - b.sortRoll)
      .map(x => x.item);
  },

  /**
   * Gera recomendações personalizadas para o usuário ativo com base nos pontos fracos
   */
  getRecommendations(userKey = this.activeUser) {
    const user = this.data[userKey];
    const w = user?.w || {};

    // Todos os itens possíveis do sistema para cruzar IDs
    const allAlpha = window.NihongoData.getAlphabetPool({
      hiragana: true, katakana: true, kanji: true,
      includeDakuten: true, includeYoon: true,
      kanjiLevels: ["lvl1", "lvl2", "lvl3", "lvl4"]
    });
    const allVocab = [
      ...window.NihongoData.getVocabularyPool("hiragana"),
      ...window.NihongoData.getVocabularyPool("katakana"),
      ...window.NihongoData.getVocabularyPool("kanji")
    ];

    const catalog = {};
    allAlpha.forEach(a => { catalog[a.id] = { ...a, isVocab: false }; });
    allVocab.forEach(v => { catalog[v.id] = { ...v, isVocab: true }; });

    // 1. Filtra itens críticos (mais erros ou menor precisão)
    const weakItems = [];
    Object.entries(w).forEach(([id, [hits, misses]]) => {
      if (misses > 0 && catalog[id]) {
        const acc = Math.round((hits / (hits + misses)) * 100);
        weakItems.push({
          ...catalog[id],
          hits,
          misses,
          accuracy: acc,
          severity: misses * 2 - hits
        });
      }
    });

    weakItems.sort((a, b) => b.severity - a.severity);

    // 2. Sugere novos vocabulários inéditos para expandir repertório
    const unseenVocab = allVocab.filter(v => !w[v.id]).slice(0, 4);

    return {
      weakItems: weakItems.slice(0, 6),
      unseenVocab
    };
  },

  /**
   * Calcula todas as métricas de comparação entre Você (u1) e Seu Amigo (u2)
   */
  getComparisonMetrics() {
    const calcUserStats = (uk) => {
      const u = this.data[uk];
      const [hits, misses, streak] = u.s;
      const total = hits + misses;
      const acc = total > 0 ? Math.round((hits / total) * 100) : 0;

      const catAcc = (idx) => {
        const h = u.c[idx] || 0;
        const m = u.c[idx + 1] || 0;
        return (h + m) > 0 ? Math.round((h / (h + m)) * 100) : 0;
      };

      // Conta itens dominados (pelo menos 2 acertos e precisão >= 75%)
      let masteredCount = 0;
      Object.values(u.w || {}).forEach(([h, m]) => {
        if (h >= 2 && (h / (h + m)) >= 0.75) masteredCount++;
      });

      return {
        key: uk,
        name: u.n,
        hits,
        misses,
        total,
        accuracy: acc,
        streak,
        masteredCount,
        categories: {
          hiragana: { hits: u.c[0] || 0, misses: u.c[1] || 0, acc: catAcc(0) },
          katakana: { hits: u.c[2] || 0, misses: u.c[3] || 0, acc: catAcc(2) },
          kanji:    { hits: u.c[4] || 0, misses: u.c[5] || 0, acc: catAcc(4) },
          vocab:    { hits: u.c[6] || 0, misses: u.c[7] || 0, acc: catAcc(6) }
        }
      };
    };

    return {
      u1: calcUserStats("u1"),
      u2: calcUserStats("u2")
    };
  },

  /**
   * Exporta/Importa JSON compactado como backup manual
   */
  exportJSON() {
    return JSON.stringify(this.data);
  },

  async importJSON(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.u1 || !parsed.u2) throw new Error("Formato de backup inválido.");
    this.data = parsed;
    this.saveLocal();
    if (this.firebaseUrl) await this.pushAllToFirebase();
    this.notify();
  }
};

window.NihongoDB = NihongoDB;
""")
```Developing the file using `file_gen:generate_document` is actually prohibited for code files according to the prompt instructions:
Wait — let's check the system instructions!
`For code files (e.g., JS, PY, C++, Java, HTML) → call google:ds_python_interpreter.`
Let's run the python code in `google:ds_python_interpreter` or provide both the code block and the downloadable file! Let's execute `google:ds_python_interpreter` to generate `db.js` and also show the code clearly in the markdown response so the user can either download it directly or copy-paste it, matching Step 1.

```python?code_reference&code_event_index=1
with open("db.js", "w", encoding="utf-8") as f:
    f.write("""/**
 * NIHONGO DUO - PASSO 2: db.js
 * Micro-Schema Ultra-Otimizado (LocalStorage + Firebase Realtime Sync)
 * + Algoritmo de Recomendação Inteligente (Smart Queue SRS)
 */

const STORAGE_KEY_DB = "nd_compact_db_v1";
const STORAGE_KEY_FB_URL = "nd_fb_url_v1";
const STORAGE_KEY_ACTIVE_USER = "nd_active_user_v1";

// Caso queira deixar a URL do seu Firebase fixa no GitHub para seu amigo não precisar colar,
// basta preencher abaixo (ex: "https://seu-projeto-default-rtdb.firebaseio.com")
const DEFAULT_FIREBASE_URL = "";

/**
 * Estrutura vazia ultracompacta de um jogador (~80 bytes)
 * s: [totalHits, totalMisses, streakDays, lastStudyYYYYMMDD]
 * c: [hiraHit, hiraMiss, kataHit, kataMiss, kanjiHit, kanjiMiss, vocabHit, vocabMiss]
 * w: { "id_item": [hits, misses] }
 */
function createEmptyUser(name) {
  return {
    n: name,
    s: [0, 0, 0, 0],
    c: [0, 0, 0, 0, 0, 0, 0, 0],
    w: {}
  };
}

const NihongoDB = {
  data: {
    u1: createEmptyUser("Jogador 1"),
    u2: createEmptyUser("Jogador 2")
  },
  activeUser: localStorage.getItem(STORAGE_KEY_ACTIVE_USER) || "u1",
  firebaseUrl: localStorage.getItem(STORAGE_KEY_FB_URL) || DEFAULT_FIREBASE_URL,
  syncStatus: "local", // "local" | "syncing" | "online" | "error"
  listeners: [],
  pollTimer: null,

  /**
   * Inicializa o banco local e conecta ao Firebase se configurado
   */
  async init() {
    this.loadLocal();
    if (this.firebaseUrl) {
      await this.pullFromFirebase();
      this.startRealtimePolling();
    }
    this.notify();
  },

  /**
   * Inscreve callbacks da interface para atualizar a tela automaticamente
   */
  subscribe(cb) {
    this.listeners.push(cb);
  },

  notify() {
    this.listeners.forEach(cb => cb(this.data, this.activeUser, this.syncStatus));
  },

  /**
   * Carrega cache do navegador
   */
  loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DB);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.u1 && parsed.u2) {
          this.data = parsed;
        }
      }
    } catch (e) {
      console.warn("Erro ao ler cache local:", e);
    }
  },

  /**
   * Salva no navegador instantaneamente
   */
  saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Erro ao salvar cache local:", e);
    }
  },

  /**
   * Alterna entre Você (u1) e Seu Amigo (u2)
   */
  setActiveUser(userKey) {
    if (userKey === "u1" || userKey === "u2") {
      this.activeUser = userKey;
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, userKey);
      this.notify();
    }
  },

  /**
   * Altera o nome de exibição do jogador atual
   */
  setUserName(userKey, newName) {
    const clean = (newName || "").trim().slice(0, 18);
    if (!clean) return;
    this.data[userKey].n = clean;
    this.saveLocal();
    this.pushUserToFirebase(userKey);
    this.notify();
  },

  /**
   * Configura a URL do Firebase Realtime Database
   */
  async setFirebaseConfig(url) {
    let cleanUrl = (url || "").trim().replace(/\\/+$/, "");
    if (cleanUrl && !cleanUrl.startsWith("https://")) {
      throw new Error("A URL do Firebase deve começar com https://");
    }
    this.firebaseUrl = cleanUrl;
    localStorage.setItem(STORAGE_KEY_FB_URL, cleanUrl);

    if (this.pollTimer) clearInterval(this.pollTimer);

    if (cleanUrl) {
      await this.pullFromFirebase();
      await this.pushAllToFirebase();
      this.startRealtimePolling();
    } else {
      this.syncStatus = "local";
      this.notify();
    }
  },

  /**
   * Sincronização leve via REST JSON (Zero bibliotecas pesadas externas, pacotes de ~1KB)
   */
  async pullFromFirebase() {
    if (!this.firebaseUrl) return;
    try {
      this.syncStatus = "syncing";
      this.notify();
      const res = await fetch(`${this.firebaseUrl}/nd_duo.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const remote = await res.json();

      if (remote) {
        ["u1", "u2"].forEach(uk => {
          if (remote[uk]) {
            this.mergeUserProfile(uk, remote[uk]);
          }
        });
        this.saveLocal();
      } else {
        // Se o banco remoto está vazio, sobe os dados locais iniciais
        await this.pushAllToFirebase();
      }
      this.syncStatus = "online";
    } catch (e) {
      console.warn("Falha ao sincronizar com Firebase:", e);
      this.syncStatus = "error";
    }
    this.notify();
  },

  /**
   * Faz o merge inteligente mantendo o maior progresso entre nuvem e local
   */
  mergeUserProfile(uk, remoteUser) {
    const localUser = this.data[uk] || createEmptyUser(uk === "u1" ? "Jogador 1" : "Jogador 2");
    const rTotal = (remoteUser.s?.[0] || 0) + (remoteUser.s?.[1] || 0);
    const lTotal = (localUser.s?.[0] || 0) + (localUser.s?.[1] || 0);

    // Prevalece o estado com mais respostas registradas
    if (rTotal >= lTotal) {
      this.data[uk] = {
        n: remoteUser.n || localUser.n,
        s: remoteUser.s || [0, 0, 0, 0],
        c: remoteUser.c || [0, 0, 0, 0, 0, 0, 0, 0],
        w: remoteUser.w || {}
      };
    }
  },

  /**
   * Envia apenas o nó do jogador ativo (Economiza metade da banda!)
   */
  async pushUserToFirebase(userKey) {
    if (!this.firebaseUrl) return;
    try {
      this.syncStatus = "syncing";
      this.notify();
      const res = await fetch(`${this.firebaseUrl}/nd_duo/${userKey}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.data[userKey])
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.syncStatus = "online";
    } catch (e) {
      console.warn("Erro ao enviar perfil para o Firebase:", e);
      this.syncStatus = "error";
    }
    this.notify();
  },

  async pushAllToFirebase() {
    if (!this.firebaseUrl) return;
    try {
      await fetch(`${this.firebaseUrl}/nd_duo.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.data)
      });
      this.syncStatus = "online";
    } catch (e) {
      this.syncStatus = "error";
    }
    this.notify();
  },

  startRealtimePolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    // Atualiza placar do amigo a cada 25 segundos se a aba estiver visível
    this.pollTimer = setInterval(() => {
      if (document.visibilityState === "visible" && this.firebaseUrl) {
        this.pullFromFirebase();
      }
    }, 25000);
  },

  /**
   * Retorna data atual no formato inteiro compacto YYYYMMDD (ex: 20261019)
   */
  getTodayInt() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },

  /**
   * Registra um acerto ou erro no perfil ativo e já atualiza ofensiva (Streak)
   * category: "hiragana" | "katakana" | "kanji" | "vocab"
   */
  recordAttempt(itemId, category, isCorrect) {
    const user = this.data[this.activeUser];
    const hitIdx = isCorrect ? 0 : 1;

    // 1. Atualiza placar geral
    user.s[hitIdx] = (user.s[hitIdx] || 0) + 1;

    // 2. Atualiza Streak de dias seguidos
    const today = this.getTodayInt();
    const lastDay = user.s[3] || 0;
    if (lastDay !== today) {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayInt = yesterdayDate.getFullYear() * 10000 + (yesterdayDate.getMonth() + 1) * 100 + yesterdayDate.getDate();

      if (lastDay === yesterdayInt) {
        user.s[2] = (user.s[2] || 0) + 1;
      } else {
        user.s[2] = 1; // Reinicia/Inicia streak
      }
      user.s[3] = today;
    }

    // 3. Atualiza contadores por categoria no vetor 'c'
    const catMap = { hiragana: 0, katakana: 2, kanji: 4, vocab: 6 };
    const baseIdx = catMap[category] ?? 6;
    user.c[baseIdx + hitIdx] = (user.c[baseIdx + hitIdx] || 0) + 1;

    // 4. Atualiza histórico específico do item (w[itemId] = [hits, misses])
    if (!user.w) user.w = {};
    if (!user.w[itemId]) user.w[itemId] = [0, 0];
    user.w[itemId][hitIdx] += 1;

    this.saveLocal();
  },

  /**
   * Salva o lote da sessão no Firebase ao finalizar ou pausar um treino
   * (Evita dezenas de requisições HTTP a cada tecla pressionada!)
   */
  async commitSession() {
    this.saveLocal();
    if (this.firebaseUrl) {
      await this.pushUserToFirebase(this.activeUser);
    } else {
      this.notify();
    }
  },

  /**
   * ALGORITMO SMART QUEUE (Repetição Espaçada & Priorização de Erros)
   * Ordena e embaralha os itens dando peso maior para:
   * 1. Itens com maior taxa de erro pelo usuário ativo
   * 2. Itens nunca vistos antes (para expandir vocabulário)
   */
  buildSmartQueue(pool, maxItems = null) {
    const userW = this.data[this.activeUser]?.w || {};

    const scoredPool = pool.map(item => {
      const stats = userW[item.id]; // [hits, misses]
      let priorityScore = 1.0;

      if (!stats) {
        // Item inédito: prioridade média-alta para descoberta
        priorityScore = 2.2 + Math.random() * 0.8;
      } else {
        const [hits, misses] = stats;
        const total = hits + misses;
        const errorRate = misses / (total || 1);
        // Peso alto para itens com erros; peso reduzido para itens já dominados
        priorityScore = 1.0 + (errorRate * 4.5) + (misses * 0.6) - Math.min(hits * 0.15, 0.7) + (Math.random() * 0.6);
      }

      return { item, priorityScore };
    });

    scoredPool.sort((a, b) => b.priorityScore - a.priorityScore);
    const selected = maxItems ? scoredPool.slice(0, maxItems) : scoredPool;

    // Embaralha levemente os selecionados para não ficar previsível
    return selected
      .map(x => ({ item: x.item, sortRoll: Math.random() }))
      .sort((a, b) => a.sortRoll - b.sortRoll)
      .map(x => x.item);
  },

  /**
   * Gera recomendações personalizadas para o usuário ativo com base nos pontos fracos
   */
  getRecommendations(userKey = this.activeUser) {
    const user = this.data[userKey];
    const w = user?.w || {};

    // Todos os itens possíveis do sistema para cruzar IDs
    const allAlpha = window.NihongoData.getAlphabetPool({
      hiragana: true, katakana: true, kanji: true,
      includeDakuten: true, includeYoon: true,
      kanjiLevels: ["lvl1", "lvl2", "lvl3", "lvl4"]
    });
    const allVocab = [
      ...window.NihongoData.getVocabularyPool("hiragana"),
      ...window.NihongoData.getVocabularyPool("katakana"),
      ...window.NihongoData.getVocabularyPool("kanji")
    ];

    const catalog = {};
    allAlpha.forEach(a => { catalog[a.id] = { ...a, isVocab: false }; });
    allVocab.forEach(v => { catalog[v.id] = { ...v, isVocab: true }; });

    // 1. Filtra itens críticos (mais erros ou menor precisão)
    const weakItems = [];
    Object.entries(w).forEach(([id, [hits, misses]]) => {
      if (misses > 0 && catalog[id]) {
        const acc = Math.round((hits / (hits + misses)) * 100);
        weakItems.push({
          ...catalog[id],
          hits,
          misses,
          accuracy: acc,
          severity: misses * 2 - hits
        });
      }
    });

    weakItems.sort((a, b) => b.severity - a.severity);

    // 2. Sugere novos vocabulários inéditos para expandir repertório
    const unseenVocab = allVocab.filter(v => !w[v.id]).slice(0, 4);

    return {
      weakItems: weakItems.slice(0, 6),
      unseenVocab
    };
  },

  /**
   * Calcula todas as métricas de comparação entre Você (u1) e Seu Amigo (u2)
   */
  getComparisonMetrics() {
    const calcUserStats = (uk) => {
      const u = this.data[uk];
      const [hits, misses, streak] = u.s;
      const total = hits + misses;
      const acc = total > 0 ? Math.round((hits / total) * 100) : 0;

      const catAcc = (idx) => {
        const h = u.c[idx] || 0;
        const m = u.c[idx + 1] || 0;
        return (h + m) > 0 ? Math.round((h / (h + m)) * 100) : 0;
      };

      // Conta itens dominados (pelo menos 2 acertos e precisão >= 75%)
      let masteredCount = 0;
      Object.values(u.w || {}).forEach(([h, m]) => {
        if (h >= 2 && (h / (h + m)) >= 0.75) masteredCount++;
      });

      return {
        key: uk,
        name: u.n,
        hits,
        misses,
        total,
        accuracy: acc,
        streak,
        masteredCount,
        categories: {
          hiragana: { hits: u.c[0] || 0, misses: u.c[1] || 0, acc: catAcc(0) },
          katakana: { hits: u.c[2] || 0, misses: u.c[3] || 0, acc: catAcc(2) },
          kanji:    { hits: u.c[4] || 0, misses: u.c[5] || 0, acc: catAcc(4) },
          vocab:    { hits: u.c[6] || 0, misses: u.c[7] || 0, acc: catAcc(6) }
        }
      };
    };

    return {
      u1: calcUserStats("u1"),
      u2: calcUserStats("u2")
    };
  },

  /**
   * Exporta/Importa JSON compactado como backup manual
   */
  exportJSON() {
    return JSON.stringify(this.data);
  },

  async importJSON(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.u1 || !parsed.u2) throw new Error("Formato de backup inválido.");
    this.data = parsed;
    this.saveLocal();
    if (this.firebaseUrl) await this.pushAllToFirebase();
    this.notify();
  }
};

window.NihongoDB = NihongoDB;
""")
print("db.js generated successfully")
