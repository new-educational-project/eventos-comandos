"use strict";

/* =========================================================
   ARQUIVOS DE IMAGEM — V12
   • TODAS as imagens 01 a 54 ficam na RAIZ do GitHub.
   • Nomes obrigatórios: 01.jpg, 02.jpg ... 54.jpg.
   • Não há dependência de Postimages nem de subpastas.
========================================================= */
const asset = number => `${String(Number(number)).padStart(2, "0")}.jpg`;

const assetFileName = number => `${String(Number(number)).padStart(2, "0")}.jpg`;
const POS = (x, y) => ({ x, y });
const SPECIAL_PASSWORD = "#gostodeestudar";

/* =========================================================
   TAMANHO DOS TABULEIROS — REGRA FIXA DO PROJETO
   • CONSCIÊNCIA+: 5 × 5
   • ECOTECH+:      6 × 6
   • HUMANO+:       6 × 6
   A função abaixo garante a regra mesmo que alguma fase seja
   editada posteriormente com um valor incorreto.
========================================================= */
function expectedBoardSize(levelKey) {
  return levelKey === "conscious" ? 5 : 6;
}

/* =========================================================
   NOMES EXIBIDOS AO AMPLIAR AS IMAGENS
   Base: 3ª coluna do arquivo de nomenclatura enviado.
   Todas as imagens 01 a 54 são carregadas da raiz do GitHub.
========================================================= */
const IMAGE_NAMES = Object.freeze({
  1:  "Papelão",
  2:  "Garrafa PET",
  3:  "Garrafa de vidro",
  4:  "Fralda",
  5:  "Papel higiênico",
  6:  "Frasco de medicamento",
  7:  "Ponto de reciclagem",
  8:  "Lixeira marrom — rejeitos",
  9:  "Lixeira azul — papel",
  10: "Lixeira verde — vidro",
  11: "Lixeira amarela — metal",
  12: "Lixeira vermelha — plástico",
  13: "Barreira: Pedra",
  14: "Barreira: Lama",
  15: "Barreira: Entulho",
  16: "Metal",
  17: "Indígena",
  18: "Indígena",
  19: "Imigrante asiático",
  20: "Imigrante asiática",
  21: "Imigrante árabe",
  22: "Imigrante árabe",
  23: "Imigrante sul-americano",
  24: "Imigrante sul-americana",
  25: "Judeu",
  26: "Judia",
  27: "Cigano",
  28: "Cigana",
  29: "Eslavo",
  30: "Eslava",
  31: "Pessoa negra",
  32: "Pessoa negra",
  33: "Mulher",
  34: "Mulher",
  35: "Idoso",
  36: "Idosa",
  37: "Criança",
  38: "Criança",
  39: "Criança",
  40: "Doméstica",
  41: "Operador de produção - alimentos",
  42: "Agricultor",
  43: "Salão do acolhimento: crianças",
  44: "Salão do acolhimento: mulheres",
  45: "Salão do acolhimento: idosos",
  46: "Salão do acolhimento: trabalhadores",
  47: "Salão do acolhimento: indígenas",
  48: "Salão do acolhimento: asiáticos",
  49: "Salão do acolhimento: árabes",
  50: "Salão do acolhimento: Imigrante sul-americanos",
  51: "Salão do acolhimento: judeus",
  52: "Salão do acolhimento: Pessoas negras",
  53: "Salão do acolhimento: ciganos",
  54: "Salão do acolhimento: eslavos"
});

const imageName = number => IMAGE_NAMES[Number(number)] || `Imagem ${String(number).padStart(2, "0")}`;

const COMMANDS = {
  MOVE_UP:    { symbol: "▲", dx: 0, dy: -1 },
  MOVE_DOWN:  { symbol: "▼", dx: 0, dy: 1 },
  MOVE_LEFT:  { symbol: "◀", dx: -1, dy: 0 },
  MOVE_RIGHT: { symbol: "▶", dx: 1, dy: 0 },
  ACTION:     { symbol: "✓", dx: 0, dy: 0 }
};

const HUMAN_GROUP_LABELS = {
  children: "crianças",
  women: "mulheres",
  elderly: "pessoas idosas",
  workers: "trabalhadores",
  indigenous: "indígenas",
  southamerican: "imigrantes sul-americanos",
  arab: "árabes",
  asian: "asiáticos",
  jewish: "judeus",
  black: "pessoas negras",
  roma: "ciganos",
  slavic: "eslavos"
};

function humanGroupLabel(group) {
  return HUMAN_GROUP_LABELS[group] || "grupo atual";
}

function humanGroupMembers(group) {
  return items.filter(person => person.type === group && !person.delivered);
}

function humanGroupCarried(group) {
  return carriedEntries().filter(person => person.type === group);
}

function humanGroupPending(group) {
  const carryingIds = new Set(carrying);
  return items.filter(person =>
    person.type === group &&
    !person.delivered &&
    !carryingIds.has(person.id)
  );
}


/* =========================================================
   NÍVEL 1 — CONSCIÊNCIA+
   O documento-fonte registra a imagem 07 tanto para o ponto
   de coleta quanto para a garrafa da Fase 1. Esta versão
   preserva exatamente essa indicação do anexo.
========================================================= */
const CONSCIOUS_PHASES = [
  {
    title: "Fase 1 • Primeira coleta",
    missionTitle: "Coleta consciente",
    mission: "Encontre a garrafa, colete-a e leve-a ao ponto de reciclagem.",
    tip: "Observe a posição inicial, o item e o destino antes de montar o algoritmo.",
    size: 5,
    start: POS(0, 2),
    destinations: [
      { x: 4, y: 2, image: 7, accepts: ["all"], label: "Imagem 07 • Ponto de reciclagem" }
    ],
    items: [
      { id: "c1-07", x: 2, y: 2, image: 7, type: "all", label: "Imagem 07 • Garrafa (conforme anexo)" }
    ],
    obstacles: []
  },
  {
    title: "Fase 2 • Desvio e coleta",
    missionTitle: "Planeje antes de executar",
    mission: "Colete as imagens 01 e 02, desvie dos desafios 13 e 14 e entregue os materiais no ponto de reciclagem.",
    tip: "Nem sempre o caminho mais curto está disponível. Antecipe os obstáculos antes de executar.",
    size: 5,
    start: POS(0, 4),
    destinations: [
      { x: 4, y: 0, image: 7, accepts: ["all"], label: "Imagem 07 • Ponto de reciclagem" }
    ],
    items: [
      { id: "c2-01", x: 2, y: 0, image: 1, type: "all", label: "Imagem 01" },
      { id: "c2-02", x: 4, y: 3, image: 2, type: "all", label: "Imagem 02" }
    ],
    obstacles: [
      { x: 0, y: 2, image: 14, label: "Imagem 14 • Obstáculo" },
      { x: 2, y: 2, image: 13, label: "Imagem 13 • Obstáculo" }
    ]
  },
  {
    title: "Fase 3 • Missão avançada",
    missionTitle: "Decomponha o problema",
    mission: "Colete as imagens 01, 02 e 03 e encontre uma rota segura entre os desafios 13, 14 e 14.",
    tip: "Divida a missão em pequenas etapas: localizar, coletar, desviar e entregar.",
    size: 5,
    start: POS(0, 0),
    destinations: [
      { x: 4, y: 4, image: 7, accepts: ["all"], label: "Imagem 07 • Ponto de reciclagem" }
    ],
    items: [
      { id: "c3-01", x: 1, y: 1, image: 1, type: "all", label: "Imagem 01" },
      { id: "c3-02", x: 3, y: 0, image: 2, type: "all", label: "Imagem 02" },
      { id: "c3-03", x: 2, y: 4, image: 3, type: "all", label: "Imagem 03" }
    ],
    obstacles: [
      { x: 2, y: 2, image: 13, label: "Imagem 13 • Obstáculo" },
      { x: 0, y: 3, image: 14, label: "Imagem 14 • Obstáculo" },
      { x: 4, y: 2, image: 14, label: "Imagem 14 • Obstáculo" }
    ]
  }
];

