# QuizApp

React Native / Expo viktoriinirakendus, mis kasutab Open Trivia Database API-t.

## Funktsionaalsus

- Laeb küsimused OpenTDB API-st.
- Võimaldab valida kasutajanime, küsimuste arvu, kategooria, raskusastme ja küsimuse tüübi.
- Kuvab iga küsimuse jaoks vastusevariandid juhuslikus järjekorras.
- Loeb õiged, valed ja vastamata vastused.
- Kasutab iga küsimuse jaoks 10-sekundilist taimerit koos edenemisribaga.
- Salvestab tulemused Expo SQLite andmebaasi.
- Kuvab parimate tulemuste edetabeli protsendi, punktide ja aja järgi.

## Tehnoloogiad

- Expo
- React Native
- TypeScript
- Open Trivia Database API
- Expo SQLite

## Paigaldus ja käivitamine

```bash
npm install
npm start
```

Platvormipõhiseks käivitamiseks:

```bash
npm run android
npm run ios
```

Veebis käivitamiseks on Expo veebisõltuvused (`react-dom`, `react-native-web`) samuti vajalikud.

## Projekti struktuur

- `App.tsx` — rakenduse alguspunkt ja ekraanide vahetamine.
- `screens/SettingsScreen.tsx` — viktoriini seadete vorm.
- `screens/QuizScreen.tsx` — küsimuste laadimine, taimer ja vastamise loogika.
- `screens/ResultScreen.tsx` — tulemuste ja edetabeli kuvamine.
- `services/TriviaApi.ts` — OpenTDB küsimuste päringud.
- `services/TriviaCategory.ts` — OpenTDB kategooriate päringud.
- `database/db.ts` — SQLite tabeli loomine ja tulemuste salvestamine.
