# Visual Studio AI prijungimo instrukcija (LT)

Šis failas skirtas tam, kad Visual Studio AI (ar Builder AI) teisingai įsijungtų į bendrą darbą su Cursor.

## 1) Ką naudoti

- Repo: `daugalaspaulius-netizen/exit-from-matrix-builder-web`
- Pagrindinė šaka: `main`
- Koordinacijos failai:
  - `AI_SYNC_RUNTIME.md`
  - `AI_TASK_BOARD.json`
  - `AI_HANDOFF_LOG.md`

## 2) Pradinis darbo protokolas

Prieš pradedant bet kokį pakeitimą:

1. Perskaityk `AI_SYNC_RUNTIME.md`
2. Perskaityk `AI_TASK_BOARD.json`
3. Pasiimk vieną užduotį pakeisdamas:
   - `owner`
   - `status` -> `in_progress`
   - `updated_at`
4. Kurk atskirą branch (pvz. `builder/*`)
5. Daryk mažą, aiškų PR

## 3) Komandos per PR komentarus

Komentaruose galima rašyti:

- `/handoff <žinutė>` - perdavimas kitam AI
- `/blocked <problema>` - užstrigimo signalas
- `/task <užduotis>` - naujos užduoties pasiūlymas

Orkestratorius kas 30 sekundžių patikrina komentarus ir įrašo juos į `AI_HANDOFF_LOG.md`.

## 4) Ribos (kad nesikirstų failai)

- Visual AI keičia vizualą:
  - `pages/*`
  - `components/*`
  - `styles/*`
  - `tailwind.config.js`
- Cursor AI keičia logiką/integraciją:
  - `lib/*`
  - `hooks/*`
  - API kontraktus ir testus

Jei reikia to paties failo abiem AI:
- sukurti aiškų `/handoff` komentarą PR’e
- tik po to tęsti pakeitimus

## 5) Paleidimas vietiniam monitoringui

Norint aktyvuoti „tiltą“ (polling kas 30 s):

1. Paleisti `START_AI_ORCHESTRATOR.bat`
2. Palikti veikti fone
3. Orkestratorius automatiškai:
   - stebi PR būsenas
   - stebi `/handoff`, `/blocked`, `/task` komentarus
   - pildo `AI_HANDOFF_LOG.md`
   - sinchronizuoja `AI_TASK_BOARD.json` statusus

Tokiu būdu Cursor ir Visual Studio AI dirba kaip viena komanda per GitHub.
