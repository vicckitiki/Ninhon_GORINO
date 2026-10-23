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
  ["cha","ちゃ","チャ",["tya", "cya"]], ["chu","ちゅ","チュ",["tyu", "cyu"]], ["cho","ちょ","チョ",["tyo", "cyo"]],
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
// 2. KANJI POR PROFICIÊNCIA JLPT (N5 ao N1)
// Formato compacto: [Id, Caractere, RomajiPrincipal, [RomajisAceitos], SignificadoPT, DicaOuNivel]
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
      ["k_주", "住", "juu", ["su", "juu"], "Morar / Residir", "JLPT N4 • Pessoa fixada num local."],
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
      ["k_친", "親", "shin", ["oya", "shita", "shin"], "Pais / Íntimo", "JLPT N4 • Ver (見) de perto a árvore."],
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
      ["k_화", "和", "wa", ["yawa", "nago", "wa", "o"], "Harmonia / Paz / Japão", "JLPT N3 • Cereal (禾) na boca (口)."],
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
      ["k_حص", "検査", "ken", ["ken"], "Inspeção / Exame", "JLPT N2 • Verificar minuciosamente."]
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
      ["k_絶縁", "絶", "zetsu", ["ta", "zetsu"], "Isolar / Cortar", "JLPT N1 • Isolamento (絶縁)."],
      ["k_縁", "縁", "en", ["fuchi", "yukari", "en"], "Vínculo / Borda", "JLPT N1 • Fio que contorna."],
      ["k_振", "振", "shin", ["fu", "shin"], "Oscilar / Vibrar", "JLPT N1 • Oscilação/Frequência (振動)."],
      ["k_幅", "幅", "fuku", ["haba", "fuku"], "Largura / Amplitude", "JLPT N1 • Amplitude de onda (振幅)."],
      ["k_周", "周", "shuu", ["mawa", "shuu"], "Perímetro / Ciclo", "JLPT N1 • Frequência (周波数)."],
      ["k_波", "波", "ha", ["nami", "ha"], "Onda", "JLPT N1 • Forma de onda (波形)."],
      ["k_整", "整", "sei", ["totono", "sei"], "Ajustar / Retificar", "JLPT N1 • Retificador (整流器)."],
      ["k_変", "変換", "kan", ["ka", "kan"], "Converter / Trocar", "JLPT N1 • Conversor (変換器)."],
      ["k_御", "制御", "gyo", ["gyo", "go"], "Domínio / Regulação", "JLPT N1 • Engenharia de controle."],
      ["k_冗", "冗", "jou", ["jou"], "Redundância / Supérfluo", "JLPT N1 • Redundância de sistema (冗長性)."],
      ["k_瞬", "瞬", "shun", ["matata", "shun"], "Instante / Transitório", "JLPT N1 • Valor instantâneo (瞬時値)."],
      ["k_穏", "穏", "on", ["oda", "on"], "Calmo / Estável", "JLPT N1 • Estado estacionário/calmo."]
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
  /**
   * Retorna a fila de símbolos de alfabeto conforme os filtros marcados pelo usuário
   * (Agora inclui o mapeamento cruzado hiraganaPair / katakanaPair)
   */fullKanjiLoaded: false,

  /**
   * Baixa assincronamente o dicionário completo com +2.136 Jōyō Kanjis (N5 a N1)
   * e faz cache no navegador para não pesar no repositório do GitHub!
   */
  async loadFullJLPTKanji() {
    if (this.fullKanjiLoaded) return true;

    // 1. Tenta ler do cache local primeiro
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

    // 2. Baixa base pública compacta com os +2.100 Kanjis do JLPT (N5 a N1)
    try {
      const res = await fetch("https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji-jouyou.json");
      if (!res.ok) throw new Error("Falha ao buscar pacote Jōyō Kanji");
      const rawJson = await res.json();

      // Compacta apenas o essencial: [char, jlpt_new, wk_readings, meanings]
      const compactByLevel = { n5: [], n4: [], n3: [], n2: [], n1: [] };

      Object.entries(rawJson).forEach(([char, info]) => {
        const lvlNum = info.jlpt_new || 1; // Kanjis Jōyō avançados sem nível caem no N1
        const lvlKey = `n${lvlNum}`;
        if (!compactByLevel[lvlKey]) return;

        // Extrai leituras em Romaji ou converte do Kana se necessário
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
      } catch (storageErr) {
        // Se o localStorage estiver cheio, mantém em RAM normalmente
      }
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

  /**
   * Conversor leve de Hiragana/Katakana para Romaji (para processar leituras Kun/On dos 2.136 Kanjis)
   */
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

  /**
   * Retorna a fila de símbolos de alfabeto conforme os filtros marcados pelo usuário
   * Suporta fatiamento por lote (kanjiBatch) para não sobrecarregar nos +2.000 Kanjis!
   */
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

      // Aplica delimitação por lote (ex: "0-25", "25-50", etc.) para evitar sobrecarga
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
