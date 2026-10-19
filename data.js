/**
 * NIHONGO DUO - PASSO 1: data.js
 * Base de dados compactada e funções auxiliares de áudio/validação.
 */

// 1. MATRIZES COMPACTAS DE KANA: [RomajiPrincipal, Hiragana, Katakana, [RomajisAlternativosAceitos]]
const RAW_KANA_GOJUON = [
  ["a","あ","ア",[]], ["i","い","イ",[]], ["u","う","ウ",[]], ["e","え","エ",[]], ["o","お","オ",[]],
  ["ka","か","カ",[]], ["ki","き","キ",[]], ["ku","く","ク",[]], ["ke","け","ケ",[]], ["ko","こ","コ",[]],
  ["sa","さ","サ",[]], ["shi","し","シ",["si"]], ["su","す","ス",[]], ["se","せ","セ",[]], ["so","そ","ソ",[]],
  ["ta","た","タ",[]], ["chi","ち","チ",["ti"]], ["tsu","つ","ツ",["tu"]], ["te","て","テ",[]], ["to","と","ト",[]],
  ["na","な","ナ",[]], ["ni","に","ニ",[]], ["nu","ぬ","ヌ",[]], ["ne","ね","ネ",[]], ["no","の","ノ",[]],
  ["ha","は","ハ",[]], ["hi","ひ","ヒ",[]], ["fu","ふ","フ",["hu"]], ["he","へ","ヘ",[]], ["ho","ほ","ホ",[]],
  ["ma","ま","マ",[]], ["mi","み","ミ",[]], ["mu","む","ム",[]], ["me","め","メ",[]], ["mo","も","モ",[]],
  ["ya","や","ヤ",[]], ["yu","ゆ","ユ",[]], ["yo","よ","ヨ",[]],
  ["ra","ら","ラ",[]], ["ri","り","リ",[]], ["ru","る","ル",[]], ["re","れ","レ",[]], ["ro","ろ","ロ",[]],
  ["wa","わ","ワ",[]], ["wo","を","ヲ",["o"]], ["n","ん","ン",["nn"]]
];

const RAW_KANA_DAKUTEN = [
  ["ga","が","ガ",[]], ["gi","ぎ","ギ",[]], ["gu","ぐ","グ",[]], ["ge","げ","ゲ",[]], ["go","ご","ゴ",[]],
  ["za","ざ","ザ",[]], ["ji","じ","ジ",["zi"]], ["zu","ず","ズ",[]], ["ze","ぜ","ゼ",[]], ["zo","ぞ","ゾ",[]],
  ["da","だ","ダ",[]], ["dji","ぢ","ヂ",["di","ji"]], ["dzu","づ","ヅ",["du","zu"]], ["de","で","デ",[]], ["do","ど","ド",[]],
  ["ba","ば","バ",[]], ["bi","び","ビ",[]], ["bu","ぶ","ブ",[]], ["be","べ","ベ",[]], ["bo","ぼ","ボ",[]],
  ["pa","ぱ","パ",[]], ["pi","ぴ","ピ",[]], ["pu","ぷ","プ",[]], ["pe","ぺ","ペ",[]], ["po","ぽ","ポ",[]]
];

const RAW_KANA_YOON = [
  ["kya","きゃ","キャ",[]], ["kyu","きゅ","キュ",[]], ["kyo","きょ","キョ",[]],
  ["sha","しゃ","シャ",["sya"]], ["shu","しゅ","シュ",["syu"]], ["sho","しょ","ショ",["syo"]],
  ["cha","ちゃ","チャ",["tya"]], ["chu","ちゅ","チュ",["tyu"]], ["cho","ちょ","チョ",["tyo"]],
  ["nya","にゃ","ニャ",[]], ["nyu","にゅ","ニュ",[]], ["nyo","にょ","ニョ",[]],
  ["hya","ひゃ","ヒャ",[]], ["hyu","ひゅ","ヒュ",[]], ["hyo","ひょ","ヒョ",[]],
  ["mya","みゃ","ミャ",[]], ["myu","みゅ","ミュ",[]], ["myo","みょ","ミョ",[]],
  ["rya","りゃ","リャ",[]], ["ryu","りゅ","リュ",[]], ["ryo","りょ","リョ",[]],
  ["gya","ぎゃ","ギャ",[]], ["gyu","ぎゅ","ギュ",[]], ["gyo","ぎょ","ギョ",[]],
  ["ja","じゃ","ジャ",["jya","zya"]], ["ju","じゅ","ジュ",["jyu","zyu"]], ["jo","じょ","ジョ",["jyo","zyo"]],
  ["bya","びゃ","ビャ",[]], ["byu","びゅ","ビュ",[]], ["byo","びょ","ビョ",[]],
  ["pya","ぴゃ","ピャ",[]], ["pyu","ぴゅ","ピュ",[]], ["pyo","ぴょ","ピョ",[]]
];

