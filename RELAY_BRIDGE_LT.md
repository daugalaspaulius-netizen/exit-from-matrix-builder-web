# Relay Bridge (LT) - kaip veikia

## Ką šitas duoda

Šitas servisas leidžia automatizuoti žinučių perdavimą tarp:

- Visual Studio / Builder AI
- Cursor darbo srauto (per bendrą failų kanalą)

Tikrinimas vyksta kas 30 sekundžių (konfigūruojama).

## Svarbi riba

Šitas tiltas **negali tiesiogiai rašyti į Cursor chat langą** be platformos įvykio.
Tačiau jis pilnai automatizuoja žinučių eilę ir perdavimą per failus/GitHub workflow.

## Failų kanalai

- Įeinantis iš Visual AI:
  - `relay/vs_to_cursor.jsonl`
- Išeinantis į Visual AI:
  - `relay/cursor_to_vs.jsonl`
- Audito logas:
  - `relay/runtime/relay_audit.log`

## Žinutės formatas (JSONL)

Viena žinutė = viena JSON eilutė, pvz:

```json
{"id":"msg-001","timestamp":"2026-05-07T20:55:00Z","from":"visual-ai","to":"cursor","type":"handoff","content":"UI-002 ready for review"}
```

## Paleidimas

1. Paleisk `START_RELAY.bat`
2. Palik terminalą veikti fone
3. Servisas kas 30 s:
   - nuskaito naujas žinutes
   - pažymi jas kaip apdorotas
   - sugeneruoja ACK atgal į `cursor_to_vs.jsonl`

## Konfigūracija

Failas `RELAY_CONFIG.json`:
- `poll_seconds`: tikrinimo intervalas
- `max_messages_per_cycle`: kiek žinučių apdoroti per ciklą

## Kaip naudoti su GitHub workflow

1. Visual AI įrašo handoff žinutę į `vs_to_cursor.jsonl`
2. Relay tiltas sugeneruoja patvirtinimą
3. Cursor pusėje pagal žinutę atliekamas review/integracija per PR
4. Atsakymas grįžta į `cursor_to_vs.jsonl`

Tokiu būdu gaunasi beveik pilnai automatinis AI↔AI darbo ciklas.
