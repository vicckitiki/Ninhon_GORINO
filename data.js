/**
 * NIHONGO DUO - data.js (Versão Completa com Trilha Genki I - Lições 1 a 12 + JLPT N5-N1)
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
  ["cha","ちゃ","チャ",["tya","cya"]], ["chu","ちゅ","チュ",["tyu","cyu"]], ["cho","ちょ","チョ",["tyo","cyo"]],
  ["nya","にゃ","ニャ",[]], ["nyu","にゅ","ニュ",[]], ["nyo","にょ","ニョ",[]],
  ["hya","ひゃ","ヒャ",[]], ["hyu","ひゅ","ヒュ",[]], ["hyo","ひょ","ヒョ",[]],
  ["mya","みゃ","ミャ",[]], ["myu","みゅ","ミュ",[]], ["myo","みょ","ミョ",[]],
  ["rya","りゃ","リャ",[]], ["ryu","りゅ","リュ",[]], ["ryo","りょ","リョ",[]],
  ["gya","ぎゃ","ギャ",[]], ["gyu","ぎゅ","ギュ",[]], ["gyo","ぎょ","ギョ",[]],
  ["ja","じゃ","ジャ",["jya","zya"]], ["ju","じゅ","ジュ",["jyu","zyu"]], ["jo","じょ","ジョ",["jyo","zyo"]],
  ["bya","びゃ","ビャ",[]], ["byu","びゅ","ビュ",[]], ["byo","びょ","ビョ",[]],
  ["pya","ぴゃ","ピャ",[]], ["pyu","ぴゅ","ピュ",[]], ["pyo","ぴょ","ピョ",[]]
];

// 2. KANJI POR PROFICIÊNCIA JLPT (N5 ao N1)
const RAW_KANJI_LEVELS = {
  "n5": {
    name: "JLPT N5 — Iniciante (~100 Kanjis essenciais)",
    items: [
      ["k_一", "一", "ichi", ["ichi", "hito"], "Um", "JLPT N5 • Traço único horizontal."],
      ["k_二", "二", "ni", ["ni", "futa"], "Dois", "JLPT N5 • Dois traços paralelos."],
      ["k_三", "三", "san", ["san", "mi"], "Três", "JLPT N5 • Três traços horizontais."],
      ["k_四", "四", "yon", ["yon", "shi", "yo"], "Quatro", "JLPT N5 • Janela com 4 cantos."],
      ["k_五", "五", "go", ["go", "itsu"], "Cinco", "JLPT N5 • Equilíbrio entre céu e terra."],
      ["k_六", "六", "roku", ["roku", "mu"], "Seis", "JLPT N5 • Topo com duas pernas."],
      ["k_七", "七", "nana", ["nana", "shichi"], "Sete", "JLPT N5 • Corte transversal."],
      ["k_八", "八", "hachi", ["hachi", "ya"], "Oito", "JLPT N5 • Dois traços que se abrem."],
      ["k_九", "九", "kyuu", ["kyuu", "ku", "kokono"], "Nove", "JLPT N5 • Braço flexionado."],
      ["k_十", "十", "juu", ["juu", "too"], "Dez", "JLPT N5 • Cruz completa."],
      ["k_百", "百", "hyaku", ["hyaku", "momo"], "Cem", "JLPT N5 • Um (一) sobre branco (白)."],
      ["k_千", "千", "sen", ["sen", "chi"], "Mil", "JLPT N5 • Dez (十) com um traço no topo."],
      ["k_万", "万", "man", ["man", "ban"], "Dez Mil", "JLPT N5 • Base das grandes contagens."],
      ["k_円", "円", "en", ["en", "maru"], "Iene / Círculo", "JLPT N5 • Moeda japonesa."],
      ["k_日", "日", "nichi", ["hi", "bi", "nichi", "jitsu"], "Sol / Dia", "JLPT N5 • Contorno solar."],
      ["k_月", "月", "getsu", ["tsuki", "getsu", "gatsu"], "Lua / Mês", "JLPT N5 • Lua crescente."],
      ["k_火", "火", "ka", ["hi", "ka"], "Fogo", "JLPT N5 • Chamas subindo."],
      ["k_水", "水", "sui", ["mizu", "sui"], "Água", "JLPT N5 • Correnteza de rio."],
      ["k_木", "木", "moku", ["ki", "moku", "boku"], "Árvore / Madeira", "JLPT N5 • Tronco, copa e raízes."],
      ["k_金", "金", "kin", ["kane", "kin", "kon"], "Ouro / Dinheiro", "JLPT N5 • Metal sob o solo."],
      ["k_土", "土", "do", ["tsuchi", "do", "to"], "Terra / Solo", "JLPT N5 • Broto saindo do chão."],
      ["k_山", "山", "san", ["yama", "san"], "Montanha", "JLPT N5 • Três picos."],
      ["k_川", "川", "sen", ["kawa", "sen"], "Rio", "JLPT N5 • Três fluxos de água."],
      ["k_空", "空", "kuu", ["sora", "kuu", "a"], "Céu / Vazio", "JLPT N5 • Espaço aberto."],
      ["k_人", "人", "jin", ["hito", "jin", "nin"], "Pessoa", "JLPT N5 • Duas pernas caminhando."],
      ["k_子", "子", "shi", ["ko", "shi", "su"], "Criança / Filho", "JLPT N5 • Bebê de braços abertos."],
      ["k_女", "女", "jo", ["onna", "jo", "nyo"], "Mulher", "JLPT N5 • Postura elegante."],
      ["k_男", "男", "dan", ["otoko", "dan", "nan"], "Homem", "JLPT N5 • Força (力) no campo de arroz (田)."],
      ["k_目", "目", "moku", ["me", "moku"], "Olho", "JLPT N5 • Pupila na vertical."],
      ["k_口", "口", "kou", ["kuchi", "kou"], "Boca", "JLPT N5 • Abertura da boca."],
      ["k_耳", "耳", "ji", ["mimi", "ji"], "Orelha", "JLPT N5 • Desenho da orelha."],
      ["k_手", "手", "shu", ["te", "shu"], "Mão", "JLPT N5 • Palma e dedos."],
      ["k_足", "足", "soku", ["ashi", "soku", "ta"], "Pé / Perna", "JLPT N5 • Joelho e pé."],
      ["k_大", "大", "dai", ["oo", "dai", "tai"], "Grande", "JLPT N5 • Braços abertos."],
      ["k_小", "小", "shou", ["chii", "ko", "shou"], "Pequeno", "JLPT N5 • Dividido em partes pequenas."],
      ["k_上", "上", "jou", ["ue", "jou", "a"], "Cima / Subir", "JLPT N5 • Acima da linha."],
      ["k_下", "下", "ka", ["shita", "ka", "ge", "sa"], "Baixo / Descer", "JLPT N5 • Abaixo da linha."],
      ["k_中", "中", "chuu", ["naka", "chuu"], "Meio / Dentro", "JLPT N5 • Corte no centro."],
      ["k_本", "本", "hon", ["hon", "moto"], "Livro / Origem", "JLPT N5 • Raiz da árvore."],
      ["k_学", "学", "gaku", ["mana", "gaku"], "Estudo / Escola", "JLPT N5 • Criança sob o teto."],
      ["k_生", "生", "sei", ["i", "nama", "sei", "shou", "u"], "Vida / Nascer", "JLPT N5 • Planta brotando."],
      ["k_先", "先", "sen", ["saki", "sen"], "Anterior / Futuro", "JLPT N5 • Quem vai à frente."],
      ["k_行", "行", "kou", ["i", "yu", "kou", "gyou"], "Ir / Linha", "JLPT N5 • Cruzamento."],
      ["k_来", "来", "rai", ["ku", "ki", "rai"], "Vir / Próximo", "JLPT N5 • Colheita que vem."],
      ["k_食", "食", "shoku", ["ta", "shoku"], "Comer / Alimento", "JLPT N5 • Refeição sob o teto."],
      ["k_飲", "飲", "in", ["no", "in"], "Beber", "JLPT N5 • Ingerir líquidos."],
      ["k_見", "見", "ken", ["mi", "ken"], "Ver / Olhar", "JLPT N5 • Olho sobre pernas."],
      ["k_聞", "聞", "bun", ["ki", "bun", "mon"], "Ouvir / Perguntar", "JLPT N5 • Orelha no portão."]
    ]
  },
  "n4": {
    name: "JLPT N4 — Básico (~180 Kanjis do cotidiano)",
    items: [
      ["k_会", "会", "kai", ["a", "kai", "e"], "Encontrar / Reunião", "JLPT N4 • Pessoas reunidas sob um teto."],
      ["k_社", "社", "sha", ["yashiro", "sha"], "Empresa / Santuário", "JLPT N4 • Altar comunitário."],
      ["k_店", "店", "ten", ["mise", "ten"], "Loja / Estabelecimento", "JLPT N4 • Comércio sob telhado."],
      ["k_駅", "駅", "eki", ["eki"], "Estação de Trem", "JLPT N4 • Ponto de parada de cavalos/trens."],
      ["k_道", "道", "dou", ["michi", "dou", "tou"], "Caminho / Estrada", "JLPT N4 • Seguir a direção."],
      ["k_住", "住", "juu", ["su", "juu"], "Morar / Residir", "JLPT N4 • Pessoa fixada num local."],
      ["k_所", "所", "sho", ["tokoro", "sho", "jo"], "Lugar / Local", "JLPT N4 • Porta e machado."],
      ["k_町", "町", "chou", ["machi", "chou"], "Cidade / Bairro", "JLPT N4 • Campos e ruas."],
      ["k_歩", "歩", "ho", ["aru", "ayumu", "ho", "bu"], "Caminhar / Passo", "JLPT N4 • Parar pouco a pouco."],
      ["k_走", "走", "sou", ["hashi", "sou"], "Correr", "JLPT N4 • Movimentar os pés rápido."],
      ["k_待", "待", "tai", ["ma", "tai"], "Esperar", "JLPT N4 • Aguardar na rua/templo."],
      ["k_持", "持", "ji", ["mo", "ji"], "Segurar / Ter", "JLPT N4 • Mão (扌) junto ao templo (寺)."],
      ["k_思", "思", "shi", ["omo", "shi"], "Pensar / Achar", "JLPT N4 • Mente/campo (田) e coração (心)."],
      ["k_知", "知", "chi", ["shi", "chi"], "Saber / Conhecimento", "JLPT N4 • Flecha certeira da fala."],
      ["k_作", "作", "saku", ["tsuku", "saku", "sa"], "Fazer / Criar / Obra", "JLPT N4 • Pessoa construindo."],
      ["k_使", "使", "shi", ["tsuka", "shi"], "Usar / Utilizar", "JLPT N4 • Pessoa em missão oficial."],
      ["k_働", "働", "dou", ["hatara", "dou"], "Trabalhar", "JLPT N4 • Pessoa (亻) em movimento (動)."],
      ["k_動", "動", "dou", ["ugo", "dou"], "Mover / Movimento", "JLPT N4 • Pesado (重) + Força (力)."],
      ["k_強", "強", "kyou", ["tsuyo", "kyou", "gou"], "Forte / Estudar", "JLPT N4 • Arco tensionado."],
      ["k_弱", "弱", "jaku", ["yowa", "jaku"], "Fraco / Frágil", "JLPT N4 • Arcos delicados."],
      ["k_明", "明", "mei", ["aka", "aki", "mei", "myou"], "Brilhante / Claro", "JLPT N4 • Sol (日) + Lua (月)."],
      ["k_暗", "暗", "an", ["kura", "an"], "Escuro", "JLPT N4 • Sol encoberto."],
      ["k_広", "広", "kou", ["hiro", "kou"], "Amplo / Espaçoso", "JLPT N4 • Espaço aberto sob abrigo."],
      ["k_早", "早", "sou", ["haya", "sou", "sa"], "Cedo / Rápido", "JLPT N4 • Sol nascendo no horizonte."],
      ["k_親", "親", "shin", ["oya", "shita", "shin"], "Pais / Íntimo", "JLPT N4 • Ver (見) de perto a árvore."],
      ["k_兄", "兄", "kei", ["ani", "kei", "kyou"], "Irmão Mais Velho", "JLPT N4 • Quem fala à frente."],
      ["k_姉", "姉", "shi", ["ane", "shi"], "Irmã Mais Velha", "JLPT N4 • Mulher (女) no mercado (市)."],
      ["k_弟", "弟", "tei", ["otouto", "tei", "dai"], "Irmão Mais Novo", "JLPT N4 • Ordem de sucessão."],
      ["k_妹", "妹", "mai", ["imouto", "mai"], "Irmã Mais Nova", "JLPT N4 • Mulher (女) ainda jovem (未)."],
      ["k_医", "医", "i", ["i"], "Medicina / Médico", "JLPT N4 • Cuidado e cura."]
    ]
  },
  "n3": {
    name: "JLPT N3 — Intermediário (~370 Kanjis de leitura fluida)",
    items: [
      ["k_政", "政", "sei", ["matsurigoto", "sei", "shou"], "Política / Governo", "JLPT N3 • Correto (正) + Ação."],
      ["k_経", "経", "kei", ["he", "ta", "kei", "kyou"], "Economia / Passar", "JLPT N3 • Fios que conduzem o tempo."],
      ["k_済", "済", "sai", ["su", "sai", "sei"], "Concluir / Finanças", "JLPT N3 • Atravessar o rio."],
      ["k_守", "守", "shu", ["mamo", "mori", "shu", "su"], "Proteger / Defender", "JLPT N3 • Mão/lei sob um teto."],
      ["k_決", "決", "ketsu", ["ki", "ketsu"], "Decidir / Resolver", "JLPT N3 • Fluxo de água que rompe."],
      ["k_定", "定", "tei", ["sada", "tei", "jou"], "Fixar / Determinar", "JLPT N3 • Ordem sob o teto."],
      ["k_実", "実", "jitsu", ["mi", "mino", "jitsu"], "Realidade / Fruto", "JLPT N3 • Plenitude em casa."],
      ["k_現", "現", "gen", ["arawa", "gen"], "Presente / Aparecer", "JLPT N3 • Joia que se revela à vista."],
      ["k_調", "調", "chou", ["shira", "totono", "chou"], "Investigar / Tom", "JLPT N3 • Palavras (言) completas (周)."],
      ["k_和", "和", "wa", ["yawa", "nago", "wa", "o"], "Harmonia / Paz / Japão", "JLPT N3 • Cereal (禾) na boca (口)."],
      ["k_平", "平", "hei", ["tai", "hira", "hei", "byou"], "Plano / Paz / Igual", "JLPT N3 • Balança equilibrada."],
      ["k_成", "成", "sei", ["na", "sei", "jou"], "Tornar-se / Alcançar", "JLPT N3 • Realizar com firmeza."],
      ["k_果", "果", "ka", ["ha", "ka"], "Fruto / Resultado", "JLPT N3 • Fruto no topo da árvore (木)."],
      ["k_感", "感", "kan", ["kan"], "Sentimento / Emoção", "JLPT N3 • Aquilo que toca o coração (心)."],
      ["k_情", "情", "jou", ["nasa", "jou", "sei"], "Emoção / Compaixão", "JLPT N3 • Coração (忄) puro (青)."],
      ["k_想", "想", "sou", ["omo", "sou", "so"], "Conceito / Imaginar", "JLPT N3 • Observar (相) com o coração (心)."],
      ["k_必", "必", "hitsu", ["kanara", "hitsu"], "Certamente / Necessário", "JLPT N3 • Coração atravessado por firmeza."],
      ["k_要", "要", "you", ["i", "you"], "Necessitar / Essencial", "JLPT N3 • Ponto central."],
      ["k_増", "増", "zou", ["ma", "fu", "zou"], "Aumentar / Multiplicar", "JLPT N3 • Acumular camadas de terra."],
      ["k_減", "減", "gen", ["he", "gen"], "Diminuir / Reduzir", "JLPT N3 • Nível de água baixando."],
      ["k_続", "続", "zoku", ["tsuzu", "zoku"], "Continuar / Prosseguir", "JLPT N3 • Fio contínuo."],
      ["k_変", "変", "hen", ["ka", "hen"], "Mudar / Estranho", "JLPT N3 • Transformação em movimento."],
      ["k_信", "信", "shin", ["shin"], "Acreditar / Confiança", "JLPT N3 • Pessoa (亻) e sua palavra (言)."],
      ["k_連", "連", "ren", ["tsura", "tsu", "ren"], "Conectar / Levar consigo", "JLPT N3 • Veículos em fila na estrada."]
    ]
  },
  "n2": {
    name: "JLPT N2 — Avançado (~380 Kanjis técnicos e jornais)",
    items: [
      ["k_圧", "圧", "atsu", ["atsu", "o"], "Pressão / Comprimir", "JLPT N2 • Terra sob força de penhasco."],
      ["k_電", "電", "den", ["den"], "Eletricidade", "JLPT N2 • Chuva/nuvem (雨) com raio."],
      ["k_流", "流", "ryuu", ["naga", "ryuu", "ru"], "Corrente / Fluxo", "JLPT N2 • Fluido em movimento."],
      ["k_制", "制", "sei", ["sei"], "Controle / Sistema", "JLPT N2 • Aparar e regular."],
      ["k_御", "御", "gyo", ["on", "o", "gyo", "go"], "Controlar / Honorífico", "JLPT N2 • Comandar (ex: 制御 Seigyo = Controle)."],
      ["k_構", "構", "kou", ["kama", "kou"], "Estrutura / Construir", "JLPT N2 • Madeira entrelaçada."],
      ["k_造", "造", "zou", ["tsuku", "zou"], "Fabricar / Construir", "JLPT N2 • Produzir e avançar."],
      ["k_設", "設", "setsu", ["mou", "setsu"], "Estabelecer / Projetar", "JLPT N2 • Planejar com palavras e ferramenta."],
      ["k_備", "備", "bi", ["sona", "bi"], "Equipar / Preparar", "JLPT N2 • Deixar pronto para uso."],
      ["k_測", "測", "soku", ["haka", "soku"], "Medir / Mensurar", "JLPT N2 • Medir profundidade da água."],
      ["k_量", "量", "ryou", ["haka", "ryou"], "Quantidade / Medida", "JLPT N2 • Peso e grandeza."],
      ["k_効", "効", "kou", ["ki", "kou"], "Eficácia / Efeito", "JLPT N2 • Cruzar forças (力)."],
      ["k_率", "率", "ritsu", ["hiki", "ritsu", "sotsu"], "Taxa / Rendimento", "JLPT N2 • Proporção ou eficiência (効率)."],
      ["k_蓄", "蓄", "chiku", ["takuwa", "chiku"], "Armazenar / Acumular", "JLPT N2 • Guardar energia/recursos."],
      ["k_乾", "乾", "kan", ["kawa", "kan"], "Seco / Secar", "JLPT N2 • Vapor subindo ao sol."],
      ["k_燥", "燥", "sou", ["hasha", "sou"], "Ressecar / Árido", "JLPT N2 • Fogo (火) secando madeira."],
      ["k_複", "複", "fuku", ["fuku"], "Múltiplo / Complexo", "JLPT N2 • Camadas dobradas."],
      ["k_雑", "雑", "zatsu", ["zatsu", "zou"], "Diversos / Complexo", "JLPT N2 • Mistura variada."],
      ["k_較", "較", "kaku", ["kura", "kaku", "kou"], "Comparar", "JLPT N2 • Alinhar carruagens."],
      ["k_検", "検", "ken", ["ken"], "Inspeção / Exame", "JLPT N2 • Verificar minuciosamente."]
    ]
  },
  "n1": {
    name: "JLPT N1 — Fluência Total (Até os +2.136 Jōyō Kanjis)",
    items: [
      ["k_憲", "憲", "ken", ["ken"], "Constituição / Lei Suprema", "JLPT N1 • Lei que rege a mente e o Estado."],
      ["k_覇", "覇", "ha", ["ha", "hata"], "Hegemonia / Supremacia", "JLPT N1 • Domínio absoluto."],
      ["k_顕", "顕", "ken", ["aki", "arawa", "ken"], "Manifesto / Evidente", "JLPT N1 • Fios visíveis à luz do sol."],
      ["k_微", "微", "bi", ["kasu", "bi"], "Minúsculo / Micro / Sutil", "JLPT N1 • Cálculo diferencial (微分)."],
      ["k_積", "積", "seki", ["tsu", "seki"], "Acumular / Produto / Integral", "JLPT N1 • Cálculo integral (積分)."],
      ["k_磁", "磁", "ji", ["ji"], "Magnetismo / Ímã", "JLPT N1 • Pedra (石) magnética (磁気)."],
      ["k_誘", "誘", "yuu", ["saso", "yuu"], "Induzir / Convidar", "JLPT N1 • Indução eletromagnética (誘導)."],
      ["k_導", "導", "dou", ["michibi", "dou"], "Conduzir / Guiar", "JLPT N1 • Semicondutor (半導体)."],
      ["k_絶", "絶", "zetsu", ["ta", "zetsu"], "Isolar / Cortar", "JLPT N1 • Isolamento (絶縁)."],
      ["k_縁", "縁", "en", ["fuchi", "yukari", "en"], "Vínculo / Borda", "JLPT N1 • Fio que contorna."],
      ["k_振", "振", "shin", ["fu", "shin"], "Oscilar / Vibrar", "JLPT N1 • Oscilação/Frequência (振動)."],
      ["k_幅", "幅", "fuku", ["haba", "fuku"], "Largura / Amplitude", "JLPT N1 • Amplitude de onda (振幅)."],
      ["k_周", "周", "shuu", ["mawa", "shuu"], "Perímetro / Ciclo", "JLPT N1 • Frequência (周波数)."],
      ["k_波", "波", "ha", ["nami", "ha"], "Onda", "JLPT N1 • Forma de onda (波形)."],
      ["k_整", "整", "sei", ["totono", "sei"], "Ajustar / Retificar", "JLPT N1 • Retificador (整流器)."],
      ["k_換", "換", "kan", ["ka", "kan"], "Converter / Trocar", "JLPT N1 • Conversor (変換器)."],
      ["k_冗", "冗", "jou", ["jou"], "Redundância / Supérfluo", "JLPT N1 • Redundância de sistema (冗長性)."],
      ["k_瞬", "瞬", "shun", ["matata", "shun"], "Instante / Transitório", "JLPT N1 • Valor instantâneo (瞬時値)."],
      ["k_穏", "穏", "on", ["oda", "on"], "Calmo / Estável", "JLPT N1 • Estado estacionário/calmo."],
      ["k_粋", "粋", "sui", ["iki", "sui"], "Essência / Puro", "JLPT N1 • Refinamento puro."]
    ]
  }
};

// 3. PARES CONFUSOS & DICAS AUTOMÁTICAS DE MELHORIA
const CONFUSING_HINTS = {
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
  "k_shi": "Clássico do Katakana! 'シ (shi)' alinha os traços na vertical (olha de lado para cima). 'ツ (tsu)' alinha na horizontal (olha de cima para baixo).",
  "k_tsu": "Clássico do Katakana! 'ツ (tsu)' tem os dois tracinhos alinhados no topo horizontal e desce da direita pra esquerda.",
  "k_so": "Cuidado! 'ソ (so)' alinha no topo e desce de cima; 'ン (n)' alinha na esquerda e sobe de baixo.",
  "k_n": "Cuidado! 'ン (n)' tem o traço começando embaixo e subindo (como o シ). Já 'ソ (so)' desce do topo.",
  "k_ku": "Diferença sutil: 'ク (ku)' não tem traço cortando no meio, já 'タ (ta)' tem um tracinho interno!",
  "k_ta": "Diferença sutil: 'タ (ta)' parece 'ク (ku)', mas possui um traço extra no meio.",
  "k_ko": "Não confunda: 'コ (ko)' tem 3 lados fechando na direita; 'ユ (yu)' estica a base inferior.",
  "k_ma": "Pares Katakana: 'マ (ma)' aponta para baixo; 'ム (mu)' forma um triângulo na base."
};

// 4. VOCABULÁRIO GERAL ESTRUTURADO POR SISTEMA DE ESCRITA
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

// 5. TRILHA GENKI I (3ª Edição) — LIÇÕES 1 A 12 (GRAMÁTICA, PARTÍCULAS & VOCABULÁRIO)
const GENKI_LESSONS = {
  "L1": {
    id: "L1",
    title: "Lição 1: Novos Amigos (あたらしいともだち)",
    subtitle: "Apresentações, X は Y です, Perguntas com か e Partícula の",
    grammar: [
      {
        rule: "1. X は Y です (X é Y)",
        explanation: "A partícula は (pronunciada 'wa') marca o tópico da frase. です (desu) funciona como o verbo 'ser/estar' no presente educado.",
        exampleJp: "わたしはがくせいです。",
        exampleRomaji: "Watashi wa gakusei desu.",
        examplePt: "Eu sou estudante."
      },
      {
        rule: "2. Frases Interrogativas com か (ka)",
        explanation: "Para transformar qualquer afirmação em pergunta, basta adicionar a partícula か no final da frase com entonação crescente.",
        exampleJp: "せんこうはなんですか。",
        exampleRomaji: "Senkou wa nan desu ka.",
        examplePt: "Qual é a sua área de estudo/curso?"
      },
      {
        rule: "3. Noun1 の Noun2 (Posse / Modificação)",
        explanation: "A partícula の (no) conecta dois substantivos indicando posse ou vínculo (como o 'de' em português, mas na ordem inversa: Possuidor の Objeto).",
        exampleJp: "たけしさんのでんわばんごう",
        exampleRomaji: "Takeshi-san no denwa bangou",
        examplePt: "O número de telefone do Takeshi"
      }
    ],
    vocab: [
      ["g1_v1", "だいがく", "daigaku", ["universidade", "faculdade"], "Genki L1", "Substantivo"],
      ["g1_v2", "がくせい", "gakusei", ["estudante", "aluno"], "Genki L1", "Substantivo"],
      ["g1_v3", "せんせい", "sensei", ["professor", "professora"], "Genki L1", "Substantivo"],
      ["g1_v4", "せんこう", "senkou", ["especialidade", "curso", "area"], "Genki L1", "Substantivo"],
      ["g1_v5", "ともだち", "tomodachi", ["amigo", "amiga"], "Genki L1", "Substantivo"],
      ["g1_v6", "にほんご", "nihongo", ["idioma japones", "japones", "língua japonesa"], "Genki L1", "Substantivo"]
    ],
    questions: [
      {
        id: "g1_q1",
        sentence: "わたし [ ___ ] がくせいです。",
        translation: "Eu sou estudante.",
        options: ["は", "の", "を", "か"],
        answer: "は",
        audioText: "わたしはがくせいです。",
        explanation: "Usamos a partícula は (wa) para marcar o tópico ('Quanto a mim, sou estudante')."
      },
      {
        id: "g1_q2",
        sentence: "メアリーさんはにほんご [ ___ ] がくせいです。",
        translation: "A Mary é estudante de língua japonesa.",
        options: ["の", "は", "に", "で"],
        answer: "の",
        audioText: "メアリーさんはにほんごのがくせいです。",
        explanation: "A partícula の conecta dois substantivos especificando o tipo ('estudante DE japonês')."
      },
      {
        id: "g1_q3",
        sentence: "いまなんじです [ ___ ]。",
        translation: "Que horas são agora?",
        options: ["か", "は", "の", "も"],
        answer: "か",
        audioText: "いまなんじですか。",
        explanation: "A partícula か no final transforma a frase numa pergunta."
      },
      {
        id: "g1_q4",
        sentence: "たけしさんはだいがくせい [ ___ ]。",
        translation: "O Takeshi é universitário.",
        options: ["です", "ます", "か", "の"],
        answer: "です",
        audioText: "たけしさんはだいがくせいです。",
        explanation: "Substantivos no presente afirmativo formal terminam com です (desu)."
      }
    ]
  },

  "L2": {
    id: "L2",
    title: "Lição 2: Compras (かいもの)",
    subtitle: "これ / それ / あれ, Конo / その, Partícula も e Negativa じゃないです",
    grammar: [
      {
        rule: "1. これ / それ / あれ / どれ (Pronomes Demonstrativos)",
        explanation: "これ (isto - perto de mim), それ (isso - perto de você), あれ (aquilo - longe de ambos) e どれ (qual deles?). Funcionam sozinhos como substantivos.",
        exampleJp: "これはいくらですか。",
        exampleRomaji: "Kore wa ikura desu ka.",
        examplePt: "Quanto custa isto?"
      },
      {
        rule: "2. この / その / あの / どの + Substantivo",
        explanation: "Quando queremos acompanhar um substantivo diretamente, usamos この (este), その (esse), あの (aquele) ou どの (qual).",
        exampleJp: "このとけいはさんぜんえんです。",
        exampleRomaji: "Kono tokei wa sanzen-en desu.",
        examplePt: "Este relógio custa 3.000 ienes."
      },
      {
        rule: "3. Partícula も (Também) e Negativa じゃないです",
        explanation: "A partícula も substitui は quando queremos dizer 'X também é Y'. Para negar um substantivo ('não é'), usamos じゃないです (ou じゃありません).",
        exampleJp: "わたしもうなぎが好きです。やさいじゃないです。",
        exampleRomaji: "Watashi mo unagi ga suki desu. Yasai janai desu.",
        examplePt: "Eu também gosto de enguia. Não é verdura."
      }
    ],
    vocab: [
      ["g2_v1", "これ", "kore", ["isto", "este"], "Genki L2", "Demonstrativo"],
      ["g2_v2", "それ", "sore", ["isso", "esse"], "Genki L2", "Demonstrativo"],
      ["g2_v3", "あれ", "are", ["aquilo", "aquele"], "Genki L2", "Demonstrativo"],
      ["g2_v4", "かばん", "kaban", ["bolsa", "mochila", "pasta"], "Genki L2", "Objetos"],
      ["g2_v5", "かさ", "kasa", ["guarda-chuva", "guarda chuva"], "Genki L2", "Objetos"],
      ["g2_v6", "ぎんこう", "ginkou", ["banco"], "Genki L2", "Lugares"]
    ],
    questions: [
      {
        id: "g2_q1",
        sentence: "[ ___ ] かさはわたしのです。",
        translation: "Este guarda-chuva é meu.",
        options: ["この", "これ", "それ", "どれ"],
        answer: "この",
        audioText: "このかさはわたしのです。",
        explanation: "Antes de um substantivo (かさ), é obrigatório usar この / その / あの, e nunca これ / それ."
      },
      {
        id: "g2_q2",
        sentence: "たけしさんはにほんじんです。みちこさん [ ___ ] にほんじんです。",
        translation: "Takeshi é japonês. Michiko também é japonesa.",
        options: ["も", "は", "の", "を"],
        answer: "も",
        audioText: "たけしさんはにほんじんです。みちこさんもにほんじんです。",
        explanation: "A partícula も indica 'também' (Michiko também)."
      },
      {
        id: "g2_q3",
        sentence: "これはにく [ ___ ]。",
        translation: "Isto não é carne.",
        options: ["じゃないです", "ません", "ないです", "ですか"],
        answer: "じゃないです",
        audioText: "これはにくじゃないです。",
        explanation: "Para negar um substantivo (にく = carne), usamos じゃないです."
      },
      {
        id: "g2_q4",
        sentence: "[ ___ ] はいくらですか。",
        translation: "Quanto custa isto?",
        options: ["これ", "この", "その", "どの"],
        answer: "これ",
        audioText: "これはいくらですか。",
        explanation: "Sem substantivo logo após, usamos o pronome independente これ."
      }
    ]
  },

  "L3": {
    id: "L3",
    title: "Lição 3: Marcando um Encontro (デートのやくそく)",
    subtitle: "Verbos (~ます / ~ません), Partículas を, で, に, へ e Convites (~ませんか)",
    grammar: [
      {
        rule: "1. Conjugação de Verbos no Presente/Futuro (~ます / ~ません)",
        explanation: "Verbos na forma educada terminam em ます (afirmativo) e ません (negativo). Eles expressam tanto ações habituais quanto ações no futuro!",
        exampleJp: "まいにちテレビをみます。",
        exampleRomaji: "Mainichi terebi wo mimasu.",
        examplePt: "Eu assisto TV todos os dias."
      },
      {
        rule: "2. Partículas Essenciais de Ação: を, で, に, へ",
        explanation: "• を (o): Objeto direto (o que é comido/lido).\n• で (de): Local onde a ação acontece.\n• に (ni): Tempo específico (ex: 7h) ou destino de movimento.\n• へ (e): Direção de movimento (ir/vir/voltar).",
        exampleJp: "としょかんでほんをよみます。",
        exampleRomaji: "Toshokan de hon wo yomimasu.",
        examplePt: "Leio um livro na biblioteca."
      },
      {
        rule: "3. Fazendo Convites: ~ませんか",
        explanation: "Usar o verbo negativo interrogativo (~ませんか) é a forma padrão e educada de convidar alguém ('Você não gostaria de...?').",
        exampleJp: "いっしょにひるごはんをたべませんか。",
        exampleRomaji: "Issho ni hirugohan wo tabemasen ka.",
        examplePt: "Vamos almoçar juntos?"
      }
    ],
    vocab: [
      ["g3_v1", "いく", "iku", ["ir"], "Genki L3", "Verbo U"],
      ["g3_v2", "かえる", "kaeru", ["voltar", "ir para casa"], "Genki L3", "Verbo U (Exceção!)"],
      ["g3_v3", "きく", "kiku", ["ouvir", "escutar"], "Genki L3", "Verbo U"],
      ["g3_v4", "よむ", "yomu", ["ler"], "Genki L3", "Verbo U"],
      ["g3_v5", "おきる", "okiru", ["acordar", "levantar"], "Genki L3", "Verbo Ru"],
      ["g3_v6", "としょかん", "toshokan", ["biblioteca"], "Genki L3", "Lugares"]
    ],
    questions: [
      {
        id: "g3_q1",
        sentence: "まいあさコーヒー [ ___ ] のみます。",
        translation: "Bebo café todas as manhãs.",
        options: ["を", "に", "で", "は"],
        answer: "を",
        audioText: "まいあさコーヒーをのみます。",
        explanation: "A partícula を marca o objeto direto do verbo のみます (beber)."
      },
      {
        id: "g3_q2",
        sentence: "としょかん [ ___ ] べんきょうします。",
        translation: "Estudo na biblioteca.",
        options: ["で", "に", "を", "へ"],
        answer: "で",
        audioText: "としょかんでべんきょうします。",
        explanation: "O local onde ocorre uma ação dinâmica (estudar, comer, trabalhar) é marcado por で."
      },
      {
        id: "g3_q3",
        sentence: "あしたきょうと [ ___ ] いきます。",
        translation: "Amanhã vou para Quioto.",
        options: ["に", "を", "で", "の"],
        answer: "に",
        audioText: "あしたきょうとにいきます。",
        explanation: "O destino de verbos de deslocamento (いく, くる, かえる) é marcado por に (ou へ)."
      },
      {
        id: "g3_q4",
        sentence: "こんばんえいがを [ ___ ]。",
        translation: "Que tal assistirmos a um filme hoje à noite? (Convite)",
        options: ["みませんか", "みます", "みません", "みるです"],
        answer: "みませんか",
        audioText: "こんばんえいがをみませんか。",
        explanation: "A terminação ~ませんか faz um convite educado ('Você não quer ver?')."
      }
    ]
  },

  "L4": {
    id: "L4",
    title: "Lição 4: O Primeiro Encontro (はじめてのデート)",
    subtitle: "Existência (あります / います), Passado (~ました / ~ませんでした) e Partícula と",
    grammar: [
      {
        rule: "1. X が あります / います (Existir / Ter)",
        explanation: "• あります (arimasu): usado para objetos inanimados, plantas e eventos.\n• います (imasu): usado para pessoas e animais (seres que se movem por vontade própria).\nO local onde algo está é marcado com に.",
        exampleJp: "あそこにマクドナルドがあります。",
        exampleRomaji: "Asoko ni Makudonarudo ga arimasu.",
        examplePt: "Há um McDonald's logo ali."
      },
      {
        rule: "2. Passado de Verbos (~ました / ~ませんでした)",
        explanation: "Para colocar verbos no passado formal: ます vira ました (afirmativo) e ません vira ませんでした (negativo). Para substantivos: でした / じゃなかったです.",
        exampleJp: "きのうテレビをみませんでした。",
        exampleRomaji: "Kinou terebi wo mimasen deshita.",
        examplePt: "Ontem eu não assisti TV."
      },
      {
        rule: "3. Partícula と (E / Com)",
        explanation: "Conecta dois substantivos ('A e B') ou indica com quem você realiza uma ação ('com fulano').",
        exampleJp: "ともだちとえいがをみました。",
        exampleRomaji: "Tomodachi to eiga wo mimashita.",
        examplePt: "Assisti a um filme com meu amigo."
      }
    ],
    vocab: [
      ["g4_v1", "つくえ", "tsukue", ["mesa", "escrivaninha"], "Genki L4", "Objetos"],
      ["g4_v2", "いす", "isu", ["cadeira"], "Genki L4", "Objetos"],
      ["g4_v3", "しゃしん", "shashin", ["foto", "fotografia"], "Genki L4", "Objetos"],
      ["g4_v4", "かう", "kau", ["comprar"], "Genki L4", "Verbo U"],
      ["g4_v5", "かく", "kaku", ["escrever"], "Genki L4", "Verbo U"],
      ["g4_v6", "まつ", "matsu", ["esperar", "aguardar"], "Genki L4", "Verbo U"]
    ],
    questions: [
      {
        id: "g4_q1",
        sentence: "こうえんにねこが [ ___ ]。",
        translation: "Há um gato no parque.",
        options: ["います", "あります", "소です", "します"],
        answer: "います",
        audioText: "こうえんにねこがいます。",
        explanation: "Gatos (ねこ) são seres vivos animados, portanto usamos います."
      },
      {
        id: "g4_q2",
        sentence: "つくえのうえにほんが [ ___ ]。",
        translation: "Há um livro em cima da mesa.",
        options: ["あります", "います", "します", "きます"],
        answer: "あります",
        audioText: "つくえのうえにほんがあります。",
        explanation: "Livros (ほん) são objetos inanimados, portanto usamos あります."
      },
      {
        id: "g4_q3",
        sentence: "きのうかぞく [ ___ ] ばんごはんをたべました。",
        translation: "Ontem jantei com a minha família.",
        options: ["と", "を", "で", "に"],
        answer: "と",
        audioText: "きのうかぞくとばんごはんをたべました。",
        explanation: "A partícula と indica companhia ('com a família')."
      }
    ]
  },

  "L5": {
    id: "L5",
    title: "Lição 5: Viagem a Okinawa (おきなわрыょこう)",
    subtitle: "Adjetivos い e な (Presente e Passado), 好き (Gostar) e ~ましょう",
    grammar: [
      {
        rule: "1. Adjetivos い vs. Adjetivos な",
        explanation: "• Adjetivos-い (ex: おいしい, たかい): negam trocando o い final por くないです (passado: かったです).\n• Adjetivos-な (ex: しずか, げんき): comportam-se como substantivos! Negam com じゃないです e exigem な antes de um substantivo (ex: しずかなまち).",
        exampleJp: "このへやはひろくてしずかです。",
        exampleRomaji: "Kono heya wa hirokute shizuka desu.",
        examplePt: "Este quarto é amplo e silencioso."
      },
      {
        rule: "2. 好き (suki) e 嫌い (kirai) usam a partícula が",
        explanation: "Em japonês, gostar (すき) e não gostar (きらい) são adjetivos-な! O objeto de que você gosta é marcado com a partícula が.",
        exampleJp: "わたしはにほんごがすきです。",
        exampleRomaji: "Watashi wa nihongo ga suki desu.",
        examplePt: "Eu gosto de língua japonesa."
      }
    ],
    vocab: [
      ["g5_v1", "あたらしい", "atarashii", ["novo", "nova"], "Genki L5", "Adjetivo-i"],
      ["g5_v2", "ふるい", "furui", ["velho", "antigo"], "Genki L5", "Adjetivo-i"],
      ["g5_v3", "あつい", "atsui", ["quente"], "Genki L5", "Adjetivo-i"],
      ["g5_v4", "さむい", "samui", ["frio", "clima frio"], "Genki L5", "Adjetivo-i"],
      ["g5_v5", "しずか", "shizuka", ["silencioso", "calmo", "tranquilo"], "Genki L5", "Adjetivo-na"],
      ["g5_v6", "げんき", "genki", ["saudavel", "animado", "bem"], "Genki L5", "Adjetivo-na"]
    ],
    questions: [
      {
        id: "g5_q1",
        sentence: "きのうは [ ___ ] です。",
        translation: "Ontem estava frio. (Passado de さむい)",
        options: ["さむかった", "さむいでした", "さむくない", "さむくなかった"],
        answer: "さむかった",
        audioText: "きのうはさむかったです。",
        explanation: "Adjetivos-い fazem o passado trocando o い final por かった (さむい ➔ さむかった)."
      },
      {
        id: "g5_q2",
        sentence: "ここはとても [ ___ ] まちですね。",
        translation: "Aqui é uma cidade muito tranquila, né?",
        options: ["しずかな", "しずかの", "しずかい", "しずか"],
        answer: "しずかな",
        audioText: "ここはとてもしずかなまちですね。",
        explanation: "Adjetivos-な precisam da partícula な quando vêm diretamente antes de um substantivo (まち)."
      },
      {
        id: "g5_q3",
        sentence: "たけしさんはスポーツ [ ___ ] すきです。",
        translation: "O Takeshi gosta de esportes.",
        options: ["が", "を", "で", "に"],
        answer: "が",
        audioText: "たけしさんはスポーツがすきです。",
        explanation: "Com すき (gostar) e きらい (odiar), o alvo é marcado pela partícula が."
      }
    ]
  },

  "L6": {
    id: "L6",
    title: "Lição 6: Um Dia na Vida de Robert (ロバートさんのいちにち)",
    subtitle: "A Forma Te (~て form), Pedidos (~てください), Permissão (~てもいいです) e Proibição (~てはいけません)",
    grammar: [
      {
        rule: "1. A Forma Te (て-form) dos Verbos",
        explanation: "Uma das estruturas mais importantes do japonês! Serve para conectar ações em sequência, fazer pedidos educados (~てください) e pedir permissão.\n• Verbos-Ru: troque る por て (たべる ➔ たべて).\n• Verbos-U: う/つ/る ➔ って | む/ぶ/ぬ ➔ んで | く ➔ いて (exceção: いく ➔ いって) | ぐ ➔ いで | す ➔ して.",
        exampleJp: "そこをみぎにまがってください。",
        exampleRomaji: "Soko wo migi ni magatte kudasai.",
        examplePt: "Por favor, vire à direita ali."
      },
      {
        rule: "2. Permissão (~てもいいです) e Proibição (~てはいけません)",
        explanation: "• [Verbo て] + もいいですか = 'Posso fazer X?'\n• [Verbo て] + はいけません = 'É proibido / Não pode fazer X'.",
        exampleJp: "ここでしゃしんをとってもいいですか。",
        exampleRomaji: "Koko de shashin wo totte mo ii desu ka.",
        examplePt: "Posso tirar fotos aqui?"
      }
    ],
    vocab: [
      ["g6_v1", "あける", "akeru", ["abrir"], "Genki L6", "Verbo Ru"],
      ["g6_v2", "しめる", "shimeru", ["fechar"], "Genki L6", "Verbo Ru"],
      ["g6_v3", "おしえる", "oshieru", ["ensinar", "dizer"], "Genki L6", "Verbo Ru"],
      ["g6_v4", "わすれる", "wasureru", ["esquecer"], "Genki L6", "Verbo Ru"],
      ["g6_v5", "つかう", "tsukau", ["usar", "utilizar"], "Genki L6", "Verbo U"],
      ["g6_v6", "てつだう", "tetsudau", ["ajudar"], "Genki L6", "Verbo U"]
    ],
    questions: [
      {
        id: "g6_q1",
        sentence: "すみません、まどを [ ___ ] ください。(あける = abrir)",
        translation: "Com licença, abra a janela, por favor.",
        options: ["あけて", "あかって", "あきて", "あけんで"],
        answer: "あけて",
        audioText: "すみません、まどをあけてください。",
        explanation: "あける é um verbo Ru: basta remover o る e adicionar て (あけて)."
      },
      {
        id: "g6_q2",
        sentence: "ここでタバコを [ ___ ] はいけません。(すう = fumar)",
        translation: "É proibido fumar aqui.",
        options: ["すって", "すいて", "すんで", "すして"],
        answer: "すって",
        audioText: "ここでタバコをすってはいけません。",
        explanation: "Verbos terminados em う (すう) trocam う por って na forma Te (すって)."
      },
      {
        id: "g6_q3",
        sentence: "ちょっと [ ___ ] ください。(まつ = esperar)",
        translation: "Espere um pouquinho, por favor.",
        options: ["まって", "まちて", "まんで", "まいて"],
        answer: "まって",
        audioText: "ちょっとまってください。",
        explanation: "Verbos terminados em つ (まつ) fazem a forma Te com って (まって)."
      }
    ]
  },

  "L7": {
    id: "L7",
    title: "Lição 7: Foto de Família (かぞくのしゃしん)",
    subtitle: "Ação em Progresso (~ています), Descrição Física (X は Y が Adjetivo) e Contagem de Pessoas",
    grammar: [
      {
        rule: "1. ~ています (Ação contínua ou Estado resultante)",
        explanation: "Com verbos de ação (たべる, よむ), ~ています indica o que alguém está fazendo agora ('estou lendo'). Com verbos de mudança de estado (けっこんする, すむ, しる), indica um estado contínuo ('sou casado', 'moro em...', 'conheço').",
        exampleJp: "いまにほんごをべんきょうしています。",
        exampleRomaji: "Ima nihongo wo benkyou shite imasu.",
        examplePt: "Agora estou estudando japonês."
      },
      {
        rule: "2. Descrevendo Características: Pessoa は Parte が Adjetivo",
        explanation: "Para dizer que alguém tem cabelo comprido ou olhos grandes, a pessoa é o tópico (は) e a parte do corpo recebe a partícula が!",
        exampleJp: "トムさんはせがたかいです。",
        exampleRomaji: "Tomu-san wa se ga takai desu.",
        examplePt: "O Tom é alto (tem estatura alta)."
      }
    ],
    vocab: [
      ["g7_v1", "うたう", "utau", ["cantar"], "Genki L7", "Verbo U"],
      ["g7_v2", "تきる", "kiru", ["vestir", "usar da cintura para cima"], "Genki L7", "Verbo Ru"],
      ["g7_v3", "はく", "haku", ["calcar", "vestir da cintura para baixo"], "Genki L7", "Verbo U"],
      ["g7_v4", "しる", "shiru", ["saber", "conhecer"], "Genki L7", "Verbo U"],
      ["g7_v5", "すむ", "sumu", ["morar", "residir"], "Genki L7", "Verbo U"],
      ["g7_v6", "めがね", "megane", ["oculos", "óculos"], "Genki L7", "Objetos"]
    ],
    questions: [
      {
        id: "g7_q1",
        sentence: "メアリーさんはかみが [ ___ ] です。",
        translation: "A Mary tem cabelo comprido.",
        options: ["ながい", "たかい", "ひろい", "はやい"],
        answer: "ながい",
        audioText: "メアリーさんはかみがながいです。",
        explanation: "ながい significa 'comprido/longo' (usado para cabelo, objetos e tempo)."
      },
      {
        id: "g7_q2",
        sentence: "あのおغさんはめがねを [ ___ ] います。",
        translation: "Aquela pessoa está usando óculos.",
        options: ["かけて", "きて", "はいて", "かぶって"],
        answer: "かけて",
        audioText: "あのひとはめがねをかけています。",
        explanation: "Para óculos (めがね), o verbo específico em japonês é かける (かけています)."
      }
    ]
  },

  "L8": {
    id: "L8",
    title: "Lição 8: Churrasco (バーベキュー)",
    subtitle: "Formas Curtas (Informal Presente), Citações (~と思います / ~と言っていました) e ~ないでください",
    grammar: [
      {
        rule: "1. Forma Curta (Short Form) no Presente Afirmativo e Negativo",
        explanation: "Usada entre amigos e dentro de estruturas gramaticais!\n• Afirmativo: igual à forma de dicionário (たべる, いく, おいしい, しずかだ).\n• Negativo (Nai-form): Verbos-Ru trocam る por ない (たべない). Verbos-U mudam a vogal 'u' para 'a' + ない (いく ➔ いかない; atenção: う vira わない, ex: かう ➔ かわない).",
        exampleJp: "あしたはあめがふらないとおもいます。",
        exampleRomaji: "Ashita wa ame ga furanai to omoimasu.",
        examplePt: "Acho que amanhã não vai chover."
      },
      {
        rule: "2. Pedido Negativo: ~ないでください",
        explanation: "Junte a forma negativa curta (~ない) com でください para pedir 'Por favor, não faça X'.",
        exampleJp: "わすれないでください。",
        exampleRomaji: "Wasurenai de kudasai.",
        examplePt: "Por favor, não se esqueça."
      }
    ],
    vocab: [
      ["g8_v1", "あめ", "ame", ["chuva"], "Genki L8", "Clima"],
      ["g8_v2", "てんきよほう", "tenkiyohou", ["previsao do tempo", "previsão do tempo"], "Genki L8", "Clima"],
      ["g8_v3", "はじまる", "hajimaru", ["comecar", "começar"], "Genki L8", "Verbo U"],
      ["g8_v4", "つくる", "tsukuru", ["fazer", "preparar", "produzir"], "Genki L8", "Verbo U"],
      ["g8_v5", "せんたくする", "sentakusuru", ["lavar roupa"], "Genki L8", "Verbo Irr"],
      ["g8_v6", "りょうり", "ryouri", ["culinaria", "comida", "prato"], "Genki L8", "Comida"]
    ],
    questions: [
      {
        id: "g8_q1",
        sentence: "たけしさんはきょうパーティーに [ ___ ] とおもいます。(くる = vir)",
        translation: "Acho que o Takeshi não vem para a festa hoje.",
        options: ["こない", "きない", "くない", "こらない"],
        answer: "こない",
        audioText: "たけしさんはきょうパーティーにこないとおもいます。",
        explanation: "O verbo irregular くる (ku-ru) tem a forma negativa curta こない (ko-nai)!"
      },
      {
        id: "g8_q2",
        sentence: "ここでしゃしんを [ ___ ] でください。(とる = tirar foto)",
        translation: "Por favor, não tire fotos aqui.",
        options: ["とらない", "とれない", "とりのない", "とってない"],
        answer: "とらない",
        audioText: "ここでしゃしんをとらないでください。",
        explanation: "とる é um verbo-U, logo sua forma Nai é とらない + でください."
      }
    ]
  },

  "L9": {
    id: "L9",
    title: "Lição 9: Kabuki (かぶき)",
    subtitle: "Passado Informal (~た form), Qualificadores de Substantivo, もう / まだ e Cores no Japonês",
    grammar: [
      {
        rule: "1. Passado na Forma Curta (~た / ~なかった)",
        explanation: "A forma ~た é construída exatamente com a mesma regra sonora da forma ~て (basta trocar て por た e で por だ! Ex: たべて ➔ たべた, よんで ➔ よんだ, いって ➔ いった). No negativo passado: troque o い de ~ない por かった (~なかった).",
        exampleJp: "きのうかったほんはおもしろかったです。",
        exampleRomaji: "Kinou katta hon wa omoshirokatta desu.",
        examplePt: "O livro que comprei ontem era interessante."
      },
      {
        rule: "2. Cores em Japonês: Adjetivos-い vs. Substantivos com の",
        explanation: "As 4 cores primárias antigas (あかい vermelho, あおい azul, しろい branco, くろい preto) + きいろい (amarelo) e ちゃいろい (marrom) são Adjetivos-い quando qualificam algo! Já cores como みどり (verde) e むらさき (roxo) são substantivos e usam の (ex: みどりのかばん).",
        exampleJp: "あかいセーターとみどりのかばんをかいました。",
        exampleRomaji: "Akai seetaa to midori no kaban wo kaimashita.",
        examplePt: "Comprei um suéter vermelho e uma bolsa verde."
      }
    ],
    vocab: [
      ["g9_v1", "あかい", "akai", ["vermelho", "vermelha"], "Genki L9", "Cores"],
      ["g9_v2", "あおい", "aoi", ["azul"], "Genki L9", "Cores"],
      ["g9_v3", "くろい", "kuroi", ["preto", "preta"], "Genki L9", "Cores"],
      ["g9_v4", "しろい", "shiroi", ["branco", "branca"], "Genki L9", "Cores"],
      ["g9_v5", "おどる", "odoru", ["dancar", "dançar"], "Genki L9", "Verbo U"],
      ["g9_v6", "おわる", "owaru", ["terminar", "acabar"], "Genki L9", "Verbo U"]
    ],
    questions: [
      {
        id: "g9_q1",
        sentence: "もうしゅくだいを [ ___ ] か。— いいえ、まだです。",
        translation: "Você já fez a lição de casa? — Não, ainda não.",
        options: ["しました", "します", "していません", "しります"],
        answer: "しました",
        audioText: "もうしゅくだいをしましたか。",
        explanation: "Com もう (já), usamos o verbo no passado (しましたか = 'já fez?')."
      },
      {
        id: "g9_q2",
        sentence: "あそこでギターを [ ___ ] ひとがたけしさんです。(ひく = tocar)",
        translation: "A pessoa que está tocando violão ali é o Takeshi.",
        options: ["ひいている", "ひきます", "ひいたです", "ひくの"],
        answer: "ひいている",
        audioText: "あそこでギターをひいているひとがたけしさんです。",
        explanation: "Orações que qualificam um substantivo (ひと) usam o verbo na forma curta (ひいている)."
      }
    ]
  },

  "L10": {
    id: "L10",
    title: "Lição 10: Férias de Inverno (ふゆやすみのよてい)",
    subtitle: "Comparações (より / のほうが / いちばん), Planos (~つもりだ), Tornar-se (~くなる/になる) e ので",
    grammar: [
      {
        rule: "1. Comparação entre 2 itens (A のほうが B より...) e Superlativo (いちばん)",
        explanation: "• 'A é mais [Adjetivo] que B': A のほうが B より [Adj] です.\n• Para perguntar entre dois: A と B と どっちのほうが... ('Qual dos dois é mais...?').\n• Para 3 ou mais itens: usamos いちばん ('o número um / o mais').",
        exampleJp: "しんかんせんのほうがバスよりはやいです。",
        exampleRomaji: "Shinkansen no hou ga basu yori hayai desu.",
        examplePt: "O trem-bala é mais rápido do que o ônibus."
      },
      {
        rule: "2. Intenção / Planos Futuros: [Verbo Curto] + つもりだ",
        explanation: "Usa-se o verbo na forma curta presente + つもりです para expressar uma intenção firme ('pretendo fazer X').",
        exampleJp: "らいねんにほんにいくつもりです。",
        exampleRomaji: "Rainen nihon ni iku tsumori desu.",
        examplePt: "Pretendo ir ao Japão no ano que vem."
      },
      {
        rule: "3. Mudança de Estado: ~くなる / ~になる (Ficar / Tornar-se)",
        explanation: "• Com Adjetivos-い: troque い por く + なります (ex: あたたかい ➔ あたたかくなります = ficar quente).\n• Com Adjetivos-な e Substantivos: adicione に + なります (ex: げんきになります / いしゃになります = tornar-se médico).",
        exampleJp: "だんだんあたたかくなります。",
        exampleRomaji: "Dandan atatakaku narimasu.",
        examplePt: "Vai ficar quente gradualmente."
      }
    ],
    vocab: [
      ["g10_v1", "しんかんせん", "shinkansen", ["trem-bala", "trem bala"], "Genki L10", "Transporte"],
      ["g10_v2", "ひこうき", "hikouki", ["aviao", "avião"], "Genki L10", "Transporte"],
      ["g10_v3", "きせつ", "kisetsu", ["estacao do ano", "estação do ano"], "Genki L10", "Natureza"],
      ["g10_v4", "あたたかい", "atatakai", ["ameno", "morno", "agradavel"], "Genki L10", "Clima"],
      ["g10_v5", "すずしい", "suzushii", ["fresco", "clima fresco"], "Genki L10", "Clima"],
      ["g10_v6", "とまる", "tomaru", ["hospedar-se", "ficar em hotel"], "Genki L10", "Verbo U"]
    ],
    questions: [
      {
        id: "g10_q1",
        sentence: "サッカーとやきゅうと [ ___ ] のほうがすきですか。",
        translation: "Entre futebol e beisebol, de qual dos dois você gosta mais?",
        options: ["どっち", "どこ", "どれ", "だれ"],
        answer: "どっち",
        audioText: "サッカーとやきゅうとどっちのほうがすきですか。",
        explanation: "Ao comparar exatamente 2 elementos (A と B), usamos どっち (ou どちら)."
      },
      {
        id: "g10_q2",
        sentence: "しょうらい、エンジニア [ ___ ] なりたいです。",
        translation: "No futuro, quero me tornar engenheiro.",
        options: ["に", "く", "を", "で"],
        answer: "に",
        audioText: "しょうらい、エンジニアになりたいです。",
        explanation: "Com substantivos (エンジニア) e adjetivos-な, o verbo なる exige a partícula に."
      },
      {
        id: "g10_q3",
        sentence: "メインストリートはみどりおおり [ ___ ] にぎやかです。",
        translation: "A Rua Principal é mais movimentada do que a Rua Midori.",
        options: ["より", "ほど", "のほう", "いちばん"],
        answer: "より",
        audioText: "メインストリートはみどりどおりよりにぎやかです。",
        explanation: "A partícula より significa 'do que' em comparações."
      }
    ]
  },

  "L11": {
    id: "L11",
    title: "Lição 11: Depois das Férias (やすみのあと)",
    subtitle: "Desejos (~たいです), Experiência Passada (~たことがある) e Listagem de Ações (~たり~たりする)",
    grammar: [
      {
        rule: "1. Expressando Desejo: [Radical de ~ます] + たいです",
        explanation: "Para dizer 'Quero fazer X', tire o ます do verbo e adicione たいです (ex: いきます ➔ いきたいです). Ele conjuga exatamente como um Adjetivo-い (negativo: いくたくないです).",
        exampleJp: "にほんにいきたいです。",
        exampleRomaji: "Nihon ni ikitai desu.",
        examplePt: "Eu quero ir ao Japão."
      },
      {
        rule: "2. Experiência de Vida: [Verbo ~た] + ことがあります",
        explanation: "Indica se você já teve a experiência de fazer algo alguma vez na vida ('Eu já fiz X').",
        exampleJp: "ふじさんにのぼったことがあります。",
        exampleRomaji: "Fujisan ni nobotta koto ga arimasu.",
        examplePt: "Eu já subi o Monte Fuji (tenho essa experiência)."
      },
      {
        rule: "3. Listando Ações Representativas: ~たり ~たり する",
        explanation: "Para citar exemplos de atividades ('faço coisas como X e Y'), coloque os verbos no passado curto + り (~たり) e finalize com します.",
        exampleJp: "にちようびはゲームをしたり、ほんをよんだりします。",
        exampleRomaji: "Nichiyoubi wa geemu wo shitari, hon wo yondari shimasu.",
        examplePt: "Aos domingos, faço coisas como jogar videogame e ler livros."
      }
    ],
    vocab: [
      ["g11_v1", "ゆめ", "yume", ["sonho"], "Genki L11", "Substantivo"],
      ["g11_v2", "しょうらい", "shourai", ["futuro"], "Genki L11", "Tempo"],
      ["g11_v3", "のぼる", "noboru", ["subir", "escalar"], "Genki L11", "Verbo U"],
      ["g11_v4", "つかれる", "tsukareru", ["cansar", "ficar cansado"], "Genki L11", "Verbo Ru"],
      ["g11_v5", "やめる", "yameru", ["parar", "desistir", "demitir-se"], "Genki L11", "Verbo Ru"],
      ["g11_v6", "ならう", "narau", ["aprender"], "Genki L11", "Verbo U"]
    ],
    questions: [
      {
        id: "g11_q1",
        sentence: "なつやすみになにを [ ___ ] ですか。(する = fazer)",
        translation: "O que você quer fazer nas férias de verão?",
        options: ["したい", "するたい", "したたい", "しりたい"],
        answer: "したい",
        audioText: "なつやすみになにをしたいですか。",
        explanation: "Tirando ます de します, temos し + たい = したい (querer fazer)."
      },
      {
        id: "g11_q2",
        sentence: "すしを [ ___ ] ことがありますか。(たべる = comer)",
        translation: "Você já comeu sushi alguma vez na vida?",
        options: ["たべた", "たべる", "たべて", "たべたい"],
        answer: "たべた",
        audioText: "すしをたべたことがありますか。",
        explanation: "A estrutura de experiência exige o verbo no passado curto (~た) antes de ことがあります."
      }
    ]
  },

  "L12": {
    id: "L12",
    title: "Lição 12: Sentindo-se Doente (びょうき)",
    subtitle: "Explicações (~んです), Excesso (~すぎる), Conselho (~ほうがいい) e Obrigação (~なければいけません)",
    grammar: [
      {
        rule: "1. Dando Explicações ou Pedindo Esclarecimento: ~んです",
        explanation: "Adicione んです (ou のです) após a forma curta para explicar o motivo de uma situação visível ou pedir uma explicação ('É que...'). Atenção: com substantivos e adjetivos-な no presente, coloca-se な antes de んです (ex: びょうきなんです).",
        exampleJp: "あたまがいたいんです。",
        exampleRomaji: "Atama ga itai n desu.",
        examplePt: "É que estou com dor de cabeça."
      },
      {
        rule: "2. Demais / Em Excesso: ~すぎます",
        explanation: "Pegue o radical de ~ます do verbo (ou a raiz do adjetivo sem o い final) e adicione すぎます para dizer que fez algo demais.",
        exampleJp: "きのうおさけをのみすぎました。",
        exampleRomaji: "Kinou osake wo nomisugimashita.",
        examplePt: "Ontem bebi álcool demais."
      },
      {
        rule: "3. Dando Conselhos: ~たほうがいいです / ~ないほうがいいです",
        explanation: "Usa-se o passado curto (~た) + ほうがいいです para aconselhar ('É melhor você fazer X').",
        exampleJp: "くすりをのんだほうがいいですよ。",
        exampleRomaji: "Kusuri wo nonda hou ga ii desu yo.",
        examplePt: "É melhor você tomar um remédio!"
      }
    ],
    vocab: [
      ["g12_v1", "おなか", "onaka", ["barriga", "estomago", "estômago"], "Genki L12", "Corpo"],
      ["g12_v2", "いたい", "itai", ["dolorido", "doer", "doi"], "Genki L12", "Saúde"],
      ["g12_v3", "かぜ", "kaze", ["resfriado", "gripe"], "Genki L12", "Saúde"],
      ["g12_v4", "くすり", "kusuri", ["remedio", "remédio", "medicamento"], "Genki L12", "Saúde"],
      ["g12_v5", "ねつ", "netsu", ["febre"], "Genki L12", "Saúde"],
      ["g12_v6", "あまい", "amai", ["doce"], "Genki L12", "Adjetivo-i"]
    ],
    questions: [
      {
        id: "g12_q1",
        sentence: "ケーキを [ ___ ] すぎました。(たべる = comer)",
        translation: "Comi bolo demais.",
        options: ["たべ", "たべる", "たべて", "たべた"],
        answer: "たべ",
        audioText: "ケーキをたべすぎました。",
        explanation: "Para usar ~すぎます, usamos o radical do verbo sem ます (たべます ➔ たべ + すぎました)."
      },
      {
        id: "g12_q2",
        sentence: "かぜですから、きょうは早く [ ___ ] ほうがいいですよ。(ねる = dormir)",
        translation: "Como você está resfriado, é melhor dormir cedo hoje.",
        options: ["ねた", "ねる", "ねて", "ねよう"],
        answer: "ねた",
        audioText: "かぜですから、きょうははやくねたほうがいいですよ。",
        explanation: "Conselhos afirmativos com ~ほうがいいです usam o verbo na forma ~た (ねたほうがいい)."
      },
      {
        id: "g12_q3",
        sentence: "あしたテストが [ ___ ] んです。(ある = ter/haver)",
        translation: "É que amanhã tenho prova.",
        options: ["ある", "あります", "あった", "あり"],
        answer: "ある",
        audioText: "あしたテストがあるんです。",
        explanation: "Antes de ~んです, o verbo fica na forma curta (あるんです)."
      }
    ]
  }
};

// 6. DESCOMPACTADOR EM MEMÓRIA E FUNÇÕES UTILITÁRIAS
const NihongoData = {
  fullKanjiLoaded: false,

  /**
   * Baixa assincronamente o dicionário completo com +2.136 Jōyō Kanjis (N5 a N1)
   * e faz cache no navegador para não pesar no repositório do GitHub!
   */
  async loadFullJLPTKanji() {
    if (this.fullKanjiLoaded) return true;

    const cached = localStorage.getItem("nd_joyo_kanji_cache_v1");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        this.mergeExternalKanji(parsed);
        this.fullKanjiLoaded = true;
        return true;
      } catch (e) {
        console.warn("Cache de Kanji inválido, baixando novamente...");
      }
    }

    try {
      const res = await fetch("https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji-jouyou.json");
      if (!res.ok) throw new Error("Falha ao buscar pacote Jōyō Kanji");
      const rawJson = await res.json();

      const compactByLevel = { n5: [], n4: [], n3: [], n2: [], n1: [] };

      Object.entries(rawJson).forEach(([char, info]) => {
        const lvlNum = info.jlpt_new || 1;
        const lvlKey = `n${lvlNum}`;
        if (!compactByLevel[lvlKey]) return;

        const readingsOn = (info.readings_on || []).map(k => this.kanaToRomaji(k));
        const readingsKun = (info.readings_kun || []).map(k => this.kanaToRomaji(k.replace(/[.-]/g, "")));
        const allRomaji = [...new Set([...readingsOn, ...readingsKun])].filter(Boolean);

        const primaryRomaji = allRomaji[0] || "kanji";
        const meaning = (info.meanings && info.meanings[0]) ? info.meanings[0] : "Ideograma Jōyō";

        compactByLevel[lvlKey].push([
          `k_${char}`,
          char,
          primaryRomaji,
          allRomaji.length > 0 ? allRomaji.slice(0, 5) : [primaryRomaji],
          meaning,
          `JLPT N${lvlNum} (${info.strokes || "?"} traços) • Leituras: ${allRomaji.slice(0, 4).join(", ")}`
        ]);
      });

      this.mergeExternalKanji(compactByLevel);
      try {
        localStorage.setItem("nd_joyo_kanji_cache_v1", JSON.stringify(compactByLevel));
      } catch (storageErr) {}
      this.fullKanjiLoaded = true;
      return true;
    } catch (err) {
      console.warn("Usando pacote local de Kanjis N5-N1:", err);
      return false;
    }
  },

  mergeExternalKanji(compactByLevel) {
    ["n5", "n4", "n3", "n2", "n1"].forEach(lvlKey => {
      if (compactByLevel[lvlKey] && compactByLevel[lvlKey].length > 0) {
        const existingIds = new Set(RAW_KANJI_LEVELS[lvlKey].items.map(x => x[1]));
        compactByLevel[lvlKey].forEach(item => {
          if (!existingIds.has(item[1])) {
            RAW_KANJI_LEVELS[lvlKey].items.push(item);
          }
        });
      }
    });
  },

  kanaToRomaji(kanaStr) {
    if (!kanaStr) return "";
    if (!this._kanaMap) {
      this._kanaMap = {};
      [...RAW_KANA_YOON, ...RAW_KANA_DAKUTEN, ...RAW_KANA_GOJUON].forEach(([rom, hira, kata]) => {
        this._kanaMap[hira] = rom;
        this._kanaMap[kata] = rom;
      });
    }
    let out = "";
    let i = 0;
    while (i < kanaStr.length) {
      const two = kanaStr.slice(i, i + 2);
      if (this._kanaMap[two]) {
        out += this._kanaMap[two];
        i += 2;
        continue;
      }
      const one = kanaStr[i];
      if (one === "っ" || one === "ッ") {
        const nextOne = kanaStr[i + 1];
        const nextRom = this._kanaMap[nextOne] || "";
        if (nextRom) out += nextRom[0];
        i += 1;
        continue;
      }
      if (one === "ー" && out.length > 0) {
        out += out[out.length - 1];
        i += 1;
        continue;
      }
      out += this._kanaMap[one] || "";
      i += 1;
    }
    return out;
  },

  getAlphabetPool(options = { hiragana: true, katakana: false, kanji: false, includeDakuten: false, includeYoon: false, kanjiLevels: ["n5"], kanjiBatch: "all" }) {
    const pool = [];
    let rawKana = [...RAW_KANA_GOJUON];
    if (options.includeDakuten) rawKana = rawKana.concat(RAW_KANA_DAKUTEN);
    if (options.includeYoon) rawKana = rawKana.concat(RAW_KANA_YOON);

    if (options.hiragana) {
      rawKana.forEach(([romaji, hira, kata, alts]) => {
        const id = `h_${romaji}`;
        pool.push({
          id,
          symbol: hira,
          hiraganaPair: hira,
          katakanaPair: kata,
          romaji,
          acceptedRomaji: [romaji, ...alts],
          type: "hiragana",
          meaning: null,
          hint: CONFUSING_HINTS[id] || `Hiragana para "${romaji.toUpperCase()}" (Katakana equivalente: ${kata}).`
        });
      });
    }

    if (options.katakana) {
      rawKana.forEach(([romaji, hira, kata, alts]) => {
        const id = `k_${romaji}`;
        pool.push({
          id,
          symbol: kata,
          hiraganaPair: hira,
          katakanaPair: kata,
          romaji,
          acceptedRomaji: [romaji, ...alts],
          type: "katakana",
          meaning: null,
          hint: CONFUSING_HINTS[id] || `Katakana "${kata}" corresponde ao Hiragana "${hira}" (${romaji.toUpperCase()}).`
        });
      });
    }

    if (options.kanji && options.kanjiLevels && options.kanjiLevels.length > 0) {
      let combinedKanji = [];
      options.kanjiLevels.forEach(lvlKey => {
        const lvl = RAW_KANJI_LEVELS[lvlKey];
        if (lvl) {
          combinedKanji = combinedKanji.concat(lvl.items);
        }
      });

      if (options.kanjiBatch && options.kanjiBatch !== "all") {
        const [start, end] = options.kanjiBatch.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          combinedKanji = combinedKanji.slice(start, end);
        }
      }

      combinedKanji.forEach(([id, char, romaji, alts, meaning, hint]) => {
        pool.push({
          id,
          symbol: char,
          hiraganaPair: null,
          katakanaPair: null,
          romaji,
          acceptedRomaji: alts,
          type: "kanji",
          meaning,
          hint: `${meaning} (${alts.join(" / ")}) — ${hint}`
        });
      });
    }

    return pool;
  },

  /**
   * Retorna a lista de vocabulários (suporta 'hiragana', 'katakana', 'kanji' ou 'genki_L1'...'genki_L12' ou 'genki_all')
   */
  getVocabularyPool(scriptType = "hiragana") {
    let list = [];
    if (scriptType === "genki_all") {
      Object.values(GENKI_LESSONS).forEach(lesson => {
        list = list.concat(lesson.vocab || []);
      });
    } else if (scriptType.startsWith("genki_")) {
      const lessonKey = scriptType.replace("genki_", "");
      list = GENKI_LESSONS[lessonKey]?.vocab || RAW_VOCABULARY.hiragana;
    } else {
      list = RAW_VOCABULARY[scriptType] || RAW_VOCABULARY.hiragana;
    }

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
   * Retorna todas as lições do Genki I ou uma lição específica
   */
  getGenkiLesson(lessonKey = "L1") {
    return GENKI_LESSONS[lessonKey] || GENKI_LESSONS.L1;
  },

  getAllGenkiQuestions(lessonKeys = ["L1"]) {
    let qList = [];
    lessonKeys.forEach(k => {
      const lesson = GENKI_LESSONS[k];
      if (lesson && lesson.questions) {
        lesson.questions.forEach(q => {
          qList.push({ ...q, lessonId: k, lessonTitle: lesson.title });
        });
      }
    });
    return qList;
  },

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

  checkPortugueseMeaning(userInput, acceptedMeanings) {
    const cleanInput = this.normalizeText(userInput);
    if (!cleanInput) return false;
    return acceptedMeanings.some(m => this.normalizeText(m) === cleanInput);
  },

  speakJapanese(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Áudio não suportado neste dispositivo:", e);
    }
  }
};

window.RAW_KANJI_LEVELS = RAW_KANJI_LEVELS;
window.GENKI_LESSONS = GENKI_LESSONS;
window.NihongoData = NihongoData;