/* =========================================================
   NÍVEL 2 — ECOTECH+
========================================================= */
const ECOTECH_PHASES = [
  {
    title: "Fase 1 • Recicláveis e rejeitos",
    missionTitle: "Classifique antes de descartar",
    mission: "Colete uma unidade das imagens 01 a 06. Leve 01, 02 e 03 ao destino 07 e 04, 05 e 06 ao destino 08.",
    tip: "Observe a categoria de cada item antes de usar o ponto de destino. Os obstáculos 13 e 14 exigem planejamento de rota.",
    size: 6,
    start: POS(2, 3),
    destinations: [
      { x: 0, y: 0, image: 7, accepts: ["recycle"], label: "Imagem 07 • Ponto de reciclagem" },
      { x: 5, y: 5, image: 8, accepts: ["reject"], label: "Imagem 08 • Rejeitos" }
    ],
    items: [
      { id: "e1-01", x: 1, y: 0, image: 1, type: "recycle", label: "Imagem 01" },
      { id: "e1-02", x: 4, y: 0, image: 2, type: "recycle", label: "Imagem 02" },
      { id: "e1-03", x: 5, y: 2, image: 3, type: "recycle", label: "Imagem 03" },
      { id: "e1-04", x: 0, y: 4, image: 4, type: "reject", label: "Imagem 04" },
      { id: "e1-05", x: 2, y: 5, image: 5, type: "reject", label: "Imagem 05" },
      { id: "e1-06", x: 4, y: 4, image: 6, type: "reject", label: "Imagem 06" }
    ],
    obstacles: [
      { x: 2, y: 1, image: 13, label: "Imagem 13 • Obstáculo" },
      { x: 3, y: 3, image: 14, label: "Imagem 14 • Obstáculo" }
    ]
  },
  {
    title: "Fase 2 • Coleta seletiva",
    missionTitle: "Cada material no destino correto",
    mission: "Colete duas unidades de cada material e utilize as quatro lixeiras corretas nos cantos do tabuleiro.",
    tip: "09 recebe 01; 10 recebe 03; 11 recebe 16; 12 recebe 02. Os obstáculos 13, 15 e 14 ficam na região central.",
    size: 6,
    start: POS(1, 3),
    destinations: [
      { x: 0, y: 0, image: 9, accepts: ["paper"], label: "Imagem 09 • Papel" },
      { x: 5, y: 0, image: 10, accepts: ["glass"], label: "Imagem 10 • Vidro" },
      { x: 0, y: 5, image: 11, accepts: ["metal"], label: "Imagem 11 • Metal" },
      { x: 5, y: 5, image: 12, accepts: ["plastic"], label: "Imagem 12 • Plástico" }
    ],
    items: [
      { id: "e2-01a", x: 1, y: 0, image: 1, type: "paper", label: "Imagem 01" },
      { id: "e2-01b", x: 2, y: 1, image: 1, type: "paper", label: "Imagem 01" },
      { id: "e2-02a", x: 5, y: 1, image: 2, type: "plastic", label: "Imagem 02" },
      { id: "e2-02b", x: 4, y: 2, image: 2, type: "plastic", label: "Imagem 02" },
      { id: "e2-03a", x: 4, y: 0, image: 3, type: "glass", label: "Imagem 03" },
      { id: "e2-03b", x: 3, y: 1, image: 3, type: "glass", label: "Imagem 03" },
      { id: "e2-16a", x: 0, y: 3, image: 16, type: "metal", label: "Imagem 16" },
      { id: "e2-16b", x: 1, y: 4, image: 16, type: "metal", label: "Imagem 16" }
    ],
    obstacles: [
      { x: 2, y: 2, image: 13, label: "Imagem 13 • Obstáculo" },
      { x: 3, y: 2, image: 15, label: "Imagem 15 • Obstáculo" },
      { x: 2, y: 3, image: 14, label: "Imagem 14 • Obstáculo" },
      { x: 3, y: 3, image: 14, label: "Imagem 14 • Obstáculo" }
    ]
  }
];

/* =========================================================
   NÍVEL 3 — HUMANO+
========================================================= */
const HUMAN_PHASES = [
  {
    title: "Fase 1 • Cuidado e dignidade",
    missionTitle: "Acolher com respeito",
    mission: "Conduza crianças, mulheres, pessoas idosas e trabalhadores aos Salões do Acolhimento correspondentes.",
    tip: "Os salões representam identidade e proteção. Eles não isolam as pessoas: todos continuam integrados à mesma comunidade.",
    positiveMessage: "Todos chegaram aos seus Salões do Acolhimento. Crianças, mulheres, pessoas idosas e trabalhadores podem ter suas necessidades reconhecidas sem perder a convivência, a participação e o pertencimento à comunidade.",
    size: 6,
    start: POS(2, 2),
    destinations: [
      { x: 0, y: 0, image: 43, accepts: ["children"], label: "Imagem 43 • Salão das crianças" },
      { x: 5, y: 0, image: 44, accepts: ["women"], label: "Imagem 44 • Salão das mulheres" },
      { x: 0, y: 5, image: 45, accepts: ["elderly"], label: "Imagem 45 • Salão dos idosos" },
      { x: 5, y: 5, image: 46, accepts: ["workers"], label: "Imagem 46 • Salão dos trabalhadores" }
    ],
    items: [
      { id: "h1-33", x: 1, y: 0, image: 33, type: "women", label: "Imagem 33" },
      { id: "h1-34", x: 4, y: 1, image: 34, type: "women", label: "Imagem 34" },
      { id: "h1-35", x: 0, y: 2, image: 35, type: "elderly", label: "Imagem 35" },
      { id: "h1-36", x: 1, y: 4, image: 36, type: "elderly", label: "Imagem 36" },
      { id: "h1-37", x: 3, y: 0, image: 37, type: "children", label: "Imagem 37" },
      { id: "h1-38", x: 5, y: 2, image: 38, type: "children", label: "Imagem 38" },
      { id: "h1-39", x: 4, y: 3, image: 39, type: "children", label: "Imagem 39" },
      { id: "h1-40", x: 0, y: 3, image: 40, type: "workers", label: "Imagem 40" },
      { id: "h1-41", x: 2, y: 5, image: 41, type: "workers", label: "Imagem 41" },
      { id: "h1-42", x: 4, y: 5, image: 42, type: "workers", label: "Imagem 42" }
    ],
    obstacles: []
  },
  {
    title: "Fase 2 • Cultura e pertencimento",
    missionTitle: "Preservar identidades sem separar",
    mission: "Conduza indígenas, sul-americanos, árabes e asiáticos aos Salões do Acolhimento indicados.",
    tip: "Acolher significa respeitar histórias e culturas, mantendo diálogo, participação e convivência entre todos.",
    positiveMessage: "Você conduziu os grupos aos Salões do Acolhimento respeitando suas identidades. Cada grupo pode preservar e compartilhar sua cultura e seus costumes sem se isolar do convívio com os demais.",
    size: 6,
    start: POS(2, 2),
    destinations: [
      { x: 0, y: 0, image: 47, accepts: ["indigenous"], label: "Imagem 47 • Salão indígena" },
      { x: 5, y: 0, image: 50, accepts: ["southamerican"], label: "Imagem 50 • Salão sul-americano" },
      { x: 0, y: 5, image: 49, accepts: ["arab"], label: "Imagem 49 • Salão árabe" },
      { x: 5, y: 5, image: 48, accepts: ["asian"], label: "Imagem 48 • Salão asiático" }
    ],
    items: [
      { id: "h2-17", x: 1, y: 0, image: 17, type: "indigenous", label: "Imagem 17" },
      { id: "h2-18", x: 1, y: 3, image: 18, type: "indigenous", label: "Imagem 18" },
      { id: "h2-19", x: 4, y: 1, image: 19, type: "asian", label: "Imagem 19" },
      { id: "h2-20", x: 5, y: 2, image: 20, type: "asian", label: "Imagem 20" },
      { id: "h2-21", x: 0, y: 3, image: 21, type: "arab", label: "Imagem 21" },
      { id: "h2-22", x: 2, y: 5, image: 22, type: "arab", label: "Imagem 22" },
      { id: "h2-23", x: 5, y: 3, image: 23, type: "southamerican", label: "Imagem 23" },
      { id: "h2-24", x: 3, y: 5, image: 24, type: "southamerican", label: "Imagem 24" }
    ],
    obstacles: []
  },
  {
    title: "Fase 3 • Memória, respeito e convivência",
    missionTitle: "Reconhecer, acolher e conviver",
    mission: "Conduza judeus, pessoas negras, ciganos e eslavos aos Salões do Acolhimento correspondentes.",
    tip: "O objetivo não é separar. É reconhecer identidades, preservar culturas e fortalecer a convivência em uma sociedade compartilhada.",
    positiveMessage: "Missão concluída. Os grupos foram acolhidos em espaços que valorizam memória, identidade e cultura. A diversidade permanece conectada pela convivência, pelo diálogo e pela igualdade de direitos.",
    size: 6,
    start: POS(2, 2),
    destinations: [
      { x: 0, y: 0, image: 51, accepts: ["jewish"], label: "Imagem 51 • Salão judeu" },
      { x: 5, y: 0, image: 52, accepts: ["black"], label: "Imagem 52 • Salão das pessoas negras" },
      { x: 0, y: 5, image: 53, accepts: ["roma"], label: "Imagem 53 • Salão cigano" },
      { x: 5, y: 5, image: 54, accepts: ["slavic"], label: "Imagem 54 • Salão eslavo" }
    ],
    items: [
      { id: "h3-25", x: 1, y: 0, image: 25, type: "jewish", label: "Imagem 25" },
      { id: "h3-26", x: 2, y: 1, image: 26, type: "jewish", label: "Imagem 26" },
      { id: "h3-27", x: 0, y: 3, image: 27, type: "roma", label: "Imagem 27" },
      { id: "h3-28", x: 1, y: 4, image: 28, type: "roma", label: "Imagem 28" },
      { id: "h3-29", x: 4, y: 1, image: 29, type: "slavic", label: "Imagem 29" },
      { id: "h3-30", x: 5, y: 2, image: 30, type: "slavic", label: "Imagem 30" },
      { id: "h3-31", x: 4, y: 3, image: 31, type: "black", label: "Imagem 31" },
      { id: "h3-32", x: 3, y: 5, image: 32, type: "black", label: "Imagem 32" }
    ],
    obstacles: []
  }
];

