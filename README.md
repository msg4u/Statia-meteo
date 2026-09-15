# Stația Meteo a Sofiei – Învață Vremea cu Morișca, Picurel și Termi 🌤️🌡️

**Stația Meteo a Sofiei** este o aplicație web interactivă și un material didactic digital de ultimă generație, creat special pentru copii cu vârste între **4 și 7 ani**. Proiectul introduce concepte fundamentale de meteorologie și științele naturii într-un format narativ prietenos, transformând instrumentele științifice în personaje animate capabile să ghideze micii exploratori.

Aplicația folosește inteligența artificială generativă prin platforma Google AI Studio pentru a genera un dialog adaptiv, oferindu-le copiilor explicații științifice simplificate și interactive.

🔗 **Link Aplicație:** [https://statia-meteo-a-sofiei.ai.studio](https://statia-meteo-a-sofiei.ai.studio)

---

## 🚀 Conceptul Narativ și Științific

Aplicația dărâmă mitul că vremea este o "magie" și îi apropie pe copii de rigoarea științifică a colectării de date:
- **Consilierii de Încredere:** Cele trei instrumente meteorologice de bază devin personaje cu personalitate (Morișca pentru vânt, Picurel pentru precipitații și Termi pentru temperatură).
- **Observație versus Magie:** Copiii învață importanța observației sistematice. Ei înțeleg că prognoza meteo înseamnă citirea atentă și repetată a semnelor din natură.
- **Predicție Bazată pe Date:** Jocul stimulează gândirea analitică, arătând cum înregistrările zilnice fac posibilă o ghicire informată despre starea vremii din ziua următoare.

---

## 🛠️ Tehnologii utilizate

Proiectul se bazează pe o arhitectură frontend modernă, configurată pentru a oferi o interfață fluidă, esențială în menținerea atenției preșcolarilor:

- **[Vite](https://vitejs.dev)** – Instrument de build de ultimă generație, ultra-rapid.
- **[TypeScript](https://typescript.org)** – Suport pentru un cod robust, predictibil și curat prin tipizare statică.
- **[Bun](https://bun.sh)** – Runtime JavaScript all-in-one și manager de pachete rapid.

---

## 💻 Instalare și Rulare Locală

Urmează pașii de mai jos pentru a instala și rula proiectul în mediul tău de dezvoltare local:

### 1. Clonarea repository-ului
```bash
git clone https://github.com
cd Statia-meteo
```

### 2. Instalarea dependențelor
Se recomandă utilizarea **Bun** (conform fișierului `bun.lock` din structura proiectului):
```bash
bun install
```
Sau, dacă folosești managerul tradițional **npm**:
```bash
npm install
```

### 3. Configurarea variabilelor de mediu
Creează fișierul `.env` local pornind de la șablonul din repository pentru a introduce cheile API destinate Google AI Studio:
```bash
cp .env.example .env
```

### 4. Rularea serverului de dezvoltare
Pornește serverul local:
```bash
bun run dev
# sau
npm run dev
```
Aplicația va putea fi accesată în browser la adresa indicată în consolă (de regulă `http://localhost:5173`).

### 5. Compilarea pentru producție
Pentru a genera build-ul optimizat și compilat gata de livrare în folderul `dist`:
```bash
bun run build
# sau
npm run build
```

---

## 📁 Structura Proiectului

```text
├── src/               # Codul sursă (logica personajelor meteo, design, interfață)
├── .env.example       # Model pentru configurarea cheilor de acces în AI Studio
├── bun.lock           # Fișierul de blocare a versiunilor pentru managerul Bun
├── index.html         # Punctul principal de intrare HTML
├── metadata.json      # Setările aplicației dedicate platformei Google AI Studio
├── package.json       # Scripturile de execuție și lista modulelor dependente
├── tsconfig.json      # Configurația oficială a compilatorului TypeScript
└── vite.config.ts     # Configurația și plugin-urile folosite de Vite
```

---

## 📝 Licență și Contribuții

Acest repository a fost inițiat pornind de la template-ul oficial `google-gemini/aistudio-repository-template`.

Dacă vrei să introduci noi instrumente de măsură (cum ar fi un barometru animat), scenarii climatice noi sau optimizări de cod, te invităm să deschizi un **Issue** sau să trimiți un **Pull Request**.
