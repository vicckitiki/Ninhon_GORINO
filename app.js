/**
 * NIHONGO DUO - PASSO 4: app.js
 * Motor principal de interface, sessões de treino, validação dupla e relatórios.
 */

const App = {
  currentTab: "dashboard",

  alphaSession: {
    pool: [],
    queue: [],
    index: 0,
    hits: 0,
    misses: 0,
    mistakes: [],
    startTime: 0,
    mode: "mixed",
    currentQuestionType: "input",
    awaitingNext: false
  },

  vocabSession: {
    scriptType: "hiragana",
    mode: "jp_to_pt",
    pool: [],
    queue: [],
    index: 0,
    hits: 0,
    misses: 0,
    awaitingNext: false
  },

  async init() {
    window.NihongoDB.subscribe((data, activeUser, syncStatus) => {
      this.renderHeader(data, activeUser, syncStatus);
      if (this.currentTab === "dashboard") {
        this.renderDashboard();
      }
    });

    this.bindKeyboardShortcuts();
    await window.NihongoDB.init();
    this.renderDashboard();
  },

  bindKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      const alphaQuizVisible = !document.getElementById("alpha-quiz-panel").classList.contains("hidden");
      if (this.currentTab === "alphabet" && alphaQuizVisible) {
        e.preventDefault();
        if (this.alphaSession.awaitingNext) {
          this.nextAlphabetQuestion();
        } else if (this.alphaSession.currentQuestionType === "input") {
          this.submitAlphabetInput();
        }
        return;
      }

      const vocabQuizVisible = !document.getElementById("vocab-quiz-panel").classList.contains("hidden");
      if (this.currentTab === "vocab" && vocabQuizVisible) {
        e.preventDefault();
        if (this.vocabSession.awaitingNext) {
          this.nextVocabQuestion();
        } else {
          this.submitVocabAnswer();
        }
      }
    });
  },

  renderHeader(data, activeUser, syncStatus) {
    const u1Name = data.u1?.n || "Jogador 1";
    const u2Name = data.u2?.n || "Jogador 2";

    document.getElementById("label-u1-name").textContent = u1Name;
    document.getElementById("label-u2-name").textContent = u2Name;

    const btnU1 = document.getElementById("btn-user-u1");
    const btnU2 = document.getElementById("btn-user-u2");

    if (activeUser === "u1") {
      btnU1.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-rose-600 text-white shadow";
      btnU2.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white";
    } else {
      btnU2.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-sky-600 text-white shadow";
      btnU1.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-400 hover:text-white";
    }

    const activeStreak = data[activeUser]?.s?.[2] || 0;
    document.getElementById("header-streak").textContent = activeStreak;

    const dot = document.getElementById("sync-dot");
    const label = document.getElementById("sync-label");

    if (syncStatus === "online") {
      dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400";
      label.textContent = "Firebase Online";
    } else if (syncStatus === "syncing") {
      dot.className = "w-2.5 h-2.5 rounded-full bg-amber-400 sync-pulse";
      label.textContent = "Sincronizando...";
    } else if (syncStatus === "error") {
      dot.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
      label.textContent = "Erro Nuvem";
    } else {
      dot.className = "w-2.5 h-2.5 rounded-full bg-slate-400";
      label.textContent = "Modo Local";
    }
  },

  switchUser(userKey) {
    window.NihongoDB.setActiveUser(userKey);
  },

  promptRenameUser() {
    const activeKey = window.NihongoDB.activeUser;
    const currentName = window.NihongoDB.data[activeKey].n;
    const newName = prompt("Digite o nome para este perfil (máx. 18 caracteres):", currentName);
    if (newName && newName.trim()) {
      window.NihongoDB.setUserName(activeKey, newName.trim());
    }
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    ["dashboard", "alphabet", "vocab"].forEach(t => {
      const view = document.getElementById(`view-${t}`);
      const btn = document.getElementById(`tab-btn-${t}`);
      if (t === tabName) {
        view.classList.remove("hidden");
        btn.className = "tab-active py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2";
      } else {
        view.classList.add("hidden");
        btn.className = "text-slate-300 hover:text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2";
      }
    });

    if (tabName === "dashboard") {
      this.renderDashboard();
    }
  },

  renderDashboard() {
    const metrics = window.NihongoDB.getComparisonMetrics();
    const activeKey = window.NihongoDB.activeUser;
    const activeProfile = metrics[activeKey];

    document.getElementById("dash-active-name").textContent = activeProfile.name;
    document.getElementById("rec-user-name").textContent = activeProfile.name;

    document.getElementById("vs-u1-title").textContent = metrics.u1.name;
    document.getElementById("vs-u2-title").textContent = metrics.u2.name;

    ["u1", "u2"].forEach(uk => {
      const m = metrics[uk];
      document.getElementById(`card-${uk}-name`).textContent = m.name;
      document.getElementById(`card-${uk}-streak`).textContent = `🔥 ${m.streak}d`;
      document.getElementById(`card-${uk}-acc`).textContent = `${m.accuracy}%`;
      document.getElementById(`card-${uk}-hits`).textContent = `${m.hits} acertos`;
      document.getElementById(`card-${uk}-misses`).textContent = `${m.misses} erros`;
      document.getElementById(`card-${uk}-mastered`).textContent = m.masteredCount;
    });

    const catDefs = [
      { key: "hiragana", label: "Hiragana (あ)" },
      { key: "katakana", label: "Katakana (ア)" },
      { key: "kanji",    label: "Kanji (漢)" },
      { key: "vocab",    label: "Vocabulário (語)" }
    ];

    const barsHtml = catDefs.map(cat => {
      const u1Cat = metrics.u1.categories[cat.key];
      const u2Cat = metrics.u2.categories[cat.key];
      return `
        <div class="space-y-1">
          <div class="flex justify-between text-xs font-semibold">
            <span class="text-rose-400">${u1Cat.acc}% (${u1Cat.hits}✓)</span>
            <span class="text-slate-300">${cat.label}</span>
            <span class="text-sky-400">${u2Cat.acc}% (${u2Cat.hits}✓)</span>
          </div>
          <div class="grid grid-cols-2 gap-1.5 h-2.5 bg-slate-900 rounded-full p-0.5 border border-slate-800">
            <div class="flex justify-end bg-slate-800/60 rounded-l-full overflow-hidden">
              <div class="bg-rose-500 h-full transition-all duration-500" style="width: ${u1Cat.acc}%"></div>
            </div>
            <div class="flex justify-start bg-slate-800/60 rounded-r-full overflow-hidden">
              <div class="bg-sky-400 h-full transition-all duration-500" style="width: ${u2Cat.acc}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    document.getElementById("comparison-bars-container").innerHTML = barsHtml;

    const recs = window.NihongoDB.getRecommendations(activeKey);
    const weakContainer = document.getElementById("weak-items-list");

    if (recs.weakItems.length === 0) {
      weakContainer.innerHTML = `
        <div class="col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 text-center">
          🎉 Nenhum erro crítico registrado ainda! Faça um treino de Alfabeto ou Vocabulário para calibrar seu radar.
        </div>
      `;
    } else {
      weakContainer.innerHTML = recs.weakItems.map(item => {
        const displayChar = item.isVocab ? item.word : item.symbol;
        const subText = item.isVocab
          ? `${item.romaji} (${item.primaryMeaning})`
          : `${item.romaji.toUpperCase()}${item.meaning ? " • " + item.meaning : ""}`;
        return `
          <div onclick="NihongoData.speakJapanese('${displayChar}')" class="cursor-pointer bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between transition">
            <div class="flex items-center gap-3">
              <span class="jp-font text-2xl font-black text-amber-400">${displayChar}</span>
              <div>
                <div class="text-xs font-bold text-white">${subText}</div>
                <div class="text-[11px] text-rose-400">${item.misses} erro(s) • ${item.accuracy}% precisão</div>
              </div>
            </div>
            <span class="text-xs text-slate-400">🔊</span>
          </div>
        `;
      }).join("");
    }

    const unseenContainer = document.getElementById("unseen-vocab-list");
    unseenContainer.innerHTML = recs.unseenVocab.map(v => `
      <div onclick="NihongoData.speakJapanese('${v.word}')" class="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl p-3 flex items-center justify-between transition">
        <div>
          <div class="jp-font text-lg font-bold text-emerald-400">${v.word}</div>
          <div class="text-xs text-slate-300 font-semibold">${v.romaji} — ${v.primaryMeaning}</div>
        </div>
        <span class="text-xs text-slate-500">🔊</span>
      </div>
    `).join("");
  },

  startWeakPointsDrill() {
    const recs = window.NihongoDB.getRecommendations(window.NihongoDB.activeUser);
    const alphaWeak = recs.weakItems.filter(x => !x.isVocab);

    this.switchTab("alphabet");
    if (alphaWeak.length >= 3) {
      this.alphaSession.pool = alphaWeak;
      this.alphaSession.queue = [...alphaWeak];
      this.alphaSession.index = 0;
      this.alphaSession.hits = 0;
      this.alphaSession.misses = 0;
      this.alphaSession.mistakes = [];
      this.alphaSession.startTime = Date.now();
      this.alphaSession.mode = "mixed";

      document.getElementById("alpha-setup-panel").classList.add("hidden");
      document.getElementById("alpha-report-panel").classList.add("hidden");
      document.getElementById("alpha-quiz-panel").classList.remove("hidden");
      this.renderAlphabetQuestion();
    } else {
      document.getElementById("sel-alpha-limit").value = "15";
      this.startAlphabetSession();
    }
  },

  toggleKanjiLevelsVisibility() {
    const isKanjiChecked = document.getElementById("chk-alpha-kanji").checked;
    const box = document.getElementById("kanji-levels-box");
    if (isKanjiChecked) {
      box.classList.remove("hidden");
    } else {
      box.classList.add("hidden");
    }
  },

  startAlphabetSession() {
    const hiragana = document.getElementById("chk-alpha-hira").checked;
    const katakana = document.getElementById("chk-alpha-kata").checked;
    const kanji = document.getElementById("chk-alpha-kanji").checked;
    const includeDakuten = document.getElementById("chk-alpha-dakuten").checked;
    const includeYoon = document.getElementById("chk-alpha-yoon").checked;

    if (!hiragana && !katakana && !kanji) {
      alert("Selecione pelo menos um dos três alfabetos (Hiragana, Katakana ou Kanji)!");
      return;
    }

    const kanjiLevels = Array.from(document.querySelectorAll(".chk-kanji-lvl:checked")).map(el => el.value);
    if (kanji && kanjiLevels.length === 0) {
      alert("Selecione pelo menos 1 Nível de Kanji para delimitar seu estudo!");
      return;
    }

    const rawPool = window.NihongoData.getAlphabetPool({
      hiragana, katakana, kanji, includeDakuten, includeYoon, kanjiLevels
    });

    const limitVal = document.getElementById("sel-alpha-limit").value;
    const maxItems = limitVal === "all" ? null : parseInt(limitVal, 10);
    const mode = document.getElementById("sel-alpha-mode").value;

    const smartQueue = window.NihongoDB.buildSmartQueue(rawPool, maxItems);

    this.alphaSession = {
      pool: rawPool,
      queue: smartQueue,
      index: 0,
      hits: 0,
      misses: 0,
      mistakes: [],
      startTime: Date.now(),
      mode,
      currentQuestionType: "input",
      awaitingNext: false
    };

    document.getElementById("alpha-setup-panel").classList.add("hidden");
    document.getElementById("alpha-report-panel").classList.add("hidden");
    document.getElementById("alpha-quiz-panel").classList.remove("hidden");

    this.renderAlphabetQuestion();
  },

  renderAlphabetQuestion() {
    const s = this.alphaSession;
    if (s.index >= s.queue.length) {
      this.finishAlphabetSession();
      return;
    }

    s.awaitingNext = false;
    const item = s.queue[s.index];

    const total = s.queue.length;
    const currentNum = s.index + 1;
    document.getElementById("alpha-progress-text").textContent = `${currentNum} / ${total}`;
    document.getElementById("alpha-progress-bar").style.width = `${Math.round((currentNum / total) * 100)}%`;

    const badge = document.getElementById("alpha-badge-type");
    const typeLabels = { hiragana: "Hiragana", katakana: "Katakana", kanji: "Kanji" };
    badge.textContent = typeLabels[item.type] || "Kana";

    if (s.mode === "input") {
      s.currentQuestionType = "input";
    } else if (s.mode === "choice") {
      s.currentQuestionType = "choice";
    } else {
      s.currentQuestionType = Math.random() < 0.35 ? "choice" : "input";
    }

    const feedbackBox = document.getElementById("alpha-feedback-box");
    feedbackBox.classList.add("hidden");

    const inputContainer = document.getElementById("alpha-input-container");
    const choiceContainer = document.getElementById("alpha-choice-container");
    const instruction = document.getElementById("alpha-question-instruction");
    const mainDisplay = document.getElementById("alpha-main-display");
    const kanjiMeaningEl = document.getElementById("alpha-kanji-meaning");
    const audioBtn = document.getElementById("alpha-btn-audio");

    if (s.currentQuestionType === "input") {
      instruction.textContent = "Digite a sílaba/leitura correspondente em Romaji:";
      mainDisplay.textContent = item.symbol;
      audioBtn.classList.remove("hidden");

      if (item.type === "kanji" && item.meaning) {
        kanjiMeaningEl.textContent = `Significado: ${item.meaning}`;
        kanjiMeaningEl.classList.remove("hidden");
      } else {
        kanjiMeaningEl.classList.add("hidden");
      }

      inputContainer.classList.remove("hidden");
      choiceContainer.classList.add("hidden");

      const romajiInput = document.getElementById("alpha-romaji-input");
      romajiInput.value = "";
      romajiInput.disabled = false;
      document.getElementById("alpha-submit-btn").disabled = false;
      setTimeout(() => romajiInput.focus(), 40);
    } else {
      instruction.textContent = "Escolha a partícula/símbolo correto para a sílaba:";
      mainDisplay.textContent = item.romaji.toUpperCase();
      audioBtn.classList.add("hidden");

      if (item.type === "kanji" && item.meaning) {
        kanjiMeaningEl.textContent = `Dica de significado: ${item.meaning}`;
        kanjiMeaningEl.classList.remove("hidden");
      } else {
        kanjiMeaningEl.classList.add("hidden");
      }

      inputContainer.classList.add("hidden");
      choiceContainer.classList.remove("hidden");

      const sameTypePool = s.pool.filter(x => x.type === item.type && x.id !== item.id);
      const fallbackPool = s.pool.filter(x => x.id !== item.id);
      const sourceDistractors = sameTypePool.length >= 3 ? sameTypePool : fallbackPool;

      const distractors = [...sourceDistractors]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [item, ...distractors].sort(() => Math.random() - 0.5);

      choiceContainer.innerHTML = options.map(opt => `
        <button onclick="App.submitAlphabetChoice('${opt.id}')" class="char-tile jp-font text-3xl sm:text-4xl font-black bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-rose-500 rounded-2xl py-5 text-white transition">
          ${opt.symbol}
        </button>
      `).join("");
    }
  },

  playCurrentAlphaAudio() {
    const item = this.alphaSession.queue[this.alphaSession.index];
    if (item) window.NihongoData.speakJapanese(item.symbol);
  },

  submitAlphabetInput() {
    const s = this.alphaSession;
    if (s.awaitingNext) return;

    const inputEl = document.getElementById("alpha-romaji-input");
    const rawVal = window.NihongoData.normalizeText(inputEl.value);
    if (!rawVal) return;

    const item = s.queue[s.index];
    const isCorrect = item.acceptedRomaji.some(r => window.NihongoData.normalizeText(r) === rawVal);

    inputEl.disabled = true;
    document.getElementById("alpha-submit-btn").disabled = true;

    this.processAlphabetResult(item, isCorrect, rawVal);
  },

  submitAlphabetChoice(chosenId) {
    const s = this.alphaSession;
    if (s.awaitingNext) return;

    const item = s.queue[s.index];
    const isCorrect = chosenId === item.id;
    const chosenItem = s.pool.find(x => x.id === chosenId);

    const buttons = document.querySelectorAll("#alpha-choice-container button");
    buttons.forEach(btn => { btn.disabled = true; });

    this.processAlphabetResult(item, isCorrect, chosenItem ? `${chosenItem.symbol} (${chosenItem.romaji})` : chosenId);
  },

  processAlphabetResult(item, isCorrect, userAnswer) {
    const s = this.alphaSession;
    s.awaitingNext = true;

    if (isCorrect) {
      s.hits += 1;
    } else {
      s.misses += 1;
      if (!s.mistakes.some(m => m.item.id === item.id)) {
        s.mistakes.push({ item, userAnswer });
      }
    }

    window.NihongoDB.recordAttempt(item.id, item.type, isCorrect);
    window.NihongoData.speakJapanese(item.symbol);

    const box = document.getElementById("alpha-feedback-box");
    const title = document.getElementById("alpha-feedback-title");
    const hint = document.getElementById("alpha-feedback-hint");

    box.classList.remove("hidden");
    if (isCorrect) {
      box.className = "rounded-xl p-4 text-sm space-y-1 border bg-emerald-950/40 border-emerald-500/40 text-emerald-200";
      title.innerHTML = `✅ Correto! <span class="jp-font font-black text-lg ml-1">${item.symbol}</span> = <strong>${item.acceptedRomaji.join(" / ").toUpperCase()}</strong>`;
    } else {
      box.className = "rounded-xl p-4 text-sm space-y-1 border bg-rose-950/40 border-rose-500/40 text-rose-200";
      title.innerHTML = `❌ Resposta certa: <span class="jp-font font-black text-lg mx-1">${item.symbol}</span> = <strong>${item.acceptedRomaji.join(" / ").toUpperCase()}</strong> (Você respondeu: <em>${userAnswer}</em>)`;
    }
    hint.textContent = `💡 ${item.hint}`;

    document.getElementById("alpha-next-btn").focus();
  },

  nextAlphabetQuestion() {
    this.alphaSession.index += 1;
    this.renderAlphabetQuestion();
  },

  async finishAlphabetSession() {
    const s = this.alphaSession;
    await window.NihongoDB.commitSession();

    document.getElementById("alpha-quiz-panel").classList.add("hidden");
    document.getElementById("alpha-report-panel").classList.remove("hidden");

    const totalAnswered = s.hits + s.misses;
    const acc = totalAnswered > 0 ? Math.round((s.hits / totalAnswered) * 100) : 0;
    const elapsedSec = Math.max(1, (Date.now() - s.startTime) / 1000);
    const avgTime = totalAnswered > 0 ? (elapsedSec / totalAnswered).toFixed(1) : "0.0";

    document.getElementById("rep-alpha-acc").textContent = `${acc}%`;
    document.getElementById("rep-alpha-hits").textContent = s.hits;
    document.getElementById("rep-alpha-misses").textContent = s.misses;
    document.getElementById("rep-alpha-time").textContent = `${avgTime}s`;

    const retryBtn = document.getElementById("btn-retry-alpha-errors");
    const tipsList = document.getElementById("rep-alpha-tips-list");

    if (s.mistakes.length === 0) {
      retryBtn.classList.add("hidden");
      tipsList.innerHTML = `
        <div class="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-sm text-emerald-300 font-medium">
          🏆 Desempenho impecável! Você não errou nenhum caractere nesta sessão. Experimente ativar <strong>Dakuten</strong>, <strong>Yoon</strong> ou avançar um nível de <strong>Kanji</strong>!
        </div>
      `;
    } else {
      retryBtn.classList.remove("hidden");
      tipsList.innerHTML = s.mistakes.map(({ item, userAnswer }) => `
        <div onclick="NihongoData.speakJapanese('${item.symbol}')" class="cursor-pointer bg-slate-900/90 hover:bg-slate-800 border border-rose-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
          <div class="flex items-center gap-4">
            <span class="jp-font text-3xl font-black text-rose-400 bg-rose-500/10 px-3.5 py-2 rounded-xl">${item.symbol}</span>
            <div>
              <div class="font-bold text-sm text-white">
                Leitura correta: <span class="text-emerald-400">${item.acceptedRomaji.join(" / ").toUpperCase()}</span>
                <span class="text-xs text-slate-400 ml-2">(Sua resposta: ${userAnswer})</span>
              </div>
              <div class="text-xs text-amber-300 mt-1">💡 ${item.hint}</div>
            </div>
          </div>
          <span class="text-xs text-slate-400 self-end sm:self-center">🔊 Ouvir</span>
        </div>
      `).join("");
    }
  },

  retryAlphabetMistakes() {
    const mistakeItems = this.alphaSession.mistakes.map(m => m.item);
    if (mistakeItems.length === 0) return;

    this.alphaSession.queue = [...mistakeItems];
    this.alphaSession.index = 0;
    this.alphaSession.hits = 0;
    this.alphaSession.misses = 0;
    this.alphaSession.mistakes = [];
    this.alphaSession.startTime = Date.now();

    document.getElementById("alpha-report-panel").classList.add("hidden");
    document.getElementById("alpha-quiz-panel").classList.remove("hidden");
    this.renderAlphabetQuestion();
  },

  resetAlphabetView() {
    document.getElementById("alpha-quiz-panel").classList.add("hidden");
    document.getElementById("alpha-report-panel").classList.add("hidden");
    document.getElementById("alpha-setup-panel").classList.remove("hidden");
  },

  startVocabSession() {
    const scriptRadio = document.querySelector('input[name="vocab-script"]:checked');
    const modeRadio = document.querySelector('input[name="vocab-mode"]:checked');

    const scriptType = scriptRadio ? scriptRadio.value : "hiragana";
    const mode = modeRadio ? modeRadio.value : "jp_to_pt";

    const rawPool = window.NihongoData.getVocabularyPool(scriptType);
    const smartQueue = window.NihongoDB.buildSmartQueue(rawPool, 12);

    this.vocabSession = {
      scriptType,
      mode,
      pool: rawPool,
      queue: smartQueue,
      index: 0,
      hits: 0,
      misses: 0,
      awaitingNext: false
    };

    document.getElementById("vocab-setup-panel").classList.add("hidden");
    document.getElementById("vocab-quiz-panel").classList.remove("hidden");

    this.renderVocabQuestion();
  },

  renderVocabQuestion() {
    const s = this.vocabSession;
    if (s.index >= s.queue.length) {
      window.NihongoDB.commitSession();
      alert(`Sessão de Vocabulário concluída!\nAcertos: ${s.hits} | Erros: ${s.misses}\nSeu progresso foi atualizado no ranking!`);
      this.resetVocabView();
      this.switchTab("dashboard");
      return;
    }

    s.awaitingNext = false;
    const item = s.queue[s.index];

    const total = s.queue.length;
    const currentNum = s.index + 1;
    document.getElementById("vocab-progress-text").textContent = `${currentNum} / ${total}`;
    document.getElementById("vocab-progress-bar").style.width = `${Math.round((currentNum / total) * 100)}%`;

    const scriptNames = { hiragana: "Hiragana", katakana: "Katakana", kanji: "Kanji" };
    document.getElementById("vocab-badge-info").textContent = `${scriptNames[s.scriptType]} • ${s.mode === "jp_to_pt" ? "JP ➔ PT" : "PT ➔ JP"}`;
    document.getElementById("vocab-category-tag").textContent = item.category;

    const promptDisplay = document.getElementById("vocab-prompt-display");
    const step2PtBox = document.getElementById("vocab-step2-pt-box");
    const step2JpBox = document.getElementById("vocab-step2-jp-box");
    const romajiInput = document.getElementById("vocab-input-romaji");
    const ptInput = document.getElementById("vocab-input-pt");
    const jpInput = document.getElementById("vocab-input-jp");
    const submitBtn = document.getElementById("vocab-submit-btn");

    romajiInput.value = "";
    ptInput.value = "";
    jpInput.value = "";
    romajiInput.disabled = false;
    ptInput.disabled = false;
    jpInput.disabled = false;
    submitBtn.disabled = false;

    document.getElementById("vocab-feedback-box").classList.add("hidden");

    if (s.mode === "jp_to_pt") {
      promptDisplay.textContent = item.word;
      step2PtBox.classList.remove("hidden");
      step2JpBox.classList.add("hidden");
    } else {
      promptDisplay.textContent = `"${item.primaryMeaning}"`;
      step2PtBox.classList.add("hidden");
      step2JpBox.classList.remove("hidden");
      this.renderVocabTilePicker(item);
    }

    setTimeout(() => romajiInput.focus(), 40);
  },

  renderVocabTilePicker(item) {
    const correctChars = Array.from(item.word);
    const otherChars = [];
    this.vocabSession.pool.forEach(v => {
      if (v.id !== item.id) {
        Array.from(v.word).forEach(ch => {
          if (!correctChars.includes(ch) && !otherChars.includes(ch)) {
            otherChars.push(ch);
          }
        });
      }
    });

    const distractors = otherChars.sort(() => Math.random() - 0.5).slice(0, Math.max(4, 8 - correctChars.length));
    const tiles = [...correctChars, ...distractors].sort(() => Math.random() - 0.5);

    const picker = document.getElementById("vocab-tile-picker");
    picker.innerHTML = tiles.map(ch => `
      <button type="button" onclick="App.appendVocabJpChar('${ch}')" class="char-tile jp-font text-lg sm:text-xl font-bold bg-slate-800 hover:bg-purple-600 text-white px-3.5 py-2 rounded-xl border border-slate-700 transition">
        ${ch}
      </button>
    `).join("");
  },

  appendVocabJpChar(char) {
    if (this.vocabSession.awaitingNext) return;
    const jpInput = document.getElementById("vocab-input-jp");
    jpInput.value += char;
    jpInput.focus();
  },

  clearVocabJpInput() {
    if (this.vocabSession.awaitingNext) return;
    const jpInput = document.getElementById("vocab-input-jp");
    jpInput.value = "";
    jpInput.focus();
  },

  playCurrentVocabAudio() {
    const item = this.vocabSession.queue[this.vocabSession.index];
    if (item) window.NihongoData.speakJapanese(item.word);
  },

  submitVocabAnswer() {
    const s = this.vocabSession;
    if (s.awaitingNext) return;

    const item = s.queue[s.index];
    const romajiInput = document.getElementById("vocab-input-romaji");
    const ptInput = document.getElementById("vocab-input-pt");
    const jpInput = document.getElementById("vocab-input-jp");

    const userRomaji = window.NihongoData.normalizeText(romajiInput.value);
    if (!userRomaji) {
      romajiInput.focus();
      return;
    }

    const romajiCorrect = userRomaji === window.NihongoData.normalizeText(item.romaji);
    let step2Correct = false;

    if (s.mode === "jp_to_pt") {
      if (!ptInput.value.trim()) {
        ptInput.focus();
        return;
      }
      step2Correct = window.NihongoData.checkPortugueseMeaning(ptInput.value, item.meanings);
    } else {
      if (!jpInput.value.trim()) {
        jpInput.focus();
        return;
      }
      step2Correct = jpInput.value.trim() === item.word;
    }

    const isFullSuccess = romajiCorrect && step2Correct;
    s.awaitingNext = true;

    romajiInput.disabled = true;
    ptInput.disabled = true;
    jpInput.disabled = true;
    document.getElementById("vocab-submit-btn").disabled = true;

    if (isFullSuccess) {
      s.hits += 1;
    } else {
      s.misses += 1;
    }

    window.NihongoDB.recordAttempt(item.id, "vocab", isFullSuccess);
    window.NihongoData.speakJapanese(item.word);

    const box = document.getElementById("vocab-feedback-box");
    const title = document.getElementById("vocab-feedback-title");
    const detail = document.getElementById("vocab-feedback-detail");

    box.classList.remove("hidden");
    if (isFullSuccess) {
      box.className = "rounded-xl p-4 text-sm space-y-1.5 border bg-emerald-950/40 border-emerald-500/40 text-emerald-200";
      title.innerHTML = `✅ Perfeito! <span class="jp-font font-black text-lg ml-1">${item.word}</span> (${item.romaji}) = <strong>${item.primaryMeaning}</strong>`;
    } else {
      box.className = "rounded-xl p-4 text-sm space-y-1.5 border bg-rose-950/40 border-rose-500/40 text-rose-200";
      const rStatus = romajiCorrect ? "✅ Romaji correto" : `❌ Romaji certo: <strong>${item.romaji}</strong>`;
      const s2Status = s.mode === "jp_to_pt"
        ? (step2Correct ? "✅ Tradução correta" : `❌ Tradução certa: <strong>${item.meanings.join(" / ")}</strong>`)
        : (step2Correct ? "✅ Escrita JP correta" : `❌ Escrita certa: <span class="jp-font font-black text-base">${item.word}</span>`);
      title.innerHTML = `${rStatus} &nbsp;|&nbsp; ${s2Status}`;
    }
    detail.innerHTML = `💡 Dica de estrutura: ${item.hint}`;

    document.getElementById("vocab-next-btn").focus();
  },

  nextVocabQuestion() {
    this.vocabSession.index += 1;
    this.renderVocabQuestion();
  },

  resetVocabView() {
    window.NihongoDB.commitSession();
    document.getElementById("vocab-quiz-panel").classList.add("hidden");
    document.getElementById("vocab-setup-panel").classList.remove("hidden");
  },

  openSyncModal() {
    document.getElementById("input-firebase-url").value = window.NihongoDB.firebaseUrl || "";
    document.getElementById("modal-sync").classList.remove("hidden");
  },

  closeSyncModal() {
    document.getElementById("modal-sync").classList.add("hidden");
  },

  async saveFirebaseUrl() {
    const url = document.getElementById("input-firebase-url").value;
    try {
      await window.NihongoDB.setFirebaseConfig(url);
      this.closeSyncModal();
    } catch (e) {
      alert(e.message || "URL inválida.");
    }
  },

  exportBackup() {
    const json = window.NihongoDB.exportJSON();
    navigator.clipboard.writeText(json).then(() => {
      alert("Código compacto de progresso copiado para a área de transferência!");
    }).catch(() => {
      prompt("Copie o código abaixo:", json);
    });
  },

  async importBackup() {
    const raw = prompt("Cole aqui o código JSON compacto exportado:");
    if (!raw) return;
    try {
      await window.NihongoDB.importJSON(raw);
      alert("Progresso importado e sincronizado com sucesso!");
      this.closeSyncModal();
    } catch (e) {
      alert("Erro ao importar: verifique se o código JSON está completo.");
    }
  }
};

window.App = App;
window.addEventListener("DOMContentLoaded", () => App.init());