const LEVELS = {
  conscious: { name: "CONSCIÊNCIA+", phases: CONSCIOUS_PHASES, theme: "Cuide de si. Cuide do ambiente.", quiz: true },
  eco: { name: "ECOTECH+", phases: ECOTECH_PHASES, theme: "Planeje, programe e recicle.", quiz: true },
  human: { name: "HUMANO+", phases: HUMAN_PHASES, theme: "Acolha, respeite e conviva.", quiz: true }
};

const QUIZ_BANK = {
  conscious: [
    {
      theme: "Fase 1 — Higiene pessoal",
      questions: [
        {
          category: "HIGIENE PESSOAL",
          question: "Tomar banho todos os dias ajuda a manter o corpo limpo?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! O banho regular faz parte dos cuidados básicos de higiene e ajuda a retirar suor e sujeira do corpo."
        },
        {
          category: "SAÚDE BUCAL",
          question: "Escovar os dentes apenas quando sentimos gosto ruim na boca é suficiente?",
          options: ["MITO", "CIÊNCIA"],
          correct: 0,
          feedback: "✅ Correto! Isso é um mito. A escovação deve fazer parte da rotina diária."
        },
        {
          category: "HIGIENE E ROUPAS",
          question: "Trocar roupas íntimas e roupas suadas faz parte da higiene pessoal diária?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Trocar roupas íntimas e roupas muito suadas contribui para higiene, conforto e saúde."
        }
      ]
    },
    {
      theme: "Fase 2 — Organização e hábitos saudáveis",
      questions: [
        {
          category: "ORGANIZAÇÃO",
          question: "Organizar mochila, cadernos e materiais ajuda a evitar esquecimentos?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Reservar um momento para organizar os materiais facilita a rotina escolar."
        },
        {
          category: "SONO",
          question: "Dormir pouco durante a semana pode ser totalmente compensado dormindo mais no fim de semana?",
          options: ["MITO", "CIÊNCIA"],
          correct: 0,
          feedback: "✅ Correto! Isso é um mito. Dormir bem regularmente é importante para atenção, disposição e bem-estar."
        },
        {
          category: "ALIMENTAÇÃO",
          question: "Comer bem e beber água ajudam na disposição e na concentração?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Alimentação variada e hidratação contribuem para o funcionamento do corpo e para a concentração."
        }
      ]
    },
    {
      theme: "Fase 3 — Ambiente, lazer e convivência",
      questions: [
        {
          category: "AMBIENTE E HIGIENE",
          question: "Comer na cama pode deixar migalhas e restos de comida no local, que podem atrair insetos?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Restos e migalhas podem atrair insetos e deixar o ambiente menos higiênico.\n\n⚠️ ALERTA: A alimentação deve ser feita na mesa. Na cama ou no sofá pode atrair insetos e doenças."
        },
        {
          category: "LAZER",
          question: "Ter momentos de lazer faz parte de uma rotina saudável?",
          options: ["MITO", "CIÊNCIA"],
          correct: 1,
          feedback: "✅ Correto! O lazer pode contribuir para descanso, convivência e bem-estar quando existe equilíbrio com outras responsabilidades."
        },
        {
          category: "CONVIVÊNCIA",
          question: "Respeitar colegas e professores também significa saber discordar sem ofender?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! É possível discordar, ouvir o outro e expressar sua opinião sem ofender."
        }
      ]
    }
  ],

  eco: [
    {
      theme: "Fase 1 — Recicláveis e rejeitos",
      questions: [
        {
          category: "DESTINAÇÃO DE RESÍDUOS",
          question: "Todo material descartado pode ser colocado no mesmo recipiente?",
          options: ["SIM", "NÃO"],
          correct: 1,
          feedback: "✅ Correto! Materiais diferentes precisam receber destinos adequados. Separar os resíduos facilita o reaproveitamento e evita contaminação."
        },
        {
          category: "RECICLAGEM",
          question: "Papelão, garrafa PET e garrafa de vidro podem ser separados para reciclagem?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Papelão, plástico e vidro podem participar de processos de reciclagem quando separados adequadamente."
        },
        {
          category: "ATERROS SANITÁRIOS",
          question: "Separar corretamente recicláveis e rejeitos ajuda a reduzir o descarte inadequado?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! A separação dos resíduos contribui para o reaproveitamento de materiais, evita a contaminação e ajuda a preservar o meio ambiente, pois reduz o volume de resíduos enviados aos aterros sanitários."
        }
      ]
    },
    {
      theme: "Fase 2 — Coleta seletiva",
      questions: [
        {
          category: "PAPEL E PAPELÃO",
          question: "Qual cor representa papel e papelão no jogo?",
          options: ["AZUL", "VERDE", "VERMELHO"],
          correct: 0,
          feedback: "✅ Correto! A lixeira azul é utilizada para papel e papelão."
        },
        {
          category: "PLÁSTICO",
          question: "Em qual lixeira deve ser colocada uma garrafa PET?",
          options: ["VERDE", "VERMELHA", "AMARELA"],
          correct: 1,
          feedback: "✅ Correto! No sistema de coleta seletiva trabalhado no jogo, o vermelho corresponde ao plástico."
        },
        {
          category: "VIDRO",
          question: "Qual associação está correta?",
          options: ["VERDE — VIDRO", "AMARELO — PAPEL", "AZUL — PLÁSTICO"],
          correct: 0,
          feedback: "✅ Correto! Verde corresponde ao vidro. Reconhecer as categorias facilita a separação correta dos materiais."
        }
      ]
    }
  ],

  human: [
    {
      theme: "Fase 1 — Crianças, mulheres, idosos e trabalhadores",
      questions: [
        {
          category: "DIGNIDADE E RESPEITO",
          question: "Crianças, mulheres, idosos e trabalhadores possuem os mesmos direitos fundamentais à dignidade e ao respeito?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Os direitos humanos pertencem a todas as pessoas. Idade, gênero ou atividade profissional não diminuem a dignidade de ninguém."
        },
        {
          category: "PARTICIPAÇÃO",
          question: "Uma pessoa idosa deve ser excluída das decisões da comunidade apenas por causa da idade?",
          options: ["SIM", "NÃO"],
          correct: 1,
          feedback: "✅ Correto! Envelhecer não elimina o direito de participar, opinar, conviver e ser respeitado."
        },
        {
          category: "TRABALHO E SOCIEDADE",
          question: "Valorizar trabalhadores significa reconhecer que diferentes profissões contribuem para a sociedade?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Todo trabalho digno merece respeito. Diferentes profissões desempenham funções importantes para a vida coletiva."
        }
      ]
    },
    {
      theme: "Fase 2 — Povos indígenas, imigrantes sul-americanos, árabes e asiáticos",
      questions: [
        {
          category: "CULTURA E PERTENCIMENTO",
          question: "Uma pessoa precisa abandonar sua cultura para participar plenamente da sociedade em que vive?",
          options: ["SIM", "NÃO"],
          correct: 1,
          feedback: "✅ Correto! Uma pessoa pode preservar sua identidade, seus costumes e suas tradições e, ao mesmo tempo, conviver e participar da sociedade."
        },
        {
          category: "SALÕES DO ACOLHIMENTO",
          question: "O Salão do Acolhimento foi criado no jogo para separar os grupos uns dos outros?",
          options: ["SIM", "NÃO"],
          correct: 1,
          feedback: "✅ Correto! O Salão do Acolhimento simboliza reconhecimento e valorização da identidade.\n\n⚠️ ALERTA PEDAGÓGICO: acolhimento não é separação; preservar culturas e costumes não significa impedir o convívio entre pessoas diferentes."
        },
        {
          category: "CONVIVÊNCIA INTERCULTURAL",
          question: "Conviver com pessoas de diferentes culturas pode ampliar conhecimentos e experiências?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! A convivência intercultural permite compartilhar conhecimentos, histórias, tradições e diferentes formas de compreender o mundo."
        }
      ]
    },
    {
      theme: "Fase 3 — Judeus, negros, ciganos e eslavos",
      questions: [
        {
          category: "DIREITOS HUMANOS",
          question: "Perseguir uma pessoa por sua origem étnica, cultural ou religiosa viola os direitos humanos?",
          options: ["VERDADEIRO", "FALSO"],
          correct: 0,
          feedback: "✅ Correto! Ninguém deve ser perseguido ou discriminado por sua origem, cultura, religião ou pertencimento a determinado grupo."
        },
        {
          category: "RESPEITO À DIVERSIDADE",
          question: "Respeitar uma cultura diferente significa que precisamos abandonar a nossa própria cultura?",
          options: ["SIM", "NÃO"],
          correct: 1,
          feedback: "✅ Correto! Diferentes identidades podem coexistir. Respeitar a cultura do outro não exige abandonar a própria."
        },
        {
          category: "PARTICIPAÇÃO E CONVIVÊNCIA",
          question: "Qual atitude fortalece os direitos humanos?",
          options: ["IMPEDIR GRUPOS DIFERENTES DE CONVIVER", "RESPEITAR DIFERENÇAS E GARANTIR PARTICIPAÇÃO", "OBRIGAR TODAS AS PESSOAS A TER OS MESMOS COSTUMES"],
          correct: 1,
          feedback: "✅ Correto! Uma sociedade democrática permite diferenças e busca garantir dignidade, participação, respeito e convivência."
        }
      ]
    }
  ]
};