// 2. KANJI POR NÍVEIS (Para não sobrecarregar o estudo)
// Formato: [Id, Caractere, RomajiPrincipal, [RomajisAceitos], SignificadoPT, DicaMnemonica]
const RAW_KANJI_LEVELS = {
  "lvl1": {
    name: "Nível 1: Números & Quantidades (10 Kanjis)",
    items: [
      ["k_1", "一", "ichi", ["ichi", "hito"], "Um", "Um único traço horizontal."],
      ["k_2", "二", "ni", ["ni", "futa"], "Dois", "Dois traços horizontais paralelos."],
      ["k_3", "三", "san", ["san", "mi"], "Três", "Três traços horizontais."],
      ["k_4", "四", "yon", ["yon", "shi", "yo"], "Quatro", "Parece uma janela quadrada com 4 cantos."],
      ["k_5", "五", "go", ["go", "itsu"], "Cinco", "Cruza linhas entre o céu e a terra."],
      ["k_6", "六", "roku", ["roku", "mu"], "Seis", "Uma tampa com duas perninhas embaixo."],
      ["k_7", "七", "nana", ["nana", "shichi"], "Sete", "Parece um 7 invertido cortando uma linha."],
      ["k_8", "八", "hachi", ["hachi", "ya"], "Oito", "Dois traços que se abrem para o infinito."],
      ["k_9", "九", "kyuu", ["kyuu", "ku", "kokono"], "Nove", "Lembra alguém dobrando o braço fazendo força."],
      ["k_10", "十", "juu", ["juu", "too"], "Dez", "Uma cruz completa unindo vertical e horizontal."]
    ]
  },
  "lvl2": {
    name: "Nível 2: Natureza & Elementos (10 Kanjis)",
    items: [
      ["k_11", "日", "hi", ["hi", "bi", "nichi", "jitsu"], "Sol / Dia", "O contorno do sol com um brilho no meio."],
      ["k_12", "月", "tsuki", ["tsuki", "getsu", "gatsu"], "Lua / Mês", "Formato de lua crescente com nuvens no meio."],
      ["k_13", "火", "hi", ["hi", "ka"], "Fogo", "Uma fogueira com fagulhas saindo dos lados."],
      ["k_14", "水", "mizu", ["mizu", "sui"], "Água", "Um rio central com respingos nas laterais."],
      ["k_15", "木", "ki", ["ki", "moku", "boku"], "Árvore / Madeira", "Tronco, galhos horizontais e raízes embaixo."],
      ["k_16", "金", "kane", ["kane", "kin", "kon"], "Ouro / Dinheiro", "Pepitas de ouro enterradas sob o telhado de uma mina."],
      ["k_17", "土", "tsuchi", ["tsuchi", "do", "to"], "Terra / Solo", "Uma planta brotando acima da linha do chão."],
      ["k_18", "山", "yama", ["yama", "san"], "Montanha", "Três picos de uma cordilheira."],
      ["k_19", "川", "kawa", ["kawa", "sen"], "Rio", "Três correntes de água fluindo lado a lado."],
      ["k_20", "空", "sora", ["sora", "kuu"], "Céu / Vazio", "O espaço aberto acima de uma caverna."]
    ]
  },
  "lvl3": {
    name: "Nível 3: Pessoas & Cotidiano (10 Kanjis)",
    items: [
      ["k_21", "人", "hito", ["hito", "jin", "nin"], "Pessoa", "Duas pernas caminhando apoiadas uma na outra."],
      ["k_22", "口", "kuchi", ["kuchi", "kou"], "Boca", "O formato aberto de uma boca."],
      ["k_23", "目", "me", ["me", "moku"], "Olho", "Um olho colocado na vertical com a pupila."],
      ["k_24", "手", "te", ["te", "shu"], "Mão", "Dedos abertos vistos de frente."],
      ["k_25", "足", "ashi", ["ashi", "soku"], "Pé / Perna", "A rótula do joelho acima dos ossos do pé."],
      ["k_26", "大", "oo", ["oo", "dai", "tai"], "Grande", "Uma pessoa abrindo os braços e pernas ao máximo."],
      ["k_27", "小", "chii", ["chii", "ko", "shou"], "Pequeno", "Algo partido em pedacinhos pequenos."],
      ["k_28", "上", "ue", ["ue", "jou"], "Cima / Acima", "Uma seta apontando acima da linha base."],
      ["k_29", "下", "shita", ["shita", "ka", "ge"], "Baixo / Abaixo", "Algo pendurado abaixo da linha do teto."],
      ["k_30", "中", "naka", ["naka", "chuu"], "Meio / Dentro", "Uma linha atravessando exatamente o centro de uma caixa."]
    ]
  },
  "lvl4": {
    name: "Nível 4: Verbos & Escola JLPT N5 (10 Kanjis)",
    items: [
      ["k_31", "本", "hon", ["hon", "moto"], "Livro / Origem", "Uma árvore (木) com a raiz marcada na base."],
      ["k_32", "学", "mana", ["mana", "gaku"], "Estudar / Ciência", "Uma criança (子) sob o teto de uma escola."],
      ["k_33", "生", "i", ["i", "nama", "sei", "shou"], "Vida / Nascer", "Uma planta brotando da terra fértil."],
      ["k_34", "先", "saki", ["saki", "sen"], "Antes / Futuro / Guia", "Uma pessoa caminhando à frente das outras."],
      ["k_35", "行", "i", ["i", "yu", "kou", "gyou"], "Ir / Andar", "Um cruzamento de ruas movimentado."],
      ["k_36", "来", "ku", ["ku", "ki", "rai"], "Vir / Próximo", "Trigo crescendo que traz a colheita que vem."],
      ["k_37", "食", "ta", ["ta", "shoku"], "Comer / Comida", "Algo bom sob um teto (restaurante/casa)."],
      ["k_38", "飲", "no", ["no", "in"], "Beber", "Relacionado a comida/boca aberta engolindo líquido."],
      ["k_39", "見", "mi", ["mi", "ken"], "Ver / Olhar", "Um olho (目) sobre duas pernas caminhando."],
      ["k_40", "聞", "ki", ["ki", "bun", "mon"], "Ouvir / Perguntar", "Uma orelha (耳) atenta atrás de um portão (門)."]
    ]
  }
};

