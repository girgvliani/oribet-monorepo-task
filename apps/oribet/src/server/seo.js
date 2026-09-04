import { Defaults } from '@oribet/core/util/defaults'

// ─────────────────────────────────────────────────────────────────────────────
// Brand name — single source of truth for every SEO string below. Change this one
// value to rebrand all titles/descriptions; the `{brand}` token in the strings
// (e.g. `{brand}.com`, `{brand} Crypto Casino`) is replaced with it at load time.
// ─────────────────────────────────────────────────────────────────────────────
const BRAND = 'oribet'

const rawScreens = {
  home: {
    path: '/:lang/',
    key: 'HOME',
    translations: {
      en: {
        title: '{brand}.com',
        description:
          'Bet on sports and spin the reels with the best online slots! Huge jackpots, live betting, and exclusive bonuses – start winning today! * {brand}.io',
      },
      ru: {
        title: '{brand}.com',
        description:
          'Ставьте на спорт и крутите барабаны с лучшими онлайн слотами! Огромные джекпоты, ставки в реальном времени и эксклюзивные бонусы – начните выигрывать сегодня! * {brand}.io',
      },
      ar: {
        title: '{brand}.com',
        description:
          'راهن على الرياضة ودوّر البكرات مع أفضل الفتحات على الإنترنت! جوائز ضخمة، مراهنات مباشرة، ومكافآت حصرية - ابدأ بالفوز اليوم! * {brand}.io',
      },
      de: {
        title: '{brand}.com',
        description:
          'Wetten Sie auf Sport und drehen Sie die Walzen mit den besten Online-Slots! Riesige Jackpots, Live-Wetten und exklusive Boni – beginnen Sie noch heute zu gewinnen! * {brand}.io',
      },
      es: {
        title: '{brand}.com',
        description:
          'Apuesta en deportes y gira los carretes con las mejores tragamonedas en línea! Grandes botes, apuestas en vivo y bonos exclusivos – ¡comienza a ganar hoy! * {brand}.io',
      },
      pt: {
        title: '{brand}.com',
        description:
          'Aposte em esportes e gire os rolos com os melhores slots online! Grandes jackpots, apostas ao vivo e bônus exclusivos – comece a ganhar hoje! * {brand}.io',
      },
      tr: {
        title: '{brand}.com',
        description:
          'Sporlara bahis yapın ve en iyi çevrimiçi slotlarla makaraları döndürün! Büyük ikramiyeler, canlı bahisler ve özel bonuslar – bugün kazanmaya başlayın! * {brand}.io',
      },
    },
  },
  casino: {
    path: '/:lang/casino',
    key: 'CASINO',
    translations: {
      en: {
        title: 'Casino - Lobby Spin, Bet & Win! Best Slots & Sportsbook Online! - {brand}.io',
        description:
          'Casino - Lobby Join the ultimate gambling platform for online slots and sports betting. Huge prizes, free spins, and top betting markets – start playing now! -  {brand}.io',
      },
      ru: {
        title:
          'Казино - Лобби Крутите, Ставьте и Выигрывайте! Лучшие Слоты и Спортбук Онлайн! - {brand}.io',
        description:
          'Казино - Лобби Присоединяйтесь к лучшей игровой платформе для онлайн слотов и ставок на спорт. Огромные призы, бесплатные вращения и топовые рынки ставок – начните играть сейчас! -  {brand}.io',
      },
      ar: {
        title:
          'كازينو - اللوبي دوّر، راهن واربح! أفضل الفتحات والرياضات على الإنترنت! - {brand}.io',
        description:
          'كازينو - اللوبي انضم إلى أفضل منصة قمار للفتحات على الإنترنت والمراهنات الرياضية. جوائز ضخمة، دورات مجانية، وأفضل الأسواق للمراهنات - ابدأ اللعب الآن! -  {brand}.io',
      },
      de: {
        title:
          'Casino - Lobby Drehen, Wetten & Gewinnen! Beste Slots & Sportwetten Online! - {brand}.io',
        description:
          'Casino - Lobby Treten Sie der ultimativen Glücksspielplattform für Online-Slots und Sportwetten bei. Riesige Preise, Freispiele und Top-Wettmärkte – jetzt spielen! -  {brand}.io',
      },
      es: {
        title:
          'Casino - Lobby Gira, Apuesta y Gana! Mejores Tragamonedas y Apuestas Deportivas en Línea! - {brand}.io',
        description:
          'Casino - Lobby Únete a la mejor plataforma de juegos para tragamonedas en línea y apuestas deportivas. Grandes premios, giros gratis y los mejores mercados de apuestas – ¡empieza a jugar ahora! -  {brand}.io',
      },
      pt: {
        title:
          'Cassino - Lobby Gire, Aposte e Ganhe! Melhores Slots & Apostas Esportivas Online! - {brand}.io',
        description:
          'Cassino - Lobby Junte-se à melhor plataforma de jogos para slots online e apostas esportivas. Grandes prêmios, giros grátis e os melhores mercados de apostas – comece a jogar agora! -  {brand}.io',
      },
      tr: {
        title:
          'Casino - Lobi Döndür, Bahis Yap & Kazan! En İyi Slotlar & Çevrimiçi Spor Bahisleri! - {brand}.io',
        description:
          'Casino - Lobi Çevrimiçi slotlar ve spor bahisleri için en iyi oyun platformuna katılın. Büyük ödüller, ücretsiz dönüşler ve en iyi bahis pazarları – şimdi oynamaya başlayın! -  {brand}.io',
      },
    },
  },
  leaderboard: {
    path: '/:lang/leaderBoards/:leaderBoardName',
    key: 'LEADERBOARD',
    translations: {
      en: {
        title: 'Leaderboard - {brand} Crypto Casino',
        description: 'Leaderboard - {brand} Crypto Casino',
      },
      ru: {
        title: 'Таблица лидеров - {brand} Крипто Казино',
        description: 'Таблица лидеров - {brand} Крипто Казино',
      },
      ar: {
        title: 'لوحة المتصدرين - كازينو {brand} للعملات المشفرة',
        description: 'لوحة المتصدرين - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Bestenliste - {brand} Krypto Casino',
        description: 'Bestenliste - {brand} Krypto Casino',
      },
      es: {
        title: 'Tabla de clasificación - Casino Cripto {brand}',
        description: 'Tabla de clasificación - Casino Cripto {brand}',
      },
      pt: {
        title: 'Classificação - Cassino Cripto {brand}',
        description: 'Classificação - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Lider Tablosu - {brand} Kripto Casino',
        description: 'Lider Tablosu - {brand} Kripto Casino',
      },
    },
  },
  sport: {
    path: '/:lang/sports',
    key: 'SPORT',
    translations: {
      en: {
        title:
          'Bet on sports, live betting, and exclusive bonuses – start winning today! - {brand}.io',
        description:
          'Live bets on top sports events with great odds. Secure payments, fast withdrawals, and big wins await! - {brand}.io',
      },
      ru: {
        title:
          'Ставки на спорт, ставки в реальном времени и эксклюзивные бонусы – начните выигрывать сегодня! - {brand}.io',
        description:
          'Ставки в реальном времени на топовые спортивные события с отличными коэффициентами. Безопасные платежи, быстрые выводы и большие выигрыши ждут вас! - {brand}.io',
      },
      ar: {
        title:
          'المراهنة على الرياضة، المراهنات المباشرة، والمكافآت الحصرية – ابدأ بالفوز اليوم! - {brand}.io',
        description:
          'رهانات مباشرة على الأحداث الرياضية الكبرى مع احتمالات رائعة. مدفوعات آمنة، سحوبات سريعة، وأرباح كبيرة في انتظارك! - {brand}.io',
      },
      de: {
        title:
          'Wetten auf Sport, Live-Wetten und exklusive Boni – beginnen Sie noch heute zu gewinnen! - {brand}.io',
        description:
          'Live-Wetten auf Top-Sportereignisse mit großartigen Quoten. Sichere Zahlungen, schnelle Auszahlungen und große Gewinne erwarten Sie! - {brand}.io',
      },
      es: {
        title:
          'Apuesta en deportes, apuestas en vivo y bonos exclusivos – ¡comienza a ganar hoy! - {brand}.io',
        description:
          'Apuestas en vivo en los principales eventos deportivos con grandes cuotas. Pagos seguros, retiros rápidos y grandes ganancias te esperan! - {brand}.io',
      },
      pt: {
        title:
          'Aposte em esportes, apostas ao vivo e bônus exclusivos – comece a ganhar hoje! - {brand}.io',
        description:
          'Apostas ao vivo em eventos esportivos de topo com ótimas odds. Pagamentos seguros, retiradas rápidas e grandes vitórias esperam por você! - {brand}.io',
      },
      tr: {
        title:
          'Sporlara bahis yapın, canlı bahisler ve özel bonuslar – bugün kazanmaya başlayın! - {brand}.io',
        description:
          'Harika oranlarla en iyi spor etkinliklerine canlı bahisler. Güvenli ödemeler, hızlı çekimler ve büyük kazançlar sizi bekliyor! - {brand}.io',
      },
    },
  },
  slotsCategory: {
    path: '/:lang/slots',
    key: 'SLOTS_CATEGORY',
    translations: {
      en: {
        title: 'Casino - Slots Spin, Bet & Win! Best Slots & Sportsbook Online! - {brand}.io',
        description:
          'Casino - Slots Join the ultimate gambling platform for online slots and sports betting. Huge prizes, free spins, and top betting markets – start playing now! -  {brand}.io',
      },
      ru: {
        title:
          'Казино - Слоты Крутите, Ставьте и Выигрывайте! Лучшие Слоты и Спортбук Онлайн! - {brand}.io',
        description:
          'Казино - Слоты Присоединяйтесь к лучшей игровой платформе для онлайн слотов и ставок на спорт. Огромные призы, бесплатные вращения и топовые рынки ставок – начните играть сейчас! -  {brand}.io',
      },
      ar: {
        title: 'كازينو - فتحات دوّر، راهن واربح! أفضل الفتحات والرياضات على الإنترنت! - {brand}.io',
        description:
          'كازينو - فتحات انضم إلى أفضل منصة قمار للفتحات على الإنترنت والمراهنات الرياضية. جوائز ضخمة، دورات مجانية، وأفضل الأسواق للمراهنات - ابدأ اللعب الآن! -  {brand}.io',
      },
      de: {
        title:
          'Casino - Slots Drehen, Wetten & Gewinnen! Beste Slots & Sportwetten Online! - {brand}.io',
        description:
          'Casino - Slots Treten Sie der ultimativen Glücksspielplattform für Online-Slots und Sportwetten bei. Riesige Preise, Freispiele und Top-Wettmärkte – jetzt spielen! -  {brand}.io',
      },
      es: {
        title:
          'Casino - Tragamonedas Gira, Apuesta y Gana! Mejores Tragamonedas y Apuestas Deportivas en Línea! - {brand}.io',
        description:
          'Casino - Tragamonedas Únete a la mejor plataforma de juegos para tragamonedas en línea y apuestas deportivas. Grandes premios, giros gratis y los mejores mercados de apuestas – ¡empieza a jugar ahora! -  {brand}.io',
      },
      pt: {
        title:
          'Cassino - Slots Gire, Aposte e Ganhe! Melhores Slots & Apostas Esportivas Online! - {brand}.io',
        description:
          'Cassino - Slots Junte-se à melhor plataforma de jogos para slots online e apostas esportivas. Grandes prêmios, giros grátis e os melhores mercados de apostas – comece a jogar agora! -  {brand}.io',
      },
      tr: {
        title:
          'Casino - Slotlar Döndür, Bahis Yap & Kazan! En İyi Slotlar & Çevrimiçi Spor Bahisleri! - {brand}.io',
        description:
          'Casino - Slotlar Çevrimiçi slotlar ve spor bahisleri için en iyi oyun platformuna katılın. Büyük ödüller, ücretsiz dönüşler ve en iyi bahis pazarları – şimdi oynamaya başlayın! -  {brand}.io',
      },
    },
  },
  games: {
    path: '/:lang/games/:gameName',
    key: 'SLOTGAME',
    translations: {
      en: {
        title: ' - Play Online Slots! Win Big! - {brand}.io',
        description:
          ' - Play thrilling online slot games, Secure payments, fast withdrawals, and big wins await! - {brand}.io',
      },
    },
  },
  livecasino: {
    path: '/:lang/livecasino',
    key: 'LIVE_CASINO_CATEGORY',
    translations: {
      en: {
        title: 'Casino - Live Casino Spin, Bet & Win! Best Slots & Sportsbook Online! - {brand}.io',
        description:
          'Casino - Live Casino Join the ultimate gambling platform for online slots and sports betting. Huge prizes, free spins, and top betting markets – start playing now! -  {brand}.io',
      },
      ru: {
        title:
          'Казино - Живое Казино Крутите, Ставьте и Выигрывайте! Лучшие Слоты и Спортбук Онлайн! - {brand}.io',
        description:
          'Казино - Живое Казино Присоединяйтесь к лучшей игровой платформе для онлайн слотов и ставок на спорт. Огромные призы, бесплатные вращения и топовые рынки ставок – начните играть сейчас! -  {brand}.io',
      },
      ar: {
        title:
          'كازينو - كازينو مباشر دوّر، راهن واربح! أفضل الفتحات والرياضات على الإنترنت! - {brand}.io',
        description:
          'كازينو - كازينو مباشر انضم إلى أفضل منصة قمار للفتحات على الإنترنت والمراهنات الرياضية. جوائز ضخمة، دورات مجانية، وأفضل الأسواق للمراهنات - ابدأ اللعب الآن! -  {brand}.io',
      },
      de: {
        title:
          'Casino - Live Casino Drehen, Wetten & Gewinnen! Beste Slots & Sportwetten Online! - {brand}.io',
        description:
          'Casino - Live Casino Treten Sie der ultimativen Glücksspielplattform für Online-Slots und Sportwetten bei. Riesige Preise, Freispiele und Top-Wettmärkte – jetzt spielen! -  {brand}.io',
      },
      es: {
        title:
          'Casino - Casino en Vivo Gira, Apuesta y Gana! Mejores Tragamonedas y Apuestas Deportivas en Línea! - {brand}.io',
        description:
          'Casino - Casino en Vivo Únete a la mejor plataforma de juegos para tragamonedas en línea y apuestas deportivas. Grandes premios, giros gratis y los mejores mercados de apuestas – ¡empieza a jugar ahora! -  {brand}.io',
      },
      pt: {
        title:
          'Cassino - Cassino ao Vivo Gire, Aposte e Ganhe! Melhores Slots & Apostas Esportivas Online! - {brand}.io',
        description:
          'Cassino - Cassino ao Vivo Junte-se à melhor plataforma de jogos para slots online e apostas esportivas. Grandes prêmios, giros grátis e os melhores mercados de apostas – comece a jogar agora! -  {brand}.io',
      },
      tr: {
        title:
          'Casino - Canlı Casino Döndür, Bahis Yap & Kazan! En İyi Slotlar & Çevrimiçi Spor Bahisleri! - {brand}.io',
        description:
          'Casino - Canlı Casino Çevrimiçi slotlar ve spor bahisleri için en iyi oyun platformuna katılın. Büyük ödüller, ücretsiz dönüşler ve en iyi bahis pazarları – şimdi oynamaya başlayın! -  {brand}.io',
      },
    },
  },
  table_games: {
    path: '/:lang/table-games',
    key: 'TABLE_GAMES_CATEGORY',
    translations: {
      en: {
        title: 'Casino - Table Games Spin, Bet & Win! Best Slots & Sportsbook Online! - {brand}.io',
        description:
          'Casino - Table Games Join the ultimate gambling platform for online slots and sports betting. Huge prizes, free spins, and top betting markets – start playing now! -  {brand}.io',
      },
      ru: {
        title:
          'Казино - Настольные Игры Крутите, Ставьте и Выигрывайте! Лучшие Слоты и Спортбук Онлайн! - {brand}.io',
        description:
          'Казино - Настольные Игры Присоединяйтесь к лучшей игровой платформе для онлайн слотов и ставок на спорт. Огромные призы, бесплатные вращения и топовые рынки ставок – начните играть сейчас! -  {brand}.io',
      },
      ar: {
        title:
          'كازينو - ألعاب الطاولة دوّر، راهن واربح! أفضل الفتحات والرياضات على الإنترنت! - {brand}.io',
        description:
          'كازينو - ألعاب الطاولة انضم إلى أفضل منصة قمار للفتحات على الإنترنت والمراهنات الرياضية. جوائز ضخمة، دورات مجانية، وأفضل الأسواق للمراهنات - ابدأ اللعب الآن! -  {brand}.io',
      },
      de: {
        title:
          'Casino - Tischspiele Drehen, Wetten & Gewinnen! Beste Slots & Sportwetten Online! - {brand}.io',
        description:
          'Casino - Tischspiele Treten Sie der ultimativen Glücksspielplattform für Online-Slots und Sportwetten bei. Riesige Preise, Freispiele und Top-Wettmärkte – jetzt spielen! -  {brand}.io',
      },
      es: {
        title:
          'Casino - Juegos de Mesa Gira, Apuesta y Gana! Mejores Tragamonedas y Apuestas Deportivas en Línea! - {brand}.io',
        description:
          'Casino - Juegos de Mesa Únete a la mejor plataforma de juegos para tragamonedas en línea y apuestas deportivas. Grandes premios, giros gratis y los mejores mercados de apuestas – ¡empieza a jugar ahora! -  {brand}.io',
      },
      pt: {
        title:
          'Cassino - Jogos de Mesa Gire, Aposte e Ganhe! Melhores Slots & Apostas Esportivas Online! - {brand}.io',
        description:
          'Cassino - Jogos de Mesa Junte-se à melhor plataforma de jogos para slots online e apostas esportivas. Grandes prêmios, giros grátis e os melhores mercados de apostas – comece a jogar agora! -  {brand}.io',
      },
      tr: {
        title:
          'Casino - Masa Oyunları Döndür, Bahis Yap & Kazan! En İyi Slotlar & Çevrimiçi Spor Bahisleri! - {brand}.io',
        description:
          'Casino - Masa Oyunları Çevrimiçi slotlar ve spor bahisleri için en iyi oyun platformuna katılın. Büyük ödüller, ücretsiz dönüşler ve en iyi bahis pazarları – şimdi oynamaya başlayın! -  {brand}.io',
      },
    },
  },
  game_shows: {
    path: '/:lang/game-shows',
    key: 'GAME_SHOWS_CATEGORY',
    translations: {
      en: {
        title: 'Casino - Game Shows Spin, Bet & Win! Best Slots & Sportsbook Online! - {brand}.io',
        description:
          'Casino - Game Shows Join the ultimate gambling platform for online slots and sports betting. Huge prizes, free spins, and top betting markets – start playing now! -  {brand}.io',
      },
      ru: {
        title:
          'Казино - Игровые Шоу Крутите, Ставьте и Выигрывайте! Лучшие Слоты и Спортбук Онлайн! - {brand}.io',
        description:
          'Казино - Игровые Шоу Присоединяйтесь к лучшей игровой платформе для онлайн слотов и ставок на спорт. Огромные призы, бесплатные вращения и топовые рынки ставок – начните играть сейчас! -  {brand}.io',
      },
      ar: {
        title:
          'كازينو - عروض الألعاب دوّر، راهن واربح! أفضل الفتحات والرياضات على الإنترنت! - {brand}.io',
        description:
          'كازينو - عروض الألعاب انضم إلى أفضل منصة قمار للفتحات على الإنترنت والمراهنات الرياضية. جوائز ضخمة، دورات مجانية، وأفضل الأسواق للمراهنات - ابدأ اللعب الآن! -  {brand}.io',
      },
      de: {
        title:
          'Casino - Spielshows Drehen, Wetten & Gewinnen! Beste Slots & Sportwetten Online! - {brand}.io',
        description:
          'Casino - Spielshows Treten Sie der ultimativen Glücksspielplattform für Online-Slots und Sportwetten bei. Riesige Preise, Freispiele und Top-Wettmärkte – jetzt spielen! -  {brand}.io',
      },
      es: {
        title:
          'Casino - Shows de Juegos Gira, Apuesta y Gana! Mejores Tragamonedas y Apuestas Deportivas en Línea! - {brand}.io',
        description:
          'Casino - Shows de Juegos Únete a la mejor plataforma de juegos para tragamonedas en línea y apuestas deportivas. Grandes premios, giros gratis y los mejores mercados de apuestas – ¡empieza a jugar ahora! -  {brand}.io',
      },
      pt: {
        title:
          'Cassino - Shows de Jogos Gire, Aposte e Ganhe! Melhores Slots & Apostas Esportivas Online! - {brand}.io',
        description:
          'Cassino - Shows de Jogos Junte-se à melhor plataforma de jogos para slots online e apostas esportivas. Grandes prêmios, giros grátis e os melhores mercados de apostas – comece a jogar agora! -  {brand}.io',
      },
      tr: {
        title:
          'Casino - Oyun Şovları Döndür, Bahis Yap & Kazan! En İyi Slotlar & Çevrimiçi Spor Bahisleri! - {brand}.io',
        description:
          'Casino - Oyun Şovları Çevrimiçi slotlar ve spor bahisleri için en iyi oyun platformuna katılın. Büyük ödüller, ücretsiz dönüşler ve en iyi bahis pazarları – şimdi oynamaya başlayın! -  {brand}.io',
      },
    },
  },
  instant_games: {
    path: '/:lang/instant-games',
    key: 'INSTANT_GAMES',
    translations: {
      en: {
        title:
          'Casino - Instant Games Spin, Bet & Win! Best Slots & Sportsbook Online! - {brand}.io',
        description:
          'Casino - Instant Games Join the ultimate gambling platform for online slots and sports betting. Huge prizes, free spins, and top betting markets – start playing now! -  {brand}.io',
      },
      ru: {
        title:
          'Казино - Мгновенные Игры Крутите, Ставьте и Выигрывайте! Лучшие Слоты и Спортбук Онлайн! - {brand}.io',
        description:
          'Казино - Мгновенные Игры Присоединяйтесь к лучшей игровой платформе для онлайн слотов и ставок на спорт. Огромные призы, бесплатные вращения и топовые рынки ставок – начните играть сейчас! -  {brand}.io',
      },
      ar: {
        title:
          'كازينو - ألعاب فورية دوّر، راهن واربح! أفضل الفتحات والرياضات على الإنترنت! - {brand}.io',
        description:
          'كازينو - ألعاب فورية انضم إلى أفضل منصة قمار للفتحات على الإنترنت والمراهنات الرياضية. جوائز ضخمة، دورات مجانية، وأفضل الأسواق للمراهنات - ابدأ اللعب الآن! -  {brand}.io',
      },
      de: {
        title:
          'Casino - Sofortspiele Drehen, Wetten & Gewinnen! Beste Slots & Sportwetten Online! - {brand}.io',
        description:
          'Casino - Sofortspiele Treten Sie der ultimativen Glücksspielplattform für Online-Slots und Sportwetten bei. Riesige Preise, Freispiele und Top-Wettmärkte – jetzt spielen! -  {brand}.io',
      },
      es: {
        title:
          'Casino - Juegos Instantáneos Gira, Apuesta y Gana! Mejores Tragamonedas y Apuestas Deportivas en Línea! - {brand}.io',
        description:
          'Casino - Juegos Instantáneos Únete a la mejor plataforma de juegos para tragamonedas en línea y apuestas deportivas. Grandes premios, giros gratis y los mejores mercados de apuestas – ¡empieza a jugar ahora! -  {brand}.io',
      },
      pt: {
        title:
          'Cassino - Jogos Instantâneos Gire, Aposte e Ganhe! Melhores Slots & Apostas Esportivas Online! - {brand}.io',
        description:
          'Cassino - Jogos Instantâneos Junte-se à melhor plataforma de jogos para slots online e apostas esportivas. Grandes prêmios, giros grátis e os melhores mercados de apostas – comece a jogar agora! -  {brand}.io',
      },
      tr: {
        title:
          'Casino - Anlık Oyunlar Döndür, Bahis Yap & Kazan! En İyi Slotlar & Çevrimiçi Spor Bahisleri! - {brand}.io',
        description:
          'Casino - Anlık Oyunlar Çevrimiçi slotlar ve spor bahisleri için en iyi oyun platformuna katılın. Büyük ödüller, ücretsiz dönüşler ve en iyi bahis pazarları – şimdi oynamaya başlayın! -  {brand}.io',
      },
    },
  },
  lottery: {
    path: '/:lang/lottery',
    key: 'LOTTERY',
    translations: {
      en: {
        title: 'Casino - Lottery Spin, Bet & Win! Best Slots & Sportsbook Online! - {brand}.io',
        description:
          'Casino - Lottery Join the ultimate gambling platform for online slots and sports betting. Huge prizes, free spins, and top betting markets – start playing now! -  {brand}.io',
      },
      ru: {
        title:
          'Казино - Лотерея Крутите, Ставьте и Выигрывайте! Лучшие Слоты и Спортбук Онлайн! - {brand}.io',
        description:
          'Казино - Лотерея Присоединяйтесь к лучшей игровой платформе для онлайн слотов и ставок на спорт. Огромные призы, бесплатные вращения и топовые рынки ставок – начните играть сейчас! -  {brand}.io',
      },
      ar: {
        title:
          'كازينو - اليانصيب دوّر، راهن واربح! أفضل الفتحات والرياضات على الإنترنت! - {brand}.io',
        description:
          'كازينو - اليانصيب انضم إلى أفضل منصة قمار للفتحات على الإنترنت والمراهنات الرياضية. جوائز ضخمة، دورات مجانية، وأفضل الأسواق للمراهنات - ابدأ اللعب الآن! -  {brand}.io',
      },
      de: {
        title:
          'Casino - Lotterie Drehen, Wetten & Gewinnen! Beste Slots & Sportwetten Online! - {brand}.io',
        description:
          'Casino - Lotterie Treten Sie der ultimativen Glücksspielplattform für Online-Slots und Sportwetten bei. Riesige Preise, Freispiele und Top-Wettmärkte – jetzt spielen! -  {brand}.io',
      },
      es: {
        title:
          'Casino - Lotería Gira, Apuesta y Gana! Mejores Tragamonedas y Apuestas Deportivas en Línea! - {brand}.io',
        description:
          'Casino - Lotería Únete a la mejor plataforma de juegos para tragamonedas en línea y apuestas deportivas. Grandes premios, giros gratis y los mejores mercados de apuestas – ¡empieza a jugar ahora! -  {brand}.io',
      },
      pt: {
        title:
          'Cassino - Loteria Gire, Aposte e Ganhe! Melhores Slots & Apostas Esportivas Online! - {brand}.io',
        description:
          'Cassino - Loteria Junte-se à melhor plataforma de jogos para slots online e apostas esportivas. Grandes prêmios, giros grátis e os melhores mercados de apostas – comece a jogar agora! -  {brand}.io',
      },
      tr: {
        title:
          'Casino - Lotarya Döndür, Bahis Yap & Kazan! En İyi Slotlar & Çevrimiçi Spor Bahisleri! - {brand}.io',
        description:
          'Casino - Lotarya Çevrimiçi slotlar ve spor bahisleri için en iyi oyun platformuna katılın. Büyük ödüller, ücretsiz dönüşler ve en iyi bahis pazarları – şimdi oynamaya başlayın! -  {brand}.io',
      },
    },
  },
  slots: {
    path: '/:lang/slots',
    key: 'SLOTS',
    translations: {
      en: {
        title: 'Slots - {brand} Crypto Casino',
        description:
          'Play exciting crypto slots at {brand}. Huge variety of slot games with amazing graphics and big wins.',
      },
      ru: {
        title: 'Слоты - {brand} Крипто Казино',
        description:
          'Играйте в захватывающие крипто слоты на {brand}. Огромный выбор слотов с потрясающей графикой и крупными выигрышами.',
      },
      ar: {
        title: 'فتحات - كازينو {brand} للعملات المشفرة',
        description:
          'العب فتحات العملات المشفرة المثيرة في {brand}. مجموعة كبيرة من ألعاب الفتحات مع رسومات مذهلة وأرباح كبيرة.',
      },
      de: {
        title: 'Slots - {brand} Krypto Casino',
        description:
          'Spielen Sie aufregende Krypto-Slots bei {brand}. Riesige Auswahl an Slot-Spielen mit erstaunlicher Grafik und großen Gewinnen.',
      },
      es: {
        title: 'Tragamonedas - Casino Cripto {brand}',
        description:
          'Juega emocionantes tragamonedas cripto en {brand}. Gran variedad de juegos de tragamonedas con gráficos asombrosos y grandes ganancias.',
      },
      pt: {
        title: 'Slots - Cassino Cripto {brand}',
        description:
          'Jogue slots cripto emocionantes no {brand}. Grande variedade de jogos de slots com gráficos incríveis e grandes vitórias.',
      },
      tr: {
        title: 'Slotlar - {brand} Kripto Casino',
        description:
          "{brand}'te heyecan verici kripto slotları oynayın. Harika grafikler ve büyük kazançlarla geniş bir slot oyunu yelpazesi.",
      },
    },
  },
  settings: {
    path: '/:lang/settings/:tab',
    key: 'SETTINGS',
    translations: {
      en: {
        title: 'Settings - {brand} Crypto Casino',
      },
      ru: {
        title: 'Настройки - {brand} Крипто Казино',
      },
      ar: {
        title: 'الإعدادات - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Einstellungen - {brand} Krypto Casino',
      },
      es: {
        title: 'Configuración - Casino Cripto {brand}',
      },
      pt: {
        title: 'Configurações - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Ayarlar - {brand} Kripto Casino',
      },
    },
  },
  wallet: {
    path: '/:lang/account/:tab',
    key: 'WALLET',
    translations: {
      en: {
        title: 'Wallet - {brand} Crypto Casino',
      },
      ru: {
        title: 'Кошелек - {brand} Крипто Казино',
      },
      ar: {
        title: 'المحفظة - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Brieftasche - {brand} Krypto Casino',
      },
      es: {
        title: 'Billetera - Casino Cripto {brand}',
      },
      pt: {
        title: 'Carteira - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Cüzdan - {brand} Kripto Casino',
      },
    },
  },
  rank: {
    path: '/:lang/rank',
    key: 'RANK',
    translations: {
      en: {
        title: 'Rank - {brand} Crypto Casino',
      },
      ru: {
        title: 'Ранг - {brand} Крипто Казино',
      },
      ar: {
        title: 'الترتيب - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Rang - {brand} Krypto Casino',
      },
      es: {
        title: 'Rango - Casino Cripto {brand}',
      },
      pt: {
        title: 'Classificação - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Sıralama - {brand} Kripto Casino',
      },
    },
  },
  promotion: {
    path: '/:lang/promotion',
    key: 'PROMOTIONS',
    translations: {
      en: {
        title: 'Promotion - {brand} Crypto Casino',
      },
      ru: {
        title: 'Промоакция - {brand} Крипто Казино',
      },
      ar: {
        title: 'الترويج - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Aktion - {brand} Krypto Casino',
      },
      es: {
        title: 'Promoción - Casino Cripto {brand}',
      },
      pt: {
        title: 'Promoção - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Promosyon - {brand} Kripto Casino',
      },
    },
  },
  blog: {
    path: '/:lang/blog',
    key: 'BLOG',
    translations: {
      en: {
        title: 'Blog - {brand} Crypto Casino',
      },
      ru: {
        title: 'Блог - {brand} Крипто Казино',
      },
      ar: {
        title: 'المدونة - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Blog - {brand} Krypto Casino',
      },
      es: {
        title: 'Blog - Casino Cripto {brand}',
      },
      pt: {
        title: 'Blog - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Blog - {brand} Kripto Casino',
      },
    },
  },
  providers: {
    path: '/:lang/providers',
    key: 'PROVIDERS',
    translations: {
      en: {
        title: 'Providers - {brand} Crypto Casino',
      },
      ru: {
        title: 'Провайдеры - {brand} Крипто Казино',
      },
      ar: {
        title: 'المزودون - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Anbieter - {brand} Krypto Casino',
      },
      es: {
        title: 'Proveedores - Casino Cripto {brand}',
      },
      pt: {
        title: 'Provedores - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Sağlayıcılar - {brand} Kripto Casino',
      },
    },
  },
  recent: {
    path: '/:lang/recent',
    key: 'RECENT',
    translations: {
      en: {
        title: 'Recent - {brand} Crypto Casino',
      },
      ru: {
        title: 'Недавние - {brand} Крипто Казино',
      },
      ar: {
        title: 'الأحدث - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Neueste - {brand} Krypto Casino',
      },
      es: {
        title: 'Reciente - Casino Cripto {brand}',
      },
      pt: {
        title: 'Recentes - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Son Eklenenler - {brand} Kripto Casino',
      },
    },
  },
  favourites: {
    path: '/:lang/favourites',
    key: 'FAVOURITES',
    translations: {
      en: {
        title: 'Favourites - {brand} Crypto Casino',
      },
      ru: {
        title: 'Избранное - {brand} Крипто Казино',
      },
      ar: {
        title: 'المفضلة - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Favoriten - {brand} Krypto Casino',
      },
      es: {
        title: 'Favoritos - Casino Cripto {brand}',
      },
      pt: {
        title: 'Favoritos - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Favoriler - {brand} Kripto Casino',
      },
    },
  },
  polices: {
    path: '/:lang/policies/:policieType',
    key: 'POLICES',
    translations: {
      en: {
        title: 'Policies - {brand} Crypto Casino',
      },
      ru: {
        title: 'Политики - {brand} Крипто Казино',
      },
      ar: {
        title: 'السياسات - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Richtlinien - {brand} Krypto Casino',
      },
      es: {
        title: 'Políticas - Casino Cripto {brand}',
      },
      pt: {
        title: 'Políticas - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Politikalar - {brand} Kripto Casino',
      },
    },
  },
  bonus: {
    path: '/:lang/bonus',
    key: 'BONUS',
    translations: {
      en: {
        title: 'Bonuses - {brand} Crypto Casino',
      },
      ru: {
        title: 'Бонусы - {brand} Крипто Казино',
      },
      ar: {
        title: 'المكافآت - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Boni - {brand} Krypto Casino',
      },
      es: {
        title: 'Bonos - Casino Cripto {brand}',
      },
      pt: {
        title: 'Bônus - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Bonuslar - {brand} Kripto Casino',
      },
    },
  },
  emailVerify: {
    path: '/:lang/verify-email',
    key: 'EMAIL_VERIFY',
    translations: {
      en: {
        title: 'Email Verification - {brand} Crypto Casino',
      },
      ru: {
        title: 'Подтверждение электронной почты - {brand} Крипто Казино',
      },
      ar: {
        title: 'التحقق من البريد الإلكتروني - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'E-Mail-Verifizierung - {brand} Krypto Casino',
      },
      es: {
        title: 'Verificación de correo electrónico - Casino Cripto {brand}',
      },
      pt: {
        title: 'Verificação de e-mail - Cassino Cripto {brand}',
      },
      tr: {
        title: 'E-posta Doğrulama - {brand} Kripto Casino',
      },
    },
  },
  googleAuth: {
    path: '/auth/social/:type/:access_token',
    key: 'GOOGLE_AUTH',
    translations: {
      en: {
        title: 'Google - {brand} Crypto Casino',
        description: 'Google - {brand} Crypto Casino',
      },
      ru: {
        title: 'Google - {brand} Крипто Казино',
        description: 'Google - {brand} Крипто Казино',
      },
      ar: {
        title: 'Google - كازينو {brand} للعملات المشفرة',
        description: 'Google - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Google - {brand} Krypto Casino',
        description: 'Google - {brand} Krypto Casino',
      },
      es: {
        title: 'Google - Casino Cripto {brand}',
        description: 'Google - Casino Cripto {brand}',
      },
      pt: {
        title: 'Google - Cassino Cripto {brand}',
        description: 'Google - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Google - {brand} Kripto Casino',
        description: 'Google - {brand} Kripto Casino',
      },
    },
  },
  bonusMode: {
    path: '/:lang/bonus-mode',
    key: 'BONUS_MODE',
    translations: {
      en: {
        title: 'Bonus Mode - {brand} Crypto Casino',
      },
      ru: {
        title: 'Бонусный Режим - {brand} Крипто Казино',
      },
      ar: {
        title: 'وضع المكافآت - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Bonus-Modus - {brand} Krypto Casino',
      },
      es: {
        title: 'Modo Bono - Casino Cripto {brand}',
      },
      pt: {
        title: 'Modo Bônus - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Bonus Modu - {brand} Kripto Casino',
      },
    },
  },
  marketplace: {
    path: '/:lang/marketplace',
    key: 'MARKETPLACE',
    translations: {
      en: {
        title: 'Marketplace - {brand} Crypto Casino',
      },
      ru: {
        title: 'Маркетплейс - {brand} Крипто Казино',
      },
      ar: {
        title: 'السوق - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Marktplatz - {brand} Krypto Casino',
      },
      es: {
        title: 'Mercado - Casino Cripto {brand}',
      },
      pt: {
        title: 'Mercado - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Pazar Yeri - {brand} Kripto Casino',
      },
    },
  },
  tournaments: {
    path: '/:lang/tournaments',
    key: 'TOURNAMENTS',
    translations: {
      en: {
        title: 'Tournaments - {brand} Crypto Casino',
      },
      ru: {
        title: 'Турниры - {brand} Крипто Казино',
      },
      ar: {
        title: 'البطولات - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Turniere - {brand} Krypto Casino',
      },
      es: {
        title: 'Torneos - Casino Cripto {brand}',
      },
      pt: {
        title: 'Torneios - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Turnuvalar - {brand} Kripto Casino',
      },
    },
  },
  bonuses: {
    path: '/:lang/bonus',
    key: 'bonus',
    translations: {
      en: {
        title: 'Bonuses - {brand} Crypto Casino',
      },
      ru: {
        title: 'Бонусы - {brand} Крипто Казино',
      },
      ar: {
        title: 'المكافآت - كازينو {brand} للعملات المشفرة',
      },
      de: {
        title: 'Boni - {brand} Krypto Casino',
      },
      es: {
        title: 'Bonos - Casino Cripto {brand}',
      },
      pt: {
        title: 'Bônus - Cassino Cripto {brand}',
      },
      tr: {
        title: 'Bonuslar - {brand} Kripto Casino',
      },
    },
  },
  notFound: {
    path: '*',
    key: 'NOTFOUND',
    translations: {
      en: {
        title: '404 - Page Not Found | {brand}',
      },
      ru: {
        title: '404 - Страница не найдена | {brand}',
      },
      ar: {
        title: '404 - الصفحة غير موجودة | {brand}',
      },
      de: {
        title: '404 - Seite nicht gefunden | {brand}',
      },
      es: {
        title: '404 - Página no encontrada | {brand}',
      },
      pt: {
        title: '404 - Página não encontrada | {brand}',
      },
      tr: {
        title: '404 - Sayfa Bulunamadı | {brand}',
      },
    },
  },
}

// Inject the configured BRAND into every title/description (replaces `{brand}`).
const applyBrand = value => (typeof value === 'string' ? value.replace(/\{brand\}/g, BRAND) : value)

const screens = Object.fromEntries(
  Object.entries(rawScreens).map(([screenKey, screen]) => [
    screenKey,
    {
      ...screen,
      translations: Object.fromEntries(
        Object.entries(screen.translations).map(([lang, fields]) => [
          lang,
          Object.fromEntries(
            Object.entries(fields).map(([field, value]) => [field, applyBrand(value)])
          ),
        ])
      ),
    },
  ])
)

export const langs = {
  en: 'en-US',
  ru: 'ru-RU',
  ka: 'ka-GE',
  tr: 'tr-TR',
  de: 'de-DE',
  es: 'es-ES',
  pt: 'pt-PT',
}

export const routeMetadata = Object.values(screens).map(screen => ({
  path: screen.path,
  key: screen.key,
  getMetadata: (lang = Defaults.defaultLanguage) => {
    const translation = screen.translations[lang] || screen.translations.en

    return {
      ...translation,
      ogImage: '/og-banner.png',
      ogLocale: lang,
    }
  },
}))

export { screens }