let progress = {
  consciousUnlockedPhase: 0,
  consciousComplete: false,
  ecoUnlocked: false,
  ecoUnlockedPhase: 0,
  ecoComplete: false,
  humanUnlocked: false,
  humanUnlockedPhase: 0,
  humanComplete: false
};

let currentLevelKey = "conscious";
let currentPhaseIndex = 0;
let robot = { x: 0, y: 0 };
let items = [];
let carrying = [];
let delivered = new Set();
let queue = [];
let executions = 0;
let errors = 0;
let executing = false;
let phaseCompleted = false;
let pendingAdvance = false;
let currentQuizIndex = 0;
let quizAnswered = false;
let quizCorrect = 0;
let boundaryTimer = null;
let passwordTarget = null;
let runtimePhase = null;

// Proteção de entrada: cada toque/clique deve gerar apenas UM comando.
// Filtra duplicações muito rápidas do mesmo comando sem alterar a lógica do algoritmo.
const COMMAND_INPUT_GUARD_MS = 140;
let lastCommandInput = { command: null, time: 0 };

const $ = id => document.getElementById(id);

window.addEventListener("DOMContentLoaded", () => {
  restoreProgress();
  bindEvents();
  refreshHome();
});

function bindEvents() {
  $("startConsciousBtn").onclick = () => startLevel("conscious", Math.min(progress.consciousUnlockedPhase, 2));
  $("homeConsciousBtn").onclick = () => startLevel("conscious", Math.min(progress.consciousUnlockedPhase, 2));
  $("homeEcoBtn").onclick = tryOpenEco;
  $("homeHumanBtn").onclick = tryOpenHuman;

  $("helpBtn").onclick = openHelp;
  $("quickHelpBtn").onclick = openHelp;
  $("closeHelpBtn").onclick = closeHelp;
  $("closeHelpBottomBtn").onclick = closeHelp;
  $("backHomeBtn").onclick = goHome;

  document.querySelectorAll("[data-command]").forEach(button => {
    button.onclick = event => {
      event.preventDefault();
      addCommand(button.dataset.command, "button");
    };
  });

  $("executeBtn").onclick = runQueue;
  $("undoBtn").onclick = undoCommand;
  $("clearBtn").onclick = clearQueue;
  $("resetBtn").onclick = resetPhase;

  $("viewerCloseBtn").onclick = closeViewer;
  $("imageViewer").onclick = event => {
    if (event.target === $("imageViewer")) closeViewer();
  };

  $("passwordBtn").onclick = () => openPasswordModal(null);
  $("closePasswordBtn").onclick = () => $("passwordModal").classList.add("hidden");
  $("passwordConfirmBtn").onclick = confirmPassword;
  $("passwordInput").addEventListener("keydown", event => {
    if (event.key === "Enter") confirmPassword();
  });

  $("quizNextBtn").onclick = nextQuizStep;
  $("continueBtn").onclick = continueAfterResult;
  $("humanIntroStartBtn").onclick = () => {
    $("humanIntroModal").classList.add("hidden");
    startLevel("human", Math.min(progress.humanUnlockedPhase, 2));
  };
  $("finalHomeBtn").onclick = () => {
    $("finalModal").classList.add("hidden");
    goHome();
  };

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!$("imageViewer").classList.contains("hidden")) return closeViewer();
      if (!$("helpModal").classList.contains("hidden")) return closeHelp();
      if (!$("passwordModal").classList.contains("hidden")) return $("passwordModal").classList.add("hidden");
      return;
    }

    if ($("gameScreen").classList.contains("hidden") || executing) return;
    const keyMap = {
      ArrowUp: "MOVE_UP",
      ArrowDown: "MOVE_DOWN",
      ArrowLeft: "MOVE_LEFT",
      ArrowRight: "MOVE_RIGHT"
    };
    if (keyMap[event.key]) {
      event.preventDefault();
      // Evita que manter a tecla pressionada gere dois ou mais avanços.
      if (event.repeat) return;
      addCommand(keyMap[event.key], "keyboard");
    }
  });
}

function refreshHome() {
  const consciousDone = progress.consciousComplete;
  const ecoAvailable = progress.ecoUnlocked || consciousDone;
  const humanAvailable = progress.humanUnlocked || progress.ecoComplete;

  $("consciousStatus").textContent = consciousDone ? "Concluído ✓" : `Fase ${progress.consciousUnlockedPhase + 1} disponível`;
  $("ecoStatus").textContent = progress.ecoComplete ? "Concluído ✓" : ecoAvailable ? `Fase ${progress.ecoUnlockedPhase + 1} disponível` : "Bloqueado";
  $("humanStatus").textContent = progress.humanComplete ? "Concluído ✓" : humanAvailable ? `Fase ${progress.humanUnlockedPhase + 1} disponível` : "Bloqueado";

  $("homeEcoBtn").classList.toggle("available", ecoAvailable);
  $("homeHumanBtn").classList.toggle("available", humanAvailable);
}

function tryOpenEco() {
  if (!(progress.ecoUnlocked || progress.consciousComplete)) {
    openPasswordModal("eco");
    return;
  }
  startLevel("eco", Math.min(progress.ecoUnlockedPhase, ECOTECH_PHASES.length - 1));
}

function tryOpenHuman() {
  if (!(progress.humanUnlocked || progress.ecoComplete)) {
    openPasswordModal("human");
    return;
  }
  $("humanIntroModal").classList.remove("hidden");
}

function openPasswordModal(target = null) {
  passwordTarget = target;
  $("passwordFeedback").textContent = "";
  $("passwordInput").value = "";
  $("passwordModal").classList.remove("hidden");
  setTimeout(() => $("passwordInput").focus(), 50);
}