// 3. PARES CONFUSOS & DICAS AUTOMÁTICAS DE MELHORIA
const CONFUSING_HINTS = {
  // Hiragana
  "h_shi": "Confunde き/し/ち? 'き (ki)' tem dois traços horizontais; 'さ (sa)' tem apenas um!",
  "h_sa": "Dica: 'さ (sa)' tem 1 traço horizontal, enquanto 'き (ki)' tem 2 traços!",
  "h_ki": "Dica: 'き (ki)' lembra uma chave (Key) com dois dentes horizontais.",
  "h_chi": "Atenção: 'ち (chi)' parece o número 5, enquanto 'ら (ra)' tem um traço solto em cima.",
  "h_tsu": "Dica: 'つ (tsu)' é uma grande onda (Tsunami) indo para a direita.",
  "h_ha": "Cuidado entre は (ha) e ほ (ho): 'ほ (ho)' tem um 'chapéu' (2 traços horizontais na direita).",
  "h_ho": "Cuidado: 'ほ (ho)' tem 2 traços horizontais na direita; 'は (ha)' tem apenas 1.",
  "h_nu": "Pares gêmeos: 'ぬ (nu)' termina com uma voltinha (rabinho de porco), já 'め (me)' não tem voltinha final!",
  "h_me": "Pares gêmeos: 'め (me)' termina direto sem laço; 'ぬ (nu)' dá um lacinho extra no canto.",
  "h_ru": "Olhe a ponta final: 'る (ru)' faz um laço fechado no fim; 'ろ (ro)' é aberto como o número 3.",
  "h_ro": "Olhe a ponta final: 'ろ (ro)' não tem laço no final; 'る (ru)' fecha uma bolinha.",
  "h_wa": "Trio parecido (わ, れ, ね): 'わ (wa)' é redondo, 'れ (re)' chuta para fora, 'ね (ne)' dá um lacinho!",
  "h_re": "Trio parecido (わ, れ, ね): 'れ (re)' termina chutando a ponta para a direita.",
  "h_ne": "Trio parecido (わ, れ, ね): 'ね (ne)' faz um lacinho no final (igual ao ぬ).",
  // Katakana
  "k_shi": "Clássico do Katakana! 'シ (shi)' alinha os traços na vertical (olha de lado para cima). 'ツ (tsu)' alinha na horizontal (olha de cima para baixo).",
  "k_tsu": "Clássico do Katakana! 'ツ (tsu)' tem os dois tracinhos alinhados no topo horizontal e desce da direita pra esquerda.",
  "k_so": "Cuidado! 'ソ (so)' alinha no topo e desce de cima; 'ン (n)' alinha na esquerda e sobe de baixo.",
  "k_n": "Cuidado! 'ン (n)' tem o traço começando embaixo e subindo (como oシ). Já 'ソ (so)' desce do topo.",
  "k_ku": "Diferença sutil: 'ク (ku)' não tem traço cortando no meio, já 'タ (ta)' tem um tracinho interno!",
  "k_ta": "Diferença sutil: 'タ (ta)' parece 'ク (ku)', mas possui um traço extra no meio.",
  "k_ko": "Não confunda: 'コ (ko)' tem 3 lados fechando na direita; 'ユ (yu)' estica a base inferior.",
  "k_ma": "Pares Katakana: 'マ (ma)' aponta para baixo; 'ム (mu)' forma um triângulo na base."
};

