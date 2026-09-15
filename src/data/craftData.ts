import { CraftProject } from '../types';

export const CRAFT_PROJECTS: CraftProject[] = [
  {
    id: 'termi',
    name: 'Construiește-l pe Termi',
    characterName: 'Termi Termometrul',
    tagline: 'Prietenul care ne arată dacă e cald ca la plajă sau frig de fulgi de nea!',
    materials: [
      { name: 'Un pai de plastic curat', icon: '🥤', count: '1 buc' },
      { name: 'Plastilină roșie și albă (sau vopsea)', icon: '🎨', count: '2 culori' },
      { name: 'Bucată de carton rezistent', icon: '📦', count: '1 buc (format A4)' },
      { name: 'Un nasture roșu și o bucată de ață / sfoară', icon: '🧵', count: '1 set' },
      { name: 'Carioci colorate (albastru și roșu)', icon: '🖍️', count: '1 set' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Desenează scala magică a temperaturii',
        instruction: 'Pe carton, trage o linie verticală groasă. În partea de jos desenează o zonă albastră cu fulgi de nea (pentru frig și iarnă ❄️), iar în partea de sus desenează o zonă roșie cu un soare zâmbitor (pentru căldură și vară ☀️).',
        tip: 'La mijloc poți desena o zonă galbenă sau verde cu o floare pentru primăvară!',
        illustrationType: 'termi-scale'
      },
      {
        stepNumber: 2,
        title: 'Fixează paiul de plastic pe mijloc',
        instruction: 'Lipește paiul de plastic vertical, chiar de-a lungul liniei desenate. Lasă capetele libere sau folosește puțină plastilină albă la bază pentru a crea rezervorul termometrului.',
        tip: 'Dacă folosești sfoară, trece-o prin pai înainte de a lipi paiul pe carton.',
        illustrationType: 'termi-straw'
      },
      {
        stepNumber: 3,
        title: 'Adaugă marcajul mobil (bila roșie de căldură)',
        instruction: 'Trece nasturele roșu pe ață sau modelează o bilă mică din plastilină roșie care se poate glisa de-a lungul paiului. Acesta va fi lichidul magic al lui Termi!',
        tip: 'Când ieși afară și simți frig pe obraji, coboară bila roșie spre fulg. Când soarele îți încălzește mâinile, urcă bila spre soare!',
        illustrationType: 'termi-marker'
      }
    ],
    secretTip: 'Pune-l pe Termi pe perete lângă geam! În fiecare dimineață, atinge geamul cu palma ca să simți temperatura și mișcă marcajul!'
  },
  {
    id: 'morisca',
    name: 'Construiește Morișca de vânt',
    characterName: 'Morișca Învârtită',
    tagline: 'Mica roată veselă care dansează când vântul începe să sufle!',
    materials: [
      { name: 'O coală de hârtie colorată pătrată', icon: '📄', count: '15x15 cm' },
      { name: 'Un ac cu gămălie (se manevrează cu adultul)', icon: '📍', count: '1 buc' },
      { name: 'Un creion cu radieră la capăt (suportul)', icon: '✏️', count: '1 buc' },
      { name: 'O foarfecă cu vârf rotunjit pentru copii', icon: '✂️', count: '1 buc' },
      { name: 'Mărgele mici de plastic (opțional, pentru rotație)', icon: '🔘', count: '1-2 buc' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tăieturile pe diagonale',
        instruction: 'Ia coala pătrată colorată. Taie cu foarfeca de la fiecare colț spre centru pe diagonală, dar OPREȘTE-TE la aproximativ 2 centimetri înainte de centru (nu tăia până la capăt!).',
        tip: 'Fă un punct mic cu creionul în centrul colii ca să știi unde să te oprești.',
        illustrationType: 'morisca-cuts'
      },
      {
        stepNumber: 2,
        title: 'Îndoaie aripioarele spre centru',
        instruction: 'Ia câte un colț alternativ (un colț da, unul nu, adică 4 colțuri în total) și adu-le cu grijă în centrul foii, fără a le presa complet, lăsându-le curbate ca niște aripioare umflate de vânt.',
        tip: 'Ține-le cu degetul mare în centru ca să nu scape!',
        illustrationType: 'morisca-fold'
      },
      {
        stepNumber: 3,
        title: 'Prinderea cu acul de radiera creionului',
        instruction: 'Cu ajutorul unui adult, trece acul cu gămălie prin cele 4 colțuri adunate și prin centrul colii. Pune o mărgică mică în spate, apoi înfige acul ferm în radiera din capătul creionului.',
        tip: 'Lasă un mic spațiu între hârtie și radieră, astfel încât Morișca să se poată învârti liber când sufli ușor spre ea!',
        illustrationType: 'morisca-pin'
      }
    ],
    secretTip: 'Ieși pe balcon sau în curte și ține creionul în sus! Dacă Morișca stă pe loc, aerul e liniștit. Dacă bâzâie repede, vine o vijelie!'
  },
  {
    id: 'picurel',
    name: 'Construiește-l pe Picurel',
    characterName: 'Picurel Pluviometrul',
    tagline: 'Paharul curajos care prinde picăturile de ploaie și măsoară apa căzută din cer!',
    materials: [
      { name: 'O sticlă de plastic transparentă', icon: '🧴', count: '1 buc (1.5L sau 2L)' },
      { name: 'Riglă sau bandă adezivă cu gradații în centimetri', icon: '📏', count: '1 buc' },
      { name: 'Marker permanent colorat', icon: '🖊️', count: '1 buc' },
      { name: 'Câteva pietricele mici (pentru greutate la bază)', icon: '🪨', count: '4-5 buc' },
      { name: 'Foarfecă sau cutter (folosit doar de un adult)', icon: '✂️', count: '1 buc' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tăierea sticlei (cu ajutorul unui adult)',
        instruction: 'Adultul taie partea superioară a sticlei de plastic, la aproximativ 15 cm de fundul sticlei. Păstrează partea de jos ca recipient, iar pâlnia de sus o poți așeza invers deasupra ca să nu se evapore apa!',
        tip: 'Acoperă marginea tăiată cu puțină bandă adezivă colorată ca să fie netedă și sigură pentru mânuțe.',
        illustrationType: 'picurel-cut'
      },
      {
        stepNumber: 2,
        title: 'Adaugă pietricelele de stabilitate',
        instruction: 'Pune 3-4 pietricele mici pe fundul sticlei, astfel încât vântul să nu o răstoarne. Toarnă puțină apă cât să acopere pietricelele — acela va fi nivelul zero («0 cm»).',
        tip: 'Trage o linie neagră cu markerul unde începe apa deasupra pietrelor: acesta este punctul de start!',
        illustrationType: 'picurel-stones'
      },
      {
        stepNumber: 3,
        title: 'Trasează gradațiile magice în centimetri',
        instruction: 'Așază rigla vertical pe exteriorul sticlei, pornind de la linia zero. Cu markerul permanent, marchează linii la fiecare 1 cm (1, 2, 3, 4, 5... până la 10-15 cm). Lângă fiecare număr poți desena o picătură veselă!',
        tip: 'Copilul poate desena ochișori și un zâmbet pe sticlă: iată-l pe Picurel gata de treabă!',
        illustrationType: 'picurel-scale'
      }
    ],
    secretTip: 'Așază-l pe Picurel afară, departe de acoperișuri sau copaci (unde ploaia cade direct din cer). Verifică-l în fiecare dimineață după ploaie!'
  },
  {
    id: 'calendar',
    name: 'Creează Calendarul Meteo al Sofiei',
    characterName: 'Calendarul Fermecat',
    tagline: 'Tabloul mare unde lipești simbolurile zilei și devii micul meteorolog al casei!',
    materials: [
      { name: 'Carton mare sau coală mare A3 colorată', icon: '📋', count: '1 buc' },
      { name: 'Cartonașe mici din carton alb', icon: '🎴', count: '15-20 buc' },
      { name: 'Carioci și creioane cerate', icon: '🖍️', count: '1 set' },
      { name: 'Buline cu scai (velcro) sau pioneze sigure', icon: '⚪', count: '1 set' },
      { name: 'Rigla lungă și creion grafic', icon: '📐', count: '1 buc' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Desenează grila zilelor săptămânii',
        instruction: 'Pe cartonul mare, trasează 7 coloane mari cu rigla pentru zilele săptămânii: Luni, Marți, Miercuri, Joi, Vineri, Sâmbătă, Duminică. Scrie titlul sus: «STAȚIA METEO A LUI [NUMELE TĂU]».',
        tip: 'Colorează fiecare zi cu o altă nuanță veselă (de exemplu: Luni cu galben, Marți cu portocaliu etc.)!',
        illustrationType: 'calendar-grid'
      },
      {
        stepNumber: 2,
        title: 'Creează cartonașele cu simboluri meteo',
        instruction: 'Desenează și decupează cartonașe mici cu simbolurile naturii: Soare zâmbitor ☀️, Nor pufos ☁️, Picături de ploaie 🌧️, Fulg de nea ❄️, și Morișcă cu vânt 💨.',
        tip: 'Fă măcar 4-5 cartonașe din fiecare fel ca să ai rezerve pentru toată săptămâna!',
        illustrationType: 'calendar-cards'
      },
      {
        stepNumber: 3,
        title: 'Fixează bulinele cu scai (velcro)',
        instruction: 'Lipește o parte a bulinei velcro în fiecare căsuță a zilelor de pe calendar, iar cealaltă parte pe spatele fiecărui cartonaș cu vreme. Astfel, copilul poate lipi și dezlipi cu ușurință simbolul zilei!',
        tip: 'Agățați calendarul lângă ușa de la intrare sau pe frigider, la înălțimea ochilor copilului!',
        illustrationType: 'calendar-velcro'
      }
    ],
    secretTip: 'La finalul lunii, numărați câte cartonașe cu soare și câte cu ploaie ați adunat! Veți vedea ce anotimp a fost cel mai darnic!'
  }
];