function confirmPassword() {
  if ($("passwordInput").value.trim() === SPECIAL_PASSWORD) {
    progress.ecoUnlocked = true;
    progress.humanUnlocked = true;
    saveProgress();
    refreshHome();
    $("passwordModal").classList.add("hidden");

    const target = passwordTarget;
    passwordTarget = null;

    if (target === "eco") {
      startLevel("eco", Math.min(progress.ecoUnlockedPhase, ECOTECH_PHASES.length - 1));
      return;
    }
    if (target === "human") {
      $("humanIntroModal").classList.remove("hidden");
      return;
    }

    showHomeMessage("✅ ECOTECH+ e HUMANO+ foram desbloqueados com a senha especial.");
    return;
  }
  $("passwordFeedback").textContent = "Senha incorreta. Tente novamente.";
}

function showHomeMessage(message) {
  alert(message);
}

function startLevel(levelKey, phaseIndex = 0) {
  const level = LEVELS[levelKey];
  if (!level) return;
  currentLevelKey = levelKey;
  currentPhaseIndex = Math.max(0, Math.min(phaseIndex, level.phases.length - 1));
  $("homeScreen").classList.add("hidden");
  $("gameScreen").classList.remove("hidden");
  loadPhase();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function loadPhase() {
  const level = LEVELS[currentLevelKey];
  const basePhase = level.phases[currentPhaseIndex];
  runtimePhase = buildRuntimePhase(basePhase);
  runtimePhase.size = expectedBoardSize(currentLevelKey);
  const phase = runtimePhase;

  robot = { ...phase.start };
  items = phase.items.map(item => ({ ...item, collected: false, delivered: false }));
  carrying = [];
  delivered = new Set();
  queue = [];
  executions = 0;
  errors = 0;
  executing = false;
  phaseCompleted = false;
  pendingAdvance = false;
  hideBoundaryAlert();

  $("levelEyebrow").textContent = `NÍVEL ${level.name}`;
  $("stageTitle").textContent = phase.title;
  $("missionTitle").textContent = phase.missionTitle;
  $("missionText").textContent = phase.mission;
  $("missionTip").textContent = phase.tip;
  $("boardSizeLabel").textContent = `${phase.size} × ${phase.size}`;
  $("board").className = `board grid-${phase.size}`;
  $("humanBanner").classList.toggle("hidden", currentLevelKey !== "human");
  $("carryLabel").textContent = currentLevelKey === "human" ? "Acompanhando" : "Carregando";

  // O botão verde sempre representa uma ação em duas etapas:
  // 1) coletar/acompanhar no local do item ou da pessoa;
  // 2) entregar no destino correto.
  const actionButton = $("actionCommandBtn");
  if (actionButton) {
    if (currentLevelKey === "human") {
      actionButton.title = "Acompanhar / Entregar no Salão";
      actionButton.setAttribute("aria-label", "Acompanhar pessoa ou entregar grupo no Salão do Acolhimento");
    } else {
      actionButton.title = "Coletar / Entregar";
      actionButton.setAttribute("aria-label", "Coletar objeto ou entregar no destino correto");
    }
  }

  renderPhaseDots();
  renderBoard();
  renderQueue();
  updateStats();
  setFeedback("💬", "Observe antes de agir", currentLevelKey === "human"
    ? "Um grupo por vez: ✓ nas pessoas e ✓ no Salão correto."
    : currentLevelKey === "eco"
      ? "Observe o tabuleiro e planeje antes de executar."
      : "Planeje antes de executar.", "info");
}

function renderPhaseDots() {
  const level = LEVELS[currentLevelKey];
  const container = $("phaseDots");
  container.innerHTML = "";
  level.phases.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "phase-dot";
    if (index === currentPhaseIndex) dot.classList.add("active");
    if (index < getUnlockedPhase(currentLevelKey)) dot.classList.add("done");
    container.appendChild(dot);
  });
}

function getUnlockedPhase(levelKey) {
  if (levelKey === "conscious") return progress.consciousUnlockedPhase;
  if (levelKey === "eco") return progress.ecoUnlockedPhase;
  return progress.humanUnlockedPhase;
}

function currentPhase() {
  return runtimePhase || LEVELS[currentLevelKey].phases[currentPhaseIndex];
}