// 4. VOCABULÁRIO ESTRUTURADO POR SISTEMA DE ESCRITA
// Formato: [Id, EscritaJaponês, Romaji, [SignificadosAceitosEmPortuguês], Categoria, DicaLeitura]
const RAW_VOCABULARY = {
  hiragana: [
    ["vh_1", "みず", "mizu", ["agua", "água"], "Substantivos", "mi + zu"],
    ["vh_2", "ねこ", "neko", ["gato", "gata"], "Animais", "ne + ko"],
    ["vh_3", "いぬ", "inu", ["cachorro", "cao", "cão"], "Animais", "i + nu"],
    ["vh_4", "さくら", "sakura", ["cerejeira", "flor de cerejeira"], "Natureza", "sa + ku + ra"],
    ["vh_5", "くるま", "kuruma", ["carro", "automovel", "automóvel"], "Transporte", "ku + ru + ma"],
    ["vh_6", "わたし", "watashi", ["eu"], "Pronomes", "wa + ta + shi"],
    ["vh_7", "あなた", "anata", ["voce", "você", "tu"], "Pronomes", "a + na + ta"],
    ["vh_8", "ともだち", "tomodachi", ["amigo", "amiga"], "Pessoas", "to + mo + da + chi"],
    ["vh_9", "たべる", "taberu", ["comer"], "Verbos", "ta + be + ru"],
    ["vh_10", "のむ", "nomu", ["beber", "tomar"], "Verbos", "no + mu"],
    ["vh_11", "あさ", "asa", ["manha", "manhã"], "Tempo", "a + sa"],
    ["vh_12", "よる", "yoru", ["noite"], "Tempo", "yo + ru"],
    ["vh_13", "おいしい", "oishii", ["delicioso", "gostoso", "saboroso"], "Adjetivos", "o + i + shi + i"],
    ["vh_14", "たかい", "takai", ["caro", "alto"], "Adjetivos", "ta + ka + i"],
    ["vh_15", "やすい", "yasui", ["barato"], "Adjetivos", "ya + su + i"],
    ["vh_16", "おはよう", "ohayou", ["bom dia"], "Expressões", "o + ha + yo + u"],
    ["vh_17", "ありがとう", "arigatou", ["obrigado", "obrigada"], "Expressões", "a + ri + ga + to + u"],
    ["vh_18", "すみません", "sumimasen", ["com licenca", "com licença", "desculpe"], "Expressões", "su + mi + ma + se + n"],
    ["vh_19", "でんしゃ", "densha", ["trem", "metro", "metrô"], "Transporte", "de + n + sha (Yoon)"],
    ["vh_20", "おちゃ", "ocha", ["cha", "chá", "cha verde"], "Bebidas", "o + cha (Yoon)"]
  ],
  katakana: [
    ["vk_1", "コーヒー", "koohii", ["cafe", "café"], "Bebidas", "Prolongamento 'ー' dobra a vogal anterior (koo-hii)"],
    ["vk_2", "テレビ", "terebi", ["tv", "televisao", "televisão"], "Objetos", "te + re + bi"],
    ["vk_3", "パソコン", "pasokon", ["computador", "pc", "notebook"], "Tecnologia", "pa + so + ko + n (Personal Computer)"],
    ["vk_4", "スマホ", "sumaho", ["celular", "smartphone"], "Tecnologia", "su + ma + ho (Smartphone)"],
    ["vk_5", "ホテル", "hoteru", ["hotel"], "Lugares", "ho + te + ru"],
    ["vk_6", "レストラン", "resutoran", ["restaurante"], "Lugares", "re + su + to + ra + n"],
    ["vk_7", "カメラ", "kamera", ["camera", "câmera"], "Objetos", "ka + me + ra"],
    ["vk_8", "パン", "pan", ["pao", "pão"], "Comida", "pa + n (Origem portuguesa!)"],
    ["vk_9", "ケーキ", "keeki", ["bolo"], "Comida", "kee + ki (Cake)"],
    ["vk_10", "アイスクリーム", "aisukuriimu", ["sorvete"], "Comida", "a + i + su + ku + rii + mu"],
    ["vk_11", "ビール", "biiru", ["cerveja"], "Bebidas", "bii + ru (Beer)"],
    ["vk_12", "ジュース", "juusu", ["suco", "refrigerante"], "Bebidas", "juu + su (Juice)"],
    ["vk_13", "タクシー", "takushii", ["taxi", "táxi"], "Transporte", "ta + ku + shii"],
    ["vk_14", "バス", "basu", ["onibus", "ônibus"], "Transporte", "ba + su (Bus)"],
    ["vk_15", "トイレ", "toire", ["banheiro", "toalete"], "Lugares", "to + i + re"],
    ["vk_16", "アニメ", "anime", ["anime", "animacao", "animação"], "Cultura", "a + ni + me"],
    ["vk_17", "ゲーム", "geemu", ["jogo", "game", "videogame"], "Lazer", "gee + mu"],
    ["vk_18", "サッカー", "sakkaa", ["futebol"], "Esportes", "sa + (tsu pequeno dobra consoante) + kaa"],
    ["vk_19", "ブラジル", "burajiru", ["brasil"], "Países", "bu + ra + ji + ru"],
    ["vk_20", "エネルギー", "enerugii", ["energia"], "Ciência", "e + ne + ru + gii"]
  ],
  kanji: [
    ["vj_1", "日本", "nihon", ["japao", "japão"], "Países", "日 (Sol) + 本 (Origem)"],
    ["vj_2", "先生", "sensei", ["professor", "professora", "mestre"], "Pessoas", "先 (Antes) + 生 (Vida)"],
    ["vj_3", "学生", "gakusei", ["estudante", "aluno", "aluna"], "Pessoas", "学 (Estudo) + 生 (Vida)"],
    ["vj_4", "大学", "daigaku", ["universidade", "faculdade"], "Lugares", "大 (Grande) + 学 (Estudo)"],
    ["vj_5", "火山", "kazan", ["vulcao", "vulcão"], "Natureza", "火 (Fogo) + 山 (Montanha)"],
    ["vj_6", "水曜日", "suiyoubi", ["quarta-feira", "quarta feira", "quarta"], "Tempo", "Dia da Água (水)"],
    ["vj_7", "火曜日", "kayoubi", ["terca-feira", "terça-feira", "terca", "terça"], "Tempo", "Dia do Fogo (火)"],
    ["vj_8", "金曜日", "kinyoubi", ["sexta-feira", "sexta feira", "sexta"], "Tempo", "Dia do Ouro (金)"],
    ["vj_9", "日曜日", "nichiyoubi", ["domingo"], "Tempo", "Dia do Sol (日)"],
    ["vj_10", "月曜日", "getsuyoubi", ["segunda-feira", "segunda feira", "segunda"], "Tempo", "Dia da Lua (月)"],
    ["vj_11", "大人", "otona", ["adulto", "adulta"], "Pessoas", "大 (Grande) + 人 (Pessoa) - Leitura especial"],
    ["vj_12", "一人", "hitori", ["uma pessoa", "sozinho", "sozinha"], "Contagem", "一 (Um) + 人 (Pessoa)"],
    ["vj_13", "二人", "futari", ["duas pessoas", "casal", "dupla"], "Contagem", "二 (Dois) + 人 (Pessoa)"],
    ["vj_14", "今日", "kyou", ["hoje"], "Tempo", "Leitura irregular muito comum"],
    ["vj_15", "山川", "yamakawa", ["montanhas e rios"], "Natureza", "山 (Montanha) + 川 (Rio)"],
    ["vj_16", "青空", "aozora", ["ceu azul", "céu azul"], "Natureza", "Céu (空) aberto"],
    ["vj_17", "食べる", "taberu", ["comer"], "Verbos", "食 (Comer) + べる (Okurigana)"],
    ["vj_18", "飲む", "nomu", ["beber", "tomar"], "Verbos", "飲 (Beber) + む (Okurigana)"],
    ["vj_19", "見る", "miru", ["ver", "olhar", "assistir"], "Verbos", "見 (Ver) + る (Okurigana)"],
    ["vj_20", "行く", "iku", ["ir"], "Verbos", "行 (Ir) + く (Okurigana)"]
  ]
};

