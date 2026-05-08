# UI Sprint PR - Voting quorum_type support + result explanation

## Goal
Integrate backend WP-02 quorum_type API contract into voting UI:
- Support 3 quorum types (simple/important/critical) in proposal creation
- Display result explanation for frozen/closed voting statuses
- Human-readable quorum requirements per type

## Files Changed (2 files, 38 insertions)

### Components
- `components/voting/ProposalCard.tsx`
  - Enhanced `getStatusExplanation()` to include frozen/closed result explanations
  - Added votesFor/votesAgainst context to status messages
  - Result explanation now indicates: quorum reached + FOR > AGAINST = frozen/approved; quorum not reached OR FOR <= AGAINST = closed/rejected

### Pages
- `pages/voting.tsx`
  - Added `quorum_type` state field to newProposal (simple/important/critical)
  - Added quorum_type select dropdown in Create Proposal form
  - Updated `handleCreateProposal()` to pass `quorum_type` to backend API call
  - Form now resets quorum_type to "simple" on successful submission

## UI Impact

### Create Proposal Form
✅ **New quorum_type dropdown:**
- Options: "Paprastas (50% + 1 balsas)", "Svarbus (60% balsų)", "Kritiškas (70% balsų)"
- Descriptive text: "Pasirinkite, kokia dalis balsų reikalinga pasiūlymui priimti"
- Default: "simple"
- User selects before submission

### ProposalCard Result Explanation
✅ **Frozen status:** "✅ Kvorum pasiektas! Pasiūlymas [priimtas/vertinamas]. Rezultatas fiksuotas."
✅ **Closed status:** "❌ Balsavimas baigtas. Kvorum nepasiektas arba priešingi balsai laimėjo. Pasiūlymas atmestas."

**Before:** Just show status name  
**After:** Full human-friendly explanation with emoji indicators

## Logic Impact
**Minimal** - Only UI presentation logic added:
- New form field and dropdown rendering
- Status explanation display logic
- API parameter pass-through (contract handled by backend)

## Backend Contracts Required

✅ **Create Proposal API (POST):**
- Request: `{ title, description, quorum_type: "simple" | "important" | "critical" }`
- Cursor's backend already supports (WP-02)

✅ **Proposal Response:**
- Include `quorum_type` field in response
- Cursor's backend already provides (WP-02)

## Test Checklist
- [ ] Create Proposal form displays quorum_type dropdown
- [ ] Can select all 3 options (simple/important/critical)
- [ ] Form resets quorum_type after successful submission
- [ ] ProposalCard displays frozen status explanation when status="frozen"
- [ ] ProposalCard displays closed status explanation when status="closed"
- [ ] Emojis render correctly (✅ and ❌)
- [ ] No console errors
- [ ] Mobile responsive dropdown

## Risks / Open Questions
- ⚠️ **Service layer compatibility:** Assumes `createProposal()` service function signature updated to accept `quorum_type` parameter. If not, need backend/services update.
- ⚠️ **Status field consistency:** Relies on backend returning status as "frozen" | "closed" (lowercase). Verify backend naming.
- ⚠️ **API error handling:** If backend rejects unknown quorum_type, form submission fails. Already handled by existing error logic.

## Design Notes
- Quorum type dropdown uses same styling as other form selects
- Status explanation replaces generic text - shown in info block
- Emoji indicators help users quickly scan proposal results
- Lithuanian labels throughout (consistent with UI)

## Next Steps (For Cursor Review)
1. Verify services.ts has updated `createProposal()` signature with quorum_type param
2. Run voting page in browser - create proposal with each quorum type
3. Verify backend returns quorum_type in Proposal response
4. Test frozen/closed statuses display correct explanations
5. Check for any type errors in console

## Branch & PR Link
- **Branch:** `builder/voting-quorum-type-ui-003`
- **Commit:** 5226c105
- **Base:** main
- **Diff:** Compare builder/voting-quorum-type-ui-003...main