function clonePhase(basePhase) {
  return {
    ...basePhase,
    start: { ...basePhase.start },
    destinations: basePhase.destinations.map(entry => ({ ...entry, accepts: [...entry.accepts] })),
    items: basePhase.items.map(entry => ({ ...entry })),
    obstacles: basePhase.obstacles.map(entry => ({ ...entry }))
  };
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function cellKey(x, y) {
  return `${x},${y}`;
}

function allRelevantCellsReachable(phase) {
  const blocked = new Set(phase.obstacles.map(o => cellKey(o.x, o.y)));
  const queueCells = [{ ...phase.start }];
  const visited = new Set([cellKey(phase.start.x, phase.start.y)]);

  while (queueCells.length) {
    const cell = queueCells.shift();
    const neighbors = [
      { x: cell.x + 1, y: cell.y },
      { x: cell.x - 1, y: cell.y },
      { x: cell.x, y: cell.y + 1 },
      { x: cell.x, y: cell.y - 1 }
    ];

    neighbors.forEach(next => {
      if (next.x < 0 || next.y < 0 || next.x >= phase.size || next.y >= phase.size) return;
      const key = cellKey(next.x, next.y);
      if (blocked.has(key) || visited.has(key)) return;
      visited.add(key);
      queueCells.push(next);
    });
  }

  return [...phase.items, ...phase.destinations].every(entry => visited.has(cellKey(entry.x, entry.y)));
}

function randomizePhasePositions(phase, { randomizeObstacles = false } = {}) {
  const fixed = new Set([
    cellKey(phase.start.x, phase.start.y),
    ...phase.destinations.map(d => cellKey(d.x, d.y))
  ]);

  for (let attempt = 0; attempt < 160; attempt++) {
    const candidate = clonePhase(phase);
    let pool = [];
    for (let y = 0; y < candidate.size; y++) {
      for (let x = 0; x < candidate.size; x++) {
        if (!fixed.has(cellKey(x, y))) pool.push({ x, y });
      }
    }
    pool = shuffle(pool);

    if (randomizeObstacles) {
      candidate.obstacles.forEach(obstacle => {
        const pos = pool.pop();
        obstacle.x = pos.x;
        obstacle.y = pos.y;
      });
    } else {
      const obstacleKeys = new Set(candidate.obstacles.map(o => cellKey(o.x, o.y)));
      pool = pool.filter(pos => !obstacleKeys.has(cellKey(pos.x, pos.y)));
    }

    candidate.items.forEach(item => {
      const pos = pool.pop();
      item.x = pos.x;
      item.y = pos.y;
    });

    if (allRelevantCellsReachable(candidate)) return candidate;
  }

  return clonePhase(phase);
}

function buildRuntimePhase(basePhase) {
  const phase = clonePhase(basePhase);
  phase.size = expectedBoardSize(currentLevelKey);

  // No CONSCIÊNCIA+ o desenho do percurso permanece estável.
  if (currentLevelKey === "conscious") return phase;

  // ECOTECH+: itens e barreiras mudam de lugar em toda entrada/reinício.
  if (currentLevelKey === "eco") {
    return randomizePhasePositions(phase, { randomizeObstacles: true });
  }

  // HUMANO+: os Salões permanecem nos cantos e as pessoas mudam de posição.
  if (currentLevelKey === "human") {
    return randomizePhasePositions(phase, { randomizeObstacles: false });
  }

  return phase;
}

function createImage(number, label) {
  const image = document.createElement("img");
  const displayName = imageName(number);
  image.src = asset(number);
  image.alt = displayName;
  image.title = `${displayName} — clique para ampliar`;
  image.className = "cell-image";
  image.loading = "eager";
  image.onclick = event => {
    event.stopPropagation();
    openViewer(number);
  };
  image.onerror = () => {
    image.style.display = "none";
    const fallback = image.parentElement?.querySelector(".image-fallback");
    if (fallback) fallback.hidden = false;
  };
  return image;
}

function addVisual(cell, number, label) {
  // A imagem fica dentro de uma moldura própria.
  // Isso impede que qualquer JPG ultrapasse os limites da célula.
  const visualBox = document.createElement("div");
  visualBox.className = "visual-box";

  const fallback = document.createElement("div");
  fallback.className = "image-fallback";
  fallback.textContent = assetFileName(number);
  fallback.hidden = true;

  visualBox.appendChild(fallback);
  visualBox.appendChild(createImage(number, label));
  cell.appendChild(visualBox);
}

function renderBoard() {
  const phase = currentPhase();
  const board = $("board");
  board.innerHTML = "";

  for (let y = 0; y < phase.size; y++) {
    for (let x = 0; x < phase.size; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;

      const destination = phase.destinations.find(entry => entry.x === x && entry.y === y);
      const obstacle = phase.obstacles.find(entry => entry.x === x && entry.y === y);
      const item = items.find(entry => entry.x === x && entry.y === y && !entry.collected && !entry.delivered);

      if (destination) {
        cell.classList.add("dest");
        addVisual(cell, destination.image, destination.label);

        const deliveredHere = deliveredCountAtDestination(destination);
        if (deliveredHere > 0) {
          const badge = document.createElement("span");
          badge.className = "delivery-badge";
          badge.textContent = `✓ ${deliveredHere}`;
          badge.title = currentLevelKey === "human"
            ? `${deliveredHere} pessoa(s) acolhida(s) neste Salão`
            : `${deliveredHere} objeto(s) entregue(s) neste destino`;
          cell.appendChild(badge);
        }
      }

      if (obstacle) {
        cell.classList.add("obstacle");
        addVisual(cell, obstacle.image, obstacle.label);
      }

      if (item) {
        addVisual(cell, item.image, item.label);
      }

      if (robot.x === x && robot.y === y) {
        const robotPiece = document.createElement("div");
        robotPiece.className = "robot-piece";
        robotPiece.setAttribute("aria-label", "Prof. Léia");
        robotPiece.innerHTML = `🤖<span class="robot-badge">LÉIA</span>`;
        cell.appendChild(robotPiece);
      }

      board.appendChild(cell);
    }
  }
}

function openViewer(number) {
  const displayName = imageName(number);
  $("viewerImage").src = asset(number);
  $("viewerImage").alt = displayName;
  $("viewerLabel").textContent = displayName;
  const viewerFile = $("viewerFile");
  if (viewerFile) viewerFile.textContent = `Arquivo: ${assetFileName(number)}`;
  $("imageViewer").classList.remove("hidden");
}

function closeViewer() {
  $("imageViewer").classList.add("hidden");
}

function addCommand(command, source = "program") {
  if (executing || phaseCompleted) return;
  if (!COMMANDS[command]) return;

  // Consistência de entrada: um toque/clique deve acrescentar apenas um token.
  if (source === "button" || source === "keyboard") {
    const now = performance.now();
    if (
      lastCommandInput.command === command &&
      now - lastCommandInput.time < COMMAND_INPUT_GUARD_MS
    ) {
      return;
    }
    lastCommandInput = { command, time: now };
  }

  if (queue.length >= 60) {
    setFeedback("⚠️", "Limite atingido", "Máximo de 60 comandos.", "warning");
    return;
  }

  queue.push(command);
  renderQueue();
}

function undoCommand() {
  if (executing || queue.length === 0) return;
  queue.pop();
  renderQueue();
}

function clearQueue() {
  if (executing) return;
  queue = [];
  renderQueue();
  setFeedback("⌫", "Algoritmo limpo", "Monte uma nova sequência.", "info");
}

function resetPhase() {
  if (executing) return;
  loadPhase();
  setFeedback(
    "↻",
    "Fase reiniciada",
    currentLevelKey === "conscious"
      ? "Prof. Léia voltou ao início."
      : "Prof. Léia voltou ao início. O tabuleiro mudou.",
    "info"
  );
}

function renderQueue(activeIndex = -1) {
  const container = $("commandQueue");
  container.innerHTML = "";

  if (queue.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-queue";
    empty.textContent = "Nenhum comando adicionado.";
    container.appendChild(empty);
  }

  queue.forEach((command, index) => {
    const token = document.createElement("div");
    token.className = `command-token${command === "ACTION" ? " action" : ""}${index === activeIndex ? " active" : ""}`;
    token.textContent = COMMANDS[command].symbol;
    token.title = `${index + 1}. ${command}`;
    container.appendChild(token);
  });

  $("queueCount").textContent = queue.length;
}

async function runQueue() {
  if (executing || phaseCompleted) return;
  if (queue.length === 0) {
    setFeedback("⚠️", "Algoritmo vazio", "Adicione ao menos um comando.", "warning");
    return;
  }

  executing = true;
  executions += 1;
  updateStats();
  setControlsDisabled(true);

  // Registra o que realmente aconteceu nesta execução. Isso evita que uma
  // entrega bem-sucedida seja apagada por uma mensagem genérica no final.
  const summary = {
    collected: 0,
    accompanied: 0,
    delivered: 0,
    humanDelivered: 0
  };

  // Executa uma cópia imutável da fila: um token visível = uma ação.
  const executionQueue = queue.slice();

  for (let i = 0; i < executionQueue.length; i++) {
    renderQueue(i);
    const result = executeSingleCommand(executionQueue[i]);

    if (result.ok) {
      if (result.kind === "collect") summary.collected += 1;
      if (result.kind === "accompany") summary.accompanied += 1;
      if (result.kind === "delivery") summary.delivered += Number(result.deliveredCount || 0);
      if (result.kind === "human-delivery") summary.humanDelivered += Number(result.deliveredCount || 0);
    }

    renderBoard();
    updateStats();
    await sleep(360);

    if (!result.ok) {
      errors += 1;
      updateStats();

      if (result.kind === "boundary") {
        setFeedback(
          "🛠️",
          "Revise a rota",
          "A direção sai do tabuleiro. Corrija o comando.",
          "error"
        );
      } else {
        setFeedback(
          "🛠️",
          "Revise o algoritmo",
          `${result.message} Corrija e tente novamente.`,
          "error"
        );
      }

      executing = false;
      setControlsDisabled(false);
      renderQueue();
      return;
    }

    if (isPhaseComplete()) {
      executing = false;
      phaseCompleted = true;
      setControlsDisabled(false);
      renderQueue();
      finishPhase();
      return;
    }
  }

  executing = false;
  setControlsDisabled(false);
  renderQueue();

  // Preserva a informação pedagogicamente mais importante da execução.
  // Entrega > acompanhamento/coleta > orientação de missão incompleta.
  const feedback = buildExecutionFeedback(summary);
  setFeedback(feedback.icon, feedback.title, feedback.text, feedback.type);
}

function executeSingleCommand(command) {
  if (command === "ACTION") return handleAction();
  const info = COMMANDS[command];
  return tryMove(robot.x + info.dx, robot.y + info.dy);
}

function tryMove(newX, newY) {
  const phase = currentPhase();
  if (newX < 0 || newX >= phase.size || newY < 0 || newY >= phase.size) {
    showBoundaryAlert("Limite do tabuleiro. Revise a direção.");
    return { ok: false, kind: "boundary", message: "Limite do tabuleiro." };
  }

  if (phase.obstacles.some(obstacle => obstacle.x === newX && obstacle.y === newY)) {
    return { ok: false, kind: "obstacle", message: "Há uma barreira nessa rota." };
  }

  robot = { x: newX, y: newY };
  return { ok: true };
}

function showBoundaryAlert(message) {
  const box = $("boundaryAlert");
  const text = $("boundaryAlertText");
  if (!box || !text) return;

  text.textContent = message;
  box.classList.remove("hidden");

  clearTimeout(boundaryTimer);
  boundaryTimer = setTimeout(() => {
    box.classList.add("hidden");
  }, 5200);
}

function hideBoundaryAlert() {
  clearTimeout(boundaryTimer);
  const box = $("boundaryAlert");
  if (box) box.classList.add("hidden");
}

function itemAtRobot() {
  return items.find(item =>
    !item.collected &&
    !item.delivered &&
    item.x === robot.x &&
    item.y === robot.y
  ) || null;
}

function destinationAtRobot() {
  const phase = currentPhase();
  return phase.destinations.find(destination =>
    destination.x === robot.x && destination.y === robot.y
  ) || null;
}

function carriedEntries() {
  return carrying
    .map(id => items.find(item => item.id === id))
    .filter(Boolean)
    .filter(item => !item.delivered);
}

function activeHumanGroup() {
  const people = carriedEntries();
  return people.length ? people[0].type : null;
}

function destinationAccepts(destination, item) {
  return Boolean(
    destination &&
    item &&
    (destination.accepts.includes(item.type) || destination.accepts.includes("all"))
  );
}

function deliveredCountAtDestination(destination) {
  return items.filter(item => item.delivered && destinationAccepts(destination, item)).length;
}

function buildExecutionFeedback(summary) {
  const remaining = Math.max(0, items.length - delivered.size);

  if (summary.humanDelivered > 0) {
    return {
      icon: "🤝",
      title: "Grupo acolhido!",
      text: `${summary.humanDelivered} pessoa(s) entregues. Faltam ${remaining}. Escolha o próximo grupo.`,
      type: "success"
    };
  }

  if (summary.delivered > 0) {
    return {
      icon: "♻️",
      title: "Entrega correta",
      text: `${summary.delivered} objeto(s) entregues. Faltam ${remaining}.`,
      type: "success"
    };
  }

  if (summary.accompanied > 0) {
    const group = activeHumanGroup();
    const carriedCount = group ? humanGroupCarried(group).length : carriedEntries().length;
    const totalCount = group ? humanGroupMembers(group).length : carriedCount;
    const pendingCount = Math.max(0, totalCount - carriedCount);
    return {
      icon: "🤝",
      title: "Acompanhamento",
      text: pendingCount > 0
        ? `${humanGroupLabel(group)}: ${carriedCount}/${totalCount}. Faltam ${pendingCount}.`
        : `Grupo completo. Vá ao Salão correto e use ✓.`,
      type: "success"
    };
  }

  if (summary.collected > 0) {
    return {
      icon: "🎒",
      title: "Coleta realizada",
      text: `${summary.collected} objeto(s) coletados. Leve ao destino e use ✓.`,
      type: "success"
    };
  }

  return {
    icon: "🔧",
    title: "Continue a missão",
    text: getIncompleteMessage(),
    type: "warning"
  };
}

function collectOrAccompany(itemHere) {
  if (!itemHere) return { ok: false, message: "Nenhum item disponível nesta posição." };

  if (currentLevelKey === "human") {
    const activeGroup = activeHumanGroup();

    // HUMANO+: somente UM grupo pode ser acompanhado por vez.
    // É permitido reunir todas as pessoas daquele mesmo grupo antes da entrega.
    if (activeGroup && itemHere.type !== activeGroup) {
      return {
        ok: false,
        kind: "wrong-human-group",
        message: "Conclua o grupo atual antes de iniciar outro."
      };
    }
  }

  itemHere.collected = true;
  if (!carrying.includes(itemHere.id)) carrying.push(itemHere.id);

  if (currentLevelKey === "human") {
    const group = itemHere.type;
    const count = humanGroupCarried(group).length;
    const total = humanGroupMembers(group).length;
    const pending = Math.max(0, total - count);
    setFeedback(
      "🤝",
      "Pessoa acompanhada",
      pending > 0
        ? `${humanGroupLabel(group)}: ${count}/${total}. Faltam ${pending}.`
        : `Grupo completo: ${count}/${total}. Vá ao Salão e use ✓.`,
      "success"
    );
  } else {
    setFeedback(
      "🎒",
      "Objeto coletado",
      `${itemHere.label}. Leve ao destino correto e use ✓.`,
      "success"
    );
  }

  return {
    ok: true,
    kind: currentLevelKey === "human" ? "accompany" : "collect",
    itemId: itemHere.id,
    itemType: itemHere.type,
    image: itemHere.image
  };
}

function deliverAtDestination(destination) {
  const carried = carriedEntries();

  if (!destination) {
    return { ok: false, message: "Nenhum destino disponível nesta posição." };
  }

  if (carried.length === 0) {
    return {
      ok: false,
      kind: "empty-delivery",
      message: currentLevelKey === "human"
        ? "Você chegou ao Salão do Acolhimento sem estar acompanhando nenhuma pessoa."
        : "Você chegou ao destino sem carregar nenhum objeto."
    };
  }

  // No HUMANO+ só existe um grupo ativo por vez. Portanto, o salão
  // precisa aceitar o grupo inteiro; um único ✓ entrega todas as pessoas
  // acompanhadas daquele grupo.
  if (currentLevelKey === "human") {
    const group = activeHumanGroup();
    const correctSalon = destination.accepts.includes(group) || destination.accepts.includes("all");

    const pendingPeople = humanGroupPending(group);
    if (pendingPeople.length > 0) {
      return {
        ok: false,
        kind: "incomplete-human-group",
        message: `Grupo incompleto. Faltam ${pendingPeople.length} pessoa(s).`
      };
    }

    if (!correctSalon) {
      return {
        ok: false,
        kind: "wrong-human-salon",
        message: "Salão incorreto. Leve o grupo ao Salão correspondente."
      };
    }

    const toDeliver = carried.filter(person => person.type === group);
    toDeliver.forEach(person => {
      person.delivered = true;
      delivered.add(person.id);
    });
    const deliveredIds = new Set(toDeliver.map(person => person.id));
    carrying = carrying.filter(id => !deliveredIds.has(id));

    setFeedback(
      "🤝",
      "Grupo acolhido!",
      `${toDeliver.length} pessoa(s) chegaram ao Salão correto. Escolha o próximo grupo.`,
      "success"
    );

    return {
      ok: true,
      kind: "human-delivery",
      deliveredCount: toDeliver.length,
      group,
      destinationImage: destination.image
    };
  }

  // CONSCIÊNCIA+ e ECOTECH+: o mesmo botão verde entrega somente os
  // objetos compatíveis com a lixeira/ponto de destino onde a Prof. Léia está.
  const compatible = carried.filter(item => destinationAccepts(destination, item));

  if (compatible.length === 0) {
    return {
      ok: false,
      kind: "wrong-destination",
      message: "Destino incorreto para o objeto carregado."
    };
  }

  compatible.forEach(item => {
    item.delivered = true;
    delivered.add(item.id);
  });
  const deliveredIds = new Set(compatible.map(item => item.id));
  carrying = carrying.filter(id => !deliveredIds.has(id));

  const remainingCarried = carriedEntries().length;
  setFeedback(
    "♻️",
    "Entrega correta",
    remainingCarried > 0
      ? `${compatible.length} entregue(s). Ainda carrega ${remainingCarried}.`
      : `${compatible.length} objeto(s) entregue(s).`,
    "success"
  );

  return {
    ok: true,
    kind: "delivery",
    deliveredCount: compatible.length,
    destinationImage: destination.image
  };
}

function handleAction() {
  // Prioridade 1: se houver um item/pessoa sob a Prof. Léia, o ✓ coleta/acompanha.
  const itemHere = itemAtRobot();
  if (itemHere) return collectOrAccompany(itemHere);

  // Prioridade 2: se ela estiver sobre um destino, o mesmo ✓ faz a entrega.
  const destination = destinationAtRobot();
  if (destination) return deliverAtDestination(destination);

  return {
    ok: false,
    kind: "nothing-here",
    message: currentLevelKey === "human"
      ? "Nada para acompanhar ou entregar nesta posição."
      : "Nada para coletar ou entregar nesta posição."
  };
}

function isPhaseComplete() {
  return items.length > 0 && delivered.size === items.length;
}

function getIncompleteMessage() {
  const remaining = items.length - delivered.size;

  if (carrying.length > 0) {
    if (currentLevelKey === "human") {
      const group = activeHumanGroup();
      const carriedCount = group ? humanGroupCarried(group).length : carrying.length;
      const totalCount = group ? humanGroupMembers(group).length : carriedCount;
      const pendingCount = Math.max(0, totalCount - carriedCount);
      return pendingCount > 0
        ? `${humanGroupLabel(group)}: ${carriedCount}/${totalCount}. Faltam ${pendingCount}.`
        : `Grupo completo. Vá ao Salão correto e use ✓.`;
    }
    return `Carregando ${carrying.length}. Faltam ${remaining} entrega(s).`;
  }

  return currentLevelKey === "human"
    ? `Faltam ${remaining} pessoa(s). Escolha um grupo.`
    : `Faltam ${remaining} item(ns).`;
}

function updateStats() {
  $("executionStat").textContent = executions;
  $("errorStat").textContent = errors;
  $("deliveredStat").textContent = `${delivered.size}/${items.length}`;

  if (currentLevelKey === "human" && carrying.length > 0) {
    const group = activeHumanGroup();
    const current = humanGroupCarried(group).length;
    const total = humanGroupMembers(group).length;
    $("carryStat").textContent = `${current}/${total}`;
    $("carryLabel").textContent = `Acompanhando • ${humanGroupLabel(group)}`;
  } else {
    $("carryStat").textContent = carrying.length;
    $("carryLabel").textContent = currentLevelKey === "human" ? "Acompanhando" : "Carregando";
  }

  $("remainingStat").textContent = Math.max(0, items.length - delivered.size);
}

function setControlsDisabled(disabled) {
  document.querySelectorAll("[data-command]").forEach(button => button.disabled = disabled);
  $("executeBtn").disabled = disabled;
  $("undoBtn").disabled = disabled;
  $("clearBtn").disabled = disabled;
  $("resetBtn").disabled = disabled;
}

function setFeedback(icon, title, text, type = "info") {
  $("feedbackIcon").textContent = icon;
  $("feedbackTitle").textContent = title;
  $("feedbackText").textContent = text;
  $("feedback").className = `feedback ${type}`;
}

function calculateRank() {
  if (errors > 0) {
    return {
      icon: "🔧",
      title: "Jogada Básica",
      text: "Houve erros durante a missão e foi necessário depurar o algoritmo. Corrigir, testar novamente e aprender com o erro faz parte do pensamento computacional."
    };
  }
  if (executions === 1) {
    return {
      icon: "⚡",
      title: "Jogada dos Deuses",
      text: "Você concluiu toda a missão em uma única execução e sem cometer erros. Excelente planejamento!"
    };
  }
  return {
    icon: "⭐",
    title: "Jogada Excelente",
    text: "Você concluiu a missão sem erros, mesmo utilizando mais de uma execução para organizar e completar o percurso."
  };
}

function finishPhase() {
  const rank = calculateRank();
  const phase = currentPhase();
  pendingAdvance = true;

  $("resultIcon").textContent = rank.icon;
  $("resultTitle").textContent = rank.title;
  $("resultText").textContent = rank.text;

  const extra = $("resultExtra");
  extra.innerHTML = "";

  if (currentLevelKey === "human") {
    const positive = document.createElement("div");
    positive.className = "human-principle";
    positive.innerHTML = `<strong>🤝 Missão de acolhimento concluída</strong><span>${escapeHtml(phase.positiveMessage)}</span>`;
    extra.appendChild(positive);
  }

  const legend = document.createElement("div");
  legend.className = "rank-legend";
  legend.innerHTML = `
    <div><strong>🔧 Jogada Básica</strong><span>Houve erro e foi preciso depurar.</span></div>
    <div><strong>⭐ Jogada Excelente</strong><span>Sem erros, mesmo em mais de uma execução.</span></div>
    <div><strong>⚡ Jogada dos Deuses</strong><span>Uma única execução e nenhum erro.</span></div>
  `;
  extra.appendChild(legend);

  $("continueBtn").textContent = LEVELS[currentLevelKey].quiz ? "IR PARA O QUIZ" : "CONTINUAR";
  $("resultModal").classList.remove("hidden");
}

function continueAfterResult() {
  $("resultModal").classList.add("hidden");
  if (!pendingAdvance) return;

  if (LEVELS[currentLevelKey].quiz) {
    startQuiz();
    return;
  }

  advanceAfterPhase();
}

function currentQuizSet() {
  const levelBank = QUIZ_BANK[currentLevelKey];
  return levelBank?.[currentPhaseIndex] || null;
}

function startQuiz() {
  const quizSet = currentQuizSet();
  if (!quizSet || !Array.isArray(quizSet.questions) || quizSet.questions.length === 0) {
    advanceAfterPhase();
    return;
  }

  currentQuizIndex = 0;
  quizAnswered = false;
  quizCorrect = 0;
  $("quizModal").classList.remove("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const quizSet = currentQuizSet();
  const questions = quizSet.questions;
  const question = questions[currentQuizIndex];

  $("quizTheme").textContent = `${LEVELS[currentLevelKey].name} • ${quizSet.theme}`;
  $("quizCategory").textContent = question.category;
  $("quizQuestion").textContent = question.question;
  $("quizProgress").textContent = `${currentQuizIndex + 1}/${questions.length}`;
  $("quizFeedback").textContent = "Escolha uma alternativa.";
  $("quizFeedback").className = "quiz-feedback neutral";
  $("quizNextBtn").disabled = true;
  $("quizNextBtn").textContent = currentQuizIndex === questions.length - 1 ? "CONCLUIR QUIZ" : "PRÓXIMA";
  quizAnswered = false;

  const options = $("quizOptions");
  options.innerHTML = "";
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.onclick = () => answerQuiz(index);
    options.appendChild(button);
  });
}

