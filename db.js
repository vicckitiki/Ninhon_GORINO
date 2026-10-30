/**
 * NIHONGO DUO - db.js (Com Acesso Privado por Domínio + Firebase Anonymous Auth REST)
 */

const STORAGE_KEY_DB = "nd_compact_db_v1";
const STORAGE_KEY_FB_URL = "nd_fb_url_v1";
const STORAGE_KEY_FB_KEY = "nd_fb_key_v1";
const STORAGE_KEY_ACTIVE_USER = "nd_active_user_v1";

// 1. URL do seu Realtime Database:
const DEFAULT_FIREBASE_URL = "https://ninhou-65d0d-default-rtdb.firebaseio.com";

// 2. COLE AQUI A SUA apiKey DO FIREBASE (Restrita ao domínio vicckitiki.github.io):
const DEFAULT_FIREBASE_API_KEY = "AIzaSyBoRJHLdVc-fC33JrMoC_eBIyBTf0jGYvI";

function createEmptyUser(name) {
  return {
    n: name,
    s: [0, 0, 0, 0],
    c: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
  firebaseApiKey: localStorage.getItem(STORAGE_KEY_FB_KEY) || DEFAULT_FIREBASE_API_KEY,
  idToken: null,
  refreshToken: null,
  tokenExpiry: 0,
  syncStatus: "local",
  listeners: [],
  pollTimer: null,

  async init() {
    this.loadLocal();
    if (this.firebaseUrl) {
      await this.pullFromFirebase();
      this.startRealtimePolling();
    }
    this.notify();
  },

  subscribe(cb) {
    this.listeners.push(cb);
  },

  notify() {
    this.listeners.forEach(cb => cb(this.data, this.activeUser, this.syncStatus));
  },

  ensureSchema(userObj) {
    if (!userObj.s || userObj.s.length < 4) {
      userObj.s = [
        userObj.s?.[0] || 0,
        userObj.s?.[1] || 0,
        userObj.s?.[2] || 0,
        userObj.s?.[3] || 0
      ];
    }
    if (!userObj.c) userObj.c = [];
    while (userObj.c.length < 10) {
      userObj.c.push(0);
    }
    if (!userObj.w) userObj.w = {};
    return userObj;
  },

  loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DB);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.u1 && parsed.u2) {
          this.data.u1 = this.ensureSchema(parsed.u1);
          this.data.u2 = this.ensureSchema(parsed.u2);
        }
      }
    } catch (e) {
      console.warn("Erro ao ler cache local:", e);
    }
  },

  saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Erro ao salvar cache local:", e);
    }
  },

  /**
   * Obtém ou renova o Token de Autenticação Anônima (Validado por HTTP Referrer no Google Cloud)
   */
  async getValidAuthToken() {
    const apiKey = (this.firebaseApiKey || "").trim();
    if (!apiKey || apiKey === "COLE_SUA_API_KEY_AQUI") return null;

    // Se o token atual ainda é válido (com margem de 2 min), reutiliza sem gastar requisição
    if (this.idToken && Date.now() < this.tokenExpiry) {
      return this.idToken;
    }

    try {
      // Se já temos refreshToken na sessão, renova o token
      if (this.refreshToken) {
        const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=refresh_token&refresh_token=${this.refreshToken}`
        });
        if (res.ok) {
          const d = await res.json();
          this.idToken = d.id_token;
          this.refreshToken = d.refresh_token;
          this.tokenExpiry = Date.now() + (parseInt(d.expires_in, 10) - 120) * 1000;
          return this.idToken;
        }
      }

      // Faz login anônimo silencioso
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnSecureToken: true })
      });
      if (!res.ok) throw new Error("Falha na autenticação da API Key");
      const data = await res.json();
      this.idToken = data.idToken;
      this.refreshToken = data.refreshToken;
      this.tokenExpiry = Date.now() + (parseInt(data.expiresIn, 10) - 120) * 1000;
      return this.idToken;
    } catch (e) {
      console.warn("Autenticação privada falhou:", e);
      return null;
    }
  },

  /**
   * Monta a URL autenticada para o Realtime Database
   */
  async buildAuthUrl(path) {
    const token = await this.getValidAuthToken();
    const base = `${this.firebaseUrl}${path}`;
    return token ? `${base}?auth=${token}` : base;
  },

  setActiveUser(userKey) {
    if (userKey === "u1" || userKey === "u2") {
      this.activeUser = userKey;
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, userKey);
      this.notify();
    }
  },

  setUserName(userKey, newName) {
    const clean = (newName || "").trim().slice(0, 18);
    if (!clean) return;
    this.data[userKey].n = clean;
    this.saveLocal();
    this.pushUserToFirebase(userKey);
    this.notify();
  },

  async setFirebaseConfig(url) {
    let cleanUrl = (url || "").trim().replace(/\/+$/, "");
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

  async pullFromFirebase() {
    if (!this.firebaseUrl) return;
    try {
      this.syncStatus = "syncing";
      this.notify();
      const targetUrl = await this.buildAuthUrl("/nd_duo.json");
      const res = await fetch(targetUrl);
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
        await this.pushAllToFirebase();
      }
      this.syncStatus = "online";
    } catch (e) {
      console.warn("Falha ao sincronizar com Firebase:", e);
      this.syncStatus = "error";
    }
    this.notify();
  },

  mergeUserProfile(uk, remoteUser) {
    const localUser = this.data[uk] || createEmptyUser(uk === "u1" ? "Jogador 1" : "Jogador 2");
    const rTotal = (remoteUser.s?.[0] || 0) + (remoteUser.s?.[1] || 0);
    const lTotal = (localUser.s?.[0] || 0) + (localUser.s?.[1] || 0);

    if (rTotal >= lTotal) {
      this.data[uk] = this.ensureSchema({
        n: remoteUser.n || localUser.n,
        s: remoteUser.s || [0, 0, 0, 0],
        c: remoteUser.c || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        w: remoteUser.w || {}
      });
    }
  },

  async pushUserToFirebase(userKey) {
    if (!this.firebaseUrl) return;
    try {
      this.syncStatus = "syncing";
      this.notify();
      const targetUrl = await this.buildAuthUrl(`/nd_duo/${userKey}.json`);
      const res = await fetch(targetUrl, {
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
      const targetUrl = await this.buildAuthUrl("/nd_duo.json");
      const res = await fetch(targetUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.data)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.syncStatus = "online";
    } catch (e) {
      this.syncStatus = "error";
    }
    this.notify();
  },

  startRealtimePolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => {
      if (document.visibilityState === "visible" && this.firebaseUrl) {
        this.pullFromFirebase();
      }
    }, 25000);
  },

  getTodayInt() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },

  recordAttempt(itemId, category, isCorrect) {
    const user = this.ensureSchema(this.data[this.activeUser]);
    const hitIdx = isCorrect ? 0 : 1;

    user.s[hitIdx] = (user.s[hitIdx] || 0) + 1;

    const today = this.getTodayInt();
    const lastDay = user.s[3] || 0;
    if (lastDay !== today) {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayInt = yesterdayDate.getFullYear() * 10000 + (yesterdayDate.getMonth() + 1) * 100 + yesterdayDate.getDate();

      if (lastDay === yesterdayInt) {
        user.s[2] = (user.s[2] || 0) + 1;
      } else {
        user.s[2] = 1;
      }
      user.s[3] = today;
    }

    const catMap = { hiragana: 0, katakana: 2, kanji: 4, vocab: 6, genki: 8 };
    const baseIdx = catMap[category] ?? 6;
    user.c[baseIdx + hitIdx] = (user.c[baseIdx + hitIdx] || 0) + 1;

    if (!user.w[itemId]) user.w[itemId] = [0, 0];
    user.w[itemId][hitIdx] += 1;

    this.saveLocal();
  },

  async commitSession() {
    this.saveLocal();
    if (this.firebaseUrl) {
      await this.pushUserToFirebase(this.activeUser);
    } else {
      this.notify();
    }
  },

  buildSmartQueue(pool, maxItems = null) {
    const userW = this.data[this.activeUser]?.w || {};

    const scoredPool = pool.map(item => {
      const stats = userW[item.id];
      let priorityScore = 1.0;

      if (!stats) {
        priorityScore = 2.2 + Math.random() * 0.8;
      } else {
        const [hits, misses] = stats;
        const total = hits + misses;
        const errorRate = misses / (total || 1);
        priorityScore = 1.0 + (errorRate * 4.5) + (misses * 0.6) - Math.min(hits * 0.15, 0.7) + (Math.random() * 0.6);
      }

      return { item, priorityScore };
    });

    scoredPool.sort((a, b) => b.priorityScore - a.priorityScore);
    const selected = maxItems ? scoredPool.slice(0, maxItems) : scoredPool;

    return selected
      .map(x => ({ item: x.item, sortRoll: Math.random() }))
      .sort((a, b) => a.sortRoll - b.sortRoll)
      .map(x => x.item);
  },

  getRecommendations(userKey = this.activeUser) {
    const user = this.data[userKey];
    const w = user?.w || {};

    const allAlpha = window.NihongoData.getAlphabetPool({
      hiragana: true, katakana: true, kanji: true,
      includeDakuten: true, includeYoon: true,
      kanjiLevels: ["n5", "n4", "n3", "n2", "n1"]
    });
    const allVocab = [
      ...window.NihongoData.getVocabularyPool("hiragana"),
      ...window.NihongoData.getVocabularyPool("katakana"),
      ...window.NihongoData.getVocabularyPool("kanji"),
      ...window.NihongoData.getVocabularyPool("genki_all")
    ];

    const catalog = {};
    allAlpha.forEach(a => { catalog[a.id] = { ...a, isVocab: false }; });
    allVocab.forEach(v => { catalog[v.id] = { ...v, isVocab: true }; });

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
    const unseenVocab = allVocab.filter(v => !w[v.id]).slice(0, 4);

    return {
      weakItems: weakItems.slice(0, 6),
      unseenVocab
    };
  },

  getComparisonMetrics() {
    const calcUserStats = (uk) => {
      const u = this.ensureSchema(this.data[uk]);
      const [hits, misses, streak] = u.s;
      const total = hits + misses;
      const acc = total > 0 ? Math.round((hits / total) * 100) : 0;

      const catAcc = (idx) => {
        const h = u.c[idx] || 0;
        const m = u.c[idx + 1] || 0;
        return (h + m) > 0 ? Math.round((h / (h + m)) * 100) : 0;
      };

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
          vocab:    { hits: u.c[6] || 0, misses: u.c[7] || 0, acc: catAcc(6) },
          genki:    { hits: u.c[8] || 0, misses: u.c[9] || 0, acc: catAcc(8) }
        }
      };
    };

    return {
      u1: calcUserStats("u1"),
      u2: calcUserStats("u2")
    };
  },

  exportJSON() {
    return JSON.stringify(this.data);
  },

  async importJSON(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.u1 || !parsed.u2) throw new Error("Formato de backup inválido.");
    this.data.u1 = this.ensureSchema(parsed.u1);
    this.data.u2 = this.ensureSchema(parsed.u2);
    this.saveLocal();
    if (this.firebaseUrl) await this.pushAllToFirebase();
    this.notify();
  }
};

window.NihongoDB = NihongoDB;