// 5. DESCOMPACTADOR EM MEMÓRIA E FUNÇÕES UTILITÁRIAS
const NihongoData = {
  /**
   * Retorna a fila de símbolos de alfabeto conforme os filtros marcados pelo usuário
   */
  getAlphabetPool(options = { hiragana: true, katakana: false, kanji: false, includeDakuten: false, includeYoon: false, kanjiLevels: ["lvl1"] }) {
    const pool = [];
    let rawKana = [...RAW_KANA_GOJUON];
    if (options.includeDakuten) rawKana = rawKana.concat(RAW_KANA_DAKUTEN);
    if (options.includeYoon) rawKana = rawKana.concat(RAW_KANA_YOON);

    if (options.hiragana) {
      rawKana.forEach(([romaji, hira, _, alts]) => {
        const id = `h_${romaji}`;
        pool.push({
          id,
          symbol: hira,
          romaji,
          acceptedRomaji: [romaji, ...alts],
          type: "hiragana",
          meaning: null,
          hint: CONFUSING_HINTS[id] || `Hiragana para a sílaba "${romaji.toUpperCase()}".`
        });
      });
    }

    if (options.katakana) {
      rawKana.forEach(([romaji, _, kata, alts]) => {
        const id = `k_${romaji}`;
        pool.push({
          id,
          symbol: kata,
          romaji,
          acceptedRomaji: [romaji, ...alts],
          type: "katakana",
          meaning: null,
          hint: CONFUSING_HINTS[id] || `Katakana para a sílaba "${romaji.toUpperCase()}".`
        });
      });
    }

    if (options.kanji && options.kanjiLevels && options.kanjiLevels.length > 0) {
      options.kanjiLevels.forEach(lvlKey => {
        const lvl = RAW_KANJI_LEVELS[lvlKey];
        if (lvl) {
          lvl.items.forEach(([id, char, romaji, alts, meaning, hint]) => {
            pool.push({
              id,
              symbol: char,
              romaji,
              acceptedRomaji: alts,
              type: "kanji",
              meaning,
              hint: `${meaning} (${alts.join(" / ")}) — ${hint}`
            });
          });
        }
      });
    }

    return pool;
  },

  /**
   * Retorna a lista de vocabulários para o sistema de escrita escolhido
   */
  getVocabularyPool(scriptType = "hiragana") {
    const list = RAW_VOCABULARY[scriptType] || RAW_VOCABULARY.hiragana;
    return list.map(([id, word, romaji, meanings, category, hint]) => ({
      id,
      word,
      romaji,
      meanings,
      primaryMeaning: meanings[0].charAt(0).toUpperCase() + meanings[0].slice(1),
      category,
      scriptType,
      hint
    }));
  },

  /**
   * Normaliza texto em português/romaji removendo acentos, espaços extras e caixa alta
   */
  normalizeText(str) {
    if (!str) return "";
    return str
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim();
  },

  /**
   * Valida se o significado digitado em português bate com algum dos aceitos
   */
  checkPortugueseMeaning(userInput, acceptedMeanings) {
    const cleanInput = this.normalizeText(userInput);
    if (!cleanInput) return false;
    return acceptedMeanings.some(m => this.normalizeText(m) === cleanInput);
  },

  /**
   * Pronuncia qualquer caractere ou palavra japonesa usando a Web Speech API nativa (0 bytes de áudio!)
   */
  speakJapanese(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.88; // Ligeiramente mais pausado para facilitar o aprendizado
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Áudio não suportado neste dispositivo:", e);
    }
  }
};

window.RAW_KANJI_LEVELS = RAW_KANJI_LEVELS;
window.NihongoData = NihongoData;