function answerQuiz(index) {
  if (quizAnswered) return;
  quizAnswered = true;

  const quizSet = currentQuizSet();
  const question = quizSet.questions[currentQuizIndex];
  const buttons = [...$("quizOptions").querySelectorAll("button")];
  buttons.forEach(button => button.disabled = true);

  if (index === question.correct) {
    quizCorrect += 1;
    buttons[index].classList.add("correct");
    $("quizFeedback").textContent = question.feedback;
    $("quizFeedback").className = "quiz-feedback success";
  } else {
    buttons[index].classList.add("wrong");
    buttons[question.correct].classList.add("correct");
    const feedbackWithoutPrefix = question.feedback.replace(/^✅\s*Correto!\s*/i, "");
    $("quizFeedback").textContent = `❌ Resposta incorreta.\n\n${feedbackWithoutPrefix}`;
    $("quizFeedback").className = "quiz-feedback error";
  }

  $("quizNextBtn").disabled = false;
}

function nextQuizStep() {
  if (!quizAnswered) return;

  const quizSet = currentQuizSet();
  const questions = quizSet.questions;

  if (currentQuizIndex < questions.length - 1) {
    currentQuizIndex += 1;
    renderQuizQuestion();
    return;
  }

  $("quizModal").classList.add("hidden");
  advanceAfterPhase();
}

