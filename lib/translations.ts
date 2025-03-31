export const translations = {
  en: {
    // Home page
    title: "Battleship",
    subtitle: "Challenge your friends to a classic naval combat game",
    startNewGame: "Start New Game",
    peerToPeer: "Peer-to-peer gameplay - no server required",
    builtWith: "Built with Next.js and WebRTC",

    // Ship placement
    placeYourShips: "Place Your Ships",
    rotate: "Rotate",
    reset: "Reset",
    readyToBattle: "Ready to Battle!",
    yourFleet: "Your Fleet",
    notPlacedYet: "Not placed yet",
    placedAt: "Placed at",

    // Ship names
    carrier: "Aircraft Carrier (5)",
    battleship: "Battleship (4)",
    cruiser: "Cruiser (3)",
    submarine: "Submarine (3)",
    destroyer: "Destroyer (2)",

    // Game controls
    yourTurn: "Your turn - Fire at the enemy fleet!",
    opponentTurn: "Opponent's turn - Brace for impact!",
    waiting: "Waiting...",
    attack: "ATTACK",
    defend: "DEFEND",
    victory: "Victory! You sank all enemy ships!",
    defeat: "Defeat! Your fleet has been destroyed!",
    playAgain: "Play Again",

    // Game page
    newGame: "New Game",
    findingOpponent: "Finding an opponent...",
    connectionId: "Connection ID:",
    generating: "Generating...",
    connectWithFriend: "Connect with a friend",
    enterFriendId: "Enter friend's connection ID",
    connect: "Connect",
    waitingForConnection: "Waiting for connection...",
    opponentFleet: "Opponent's Fleet",

    // Language
    language: "Language",
    english: "English",
    portuguese: "Portuguese",
  },
  pt: {
    // Página inicial
    title: "Batalha Naval",
    subtitle: "Desafie seus amigos em um clássico jogo de combate naval",
    startNewGame: "Iniciar Novo Jogo",
    peerToPeer: "Jogo ponto a ponto - sem servidor necessário",
    builtWith: "Construído com Next.js e WebRTC",

    // Posicionamento de navios
    placeYourShips: "Posicione Seus Navios",
    rotate: "Girar",
    reset: "Reiniciar",
    readyToBattle: "Pronto para Batalha!",
    yourFleet: "Sua Frota",
    notPlacedYet: "Ainda não posicionado",
    placedAt: "Posicionado em",

    // Nomes dos navios
    carrier: "Porta-Aviões (5)",
    battleship: "Encouraçado (4)",
    cruiser: "Cruzador (3)",
    submarine: "Submarino (3)",
    destroyer: "Destruidor (2)",

    // Controles do jogo
    yourTurn: "Sua vez - Atire na frota inimiga!",
    opponentTurn: "Vez do oponente - Prepare-se para o impacto!",
    waiting: "Aguardando...",
    attack: "ATACAR",
    defend: "DEFENDER",
    victory: "Vitória! Você afundou todos os navios inimigos!",
    defeat: "Derrota! Sua frota foi destruída!",
    playAgain: "Jogar Novamente",

    // Página do jogo
    newGame: "Novo Jogo",
    findingOpponent: "Procurando um oponente...",
    connectionId: "ID de Conexão:",
    generating: "Gerando...",
    connectWithFriend: "Conecte-se com um amigo",
    enterFriendId: "Digite o ID de conexão do amigo",
    connect: "Conectar",
    waitingForConnection: "Aguardando conexão...",
    opponentFleet: "Frota do Oponente",

    // Idioma
    language: "Idioma",
    english: "Inglês",
    portuguese: "Português",
  },
}

export type Language = "en" | "pt"
export type TranslationKey = keyof typeof translations.en