function advanceAfterPhase() {
  pendingAdvance = false;
  const level = LEVELS[currentLevelKey];
  const isLast = currentPhaseIndex === level.phases.length - 1;

  if (!isLast) {
    unlockNextPhase(currentLevelKey, currentPhaseIndex + 1);
    saveProgress();
    currentPhaseIndex += 1;
    loadPhase();
    return;
  }

  completeCurrentLevel();
}

function unlockNextPhase(levelKey, nextIndex) {
  if (levelKey === "conscious") progress.consciousUnlockedPhase = Math.max(progress.consciousUnlockedPhase, nextIndex);
  if (levelKey === "eco") progress.ecoUnlockedPhase = Math.max(progress.ecoUnlockedPhase, nextIndex);
  if (levelKey === "human") progress.humanUnlockedPhase = Math.max(progress.humanUnlockedPhase, nextIndex);
}

function completeCurrentLevel() {
  if (currentLevelKey === "conscious") {
    progress.consciousComplete = true;
    progress.ecoUnlocked = true;
    saveProgress();
    showFinal("CONSCIÊNCIA+ concluído!", "Você trabalhou reciclagem, planejamento, depuração e hábitos de cuidado. O ECOTECH+ foi liberado.");
    return;
  }

  if (currentLevelKey === "eco") {
    progress.ecoComplete = true;
    progress.humanUnlocked = true;
    saveProgress();
    showFinal("ECOTECH+ concluído!", "♻ MISSÃO ECOTECH+ CONCLUÍDA — Você planejou rotas, identificou materiais e realizou escolhas de descarte. Tecnologia e sustentabilidade também dependem de decisões conscientes. O NÍVEL HUMANO+ foi liberado.");
    return;
  }

  progress.humanComplete = true;
  saveProgress();
  showFinal("HUMANO+ concluído!", "Você construiu caminhos de acolhimento, respeito, convivência e defesa da dignidade humana. Os Salões do Acolhimento simbolizam preservação de identidade e cultura, não separação. Diferentes culturas, os mesmos direitos, uma sociedade compartilhada.");
}

function showFinal(title, text) {
  $("finalTitle").textContent = title;
  $("finalText").textContent = text;
  $("finalModal").classList.remove("hidden");
}

function goHome() {
  if (executing) return;
  $("gameScreen").classList.add("hidden");
  $("homeScreen").classList.remove("hidden");
  refreshHome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openHelp() {
  $("helpModal").classList.remove("hidden");
}

function closeHelp() {
  $("helpModal").classList.add("hidden");
}

function saveProgress() {
  try {
    sessionStorage.setItem("profLeiaPremiumV5", JSON.stringify(progress));
  } catch (_) {}
  refreshHome();
}

function restoreProgress() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("profLeiaPremiumV5") || sessionStorage.getItem("profLeiaPremiumV3") || "null");
    if (saved && typeof saved === "object") progress = { ...progress, ...saved };
  } catch (_) {}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
