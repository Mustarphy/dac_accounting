# DAC Accounting — Calculators

Public, no-login-required calculators at `/knowledge/calculators`, linked from a
"Knowledge" dropdown in the main navigation. Four calculators: **Fuel**,
**Property (stamp duty)**, **VAT**, and **Payslip (PAYE)**. All calculations run
entirely in the browser — no salary, property value, or other personal
financial input is ever sent to the Laravel API or logged anywhere.

## 1. Architecture

```
src/lib/calculators/
  money.ts                        Integer-kobo currency arithmetic + NGN formatting
  fuel.ts                         Fuel cost engine (pure math, no legal rules)
  vat.ts                          VAT engine
  paye.ts                         PAYE / take-home-pay engine
  property.ts                     Property stamp duty engine
  *.test.ts                       Unit tests (vitest) alongside each engine
  rules/
    types.ts                      RuleSource type — the shape every legal rule is recorded in
    nigeria/
      vat.ts                      NIGERIA_VAT_RULE
      personal-income-tax.ts      NIGERIA_PIT_BANDS_2026, NIGERIA_RENT_RELIEF_RULE, NIGERIA_PENSION_RULE
      stamp-duty.ts                NIGERIA_PROPERTY_STAMP_DUTY_RULE

src/components/calculators/
  CalculatorNav.tsx                4 anchor-link cards at the top of the page
  ResultCard.tsx / ResultRow.tsx   Shared result-panel presentation
  SourceList.tsx                   Renders a rule's citation + confidence badge
  CalculatorDisclaimer.tsx         Shared disclaimer + Contact DAC CTA
  FuelCalculator.tsx
  VatCalculator.tsx
  PropertyCalculator.tsx
  PayeCalculator.tsx

src/app/knowledge/calculators/page.tsx   The page itself (route: /knowledge/calculators)
```

**Why this split:** every rule (a rate, a band table, a threshold) lives in
`lib/calculators/rules/nigeria/` as a plain data object carrying its own
citation (`legalBasis`, `effectiveFrom`, `sourceUrl`, `verifiedOn`,
`confidence`, `notes`). The calculation engines (`fuel.ts`, `vat.ts`, etc.) are
pure functions that import those rule objects — no rate or threshold is
hardcoded inside a React component. To update a rate, change it in one file
under `rules/nigeria/`; the UI, the "Sources" panel on each calculator, and
the tests all read from that same object, so nothing can drift out of sync.

**Currency arithmetic:** all amounts are converted to integer kobo
(`nairaToKobo` in `money.ts`) at the input boundary and stay integers through
addition/subtraction. Rate multiplication (e.g. × 0.075 for VAT) still touches
floating point once per figure, rounded immediately — the same approach
payment processors use for cents-level math. No external decimal library was
added; see `money.test.ts` for the "0.1 + 0.2" drift case this avoids.

## 2. Knowledge dropdown navigation

`src/lib/site-config.ts`'s `mainNav` now supports an optional `children`
array on any item. Only "Knowledge" has one (Knowledge Hub, Calculators).

- **Desktop** (`src/components/layout/NavDropdown.tsx`): a toggle button
  (`aria-expanded`, `aria-controls`) that opens on hover (with a short close
  delay so moving the mouse into the menu doesn't close it) and on
  click/Enter/Space. Closes on outside click, on Escape (returning focus to
  the trigger), and when focus leaves the component (Tab past the last
  link). This is the WAI-ARIA "disclosure" pattern (button + plain link
  list), not a full ARIA `menu` widget — a `menu`/`menuitem` implementation
  expects roving-tabindex arrow-key navigation meant for app-style menus,
  which is more machinery than a handful of nav links need, and is easy to
  get wrong. Tab moves through the links naturally once the panel is open.
- **Mobile** (inline in `Navbar.tsx`): the same idea as an accordion —
  a button toggles a nested `<ul>` of links inside the existing slide-down
  mobile menu; selecting a link closes both the submenu and the mobile menu.
- Items without `children` (Home, About, Services, Contact Us) render as
  plain links, unchanged from before.

## 3. The four calculators

### Fuel Calculator
No legal rules involved — pure unit conversion and arithmetic. Inputs:
annual distance (km or miles), fuel price per litre (user-supplied — never
assumed, since pump prices vary by location and change often), and vehicle
efficiency (litres/100km or km/litre). Outputs annual/monthly/weekly cost
estimates. Formulas are in `docs/calculators.md` §"Fuel formulas" below and
mirrored in the calculator's own "How this is calculated" panel.

### Property Calculator (stamp duty)
**Deliberately narrow scope**, flagged in the UI: federal ad valorem stamp
duty (1.5%) on a real-property **transfer/conveyance** only, with the
₦10,000,000 exemption threshold from the Nigeria Tax Act 2025. Explicitly
does **not** cover: state governor's consent fees, registration fees, legal
fees, Capital Gains Tax, leases, mortgages, or mineral-asset transfers — all
called out in the calculator's warning banner and in `NIGERIA_PROPERTY_STAMP_DUTY_RULE.notes`.
Confidence is marked `"provisional"` (see §5) and the UI shows a visible
"Provisional" badge on its source citation.

### VAT Calculator
Standard 7.5% rate, both directions (add VAT to a net amount / extract VAT
from a gross amount). Notes in the UI that zero-rated and exempt categories
(basic food, healthcare, education, etc.) aren't distinguished — the
calculator assumes the standard rate applies to whatever amount is entered.

### Payslip Calculator (PAYE)
Six-band progressive PAYE table (0% up to ₦800,000, rising to 25% above
₦50,000,000), rent relief (20% of annual rent, capped ₦500,000, replacing the
old Consolidated Relief Allowance), and an optional 8% employee pension
deduction (Pension Reform Act 2014). Shows a full band-by-band breakdown
table, annual and monthly take-home pay, and separately notes the employer's
10% pension contribution as an employer cost that is never deducted from the
employee's pay. Explicitly excludes NHF, NHIS, life insurance relief,
mortgage interest relief, and gratuity treatment — see the "Assumptions and
simplifications" panel on the calculator itself.

## 4. Formulas

**Fuel:**
```
annualDistanceKm = milesEntered ? distance × 1.609344 : distance
annualLitres     = efficiencyUnit == "l/100km"
                     ? annualDistanceKm × efficiency ÷ 100
                     : annualDistanceKm ÷ efficiency
annualCost       = annualLitres × pricePerLitre
monthlyCost = annualCost ÷ 12 ;  weeklyCost = annualCost ÷ 52
```

**VAT:**
```
exclusive:  vat = amount × rate ;            total = amount + vat
inclusive:  net = amount ÷ (1 + rate) ;      vat = amount − net
```

**Property stamp duty:**
```
exempt   = transactionValue < 10,000,000
stampDuty = exempt ? 0 : transactionValue × 0.015
```

**PAYE:**
```
pensionDeduction = includePension ? grossAnnual × 8% : 0
rentRelief        = min(annualRent × 20%, 500,000)
taxableIncome      = max(grossAnnual − pensionDeduction − rentRelief, 0)
tax                = Σ over bands: (income within band) × (band rate)   [progressive, not a cliff]
netAnnual          = grossAnnual − pensionDeduction − tax
```

## 5. Source register

All figures below were verified via web research on **2026-09-29** against
the **Nigeria Tax Act, 2025** (and the Pension Reform Act, 2014 for pension
rates), effective **1 January 2026**. The official primary text on
`nrs.gov.ng` (Nigeria Revenue Service, formerly FIRS) could not be retrieved
directly — the site returned an automated bot-protection challenge to
non-interactive fetches. Figures are therefore corroborated across multiple
professional secondary sources instead of a single primary citation; see the
"confidence" column.

| Rule | Value | Confidence | Sources |
|---|---|---|---|
| VAT standard rate | 7.5% | **Verified** — 2 sources | [EY](https://www.ey.com/en_gl/technical/tax-alerts/nigeria-tax-act-2025-has-been-signed-highlights), [Businessday](https://businessday.ng/business-economy/article/nigerias-tax-reforms-set-lowest-vat-rate-among-african-peers/) |
| PAYE bands (6-band table, ₦800k tax-free threshold) | see `personal-income-tax.ts` | **Verified** — 3 independent sources | [Mondaq](https://www.mondaq.com/nigeria/capital-gains-tax/1726922/understanding-personal-income-tax-under-the-nigerian-tax-act-2025), [KPMG](https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-168.html), [EY](https://www.ey.com/en_gl/technical/tax-alerts/nigeria-tax-act-2025-has-been-signed-highlights) |
| Rent relief | 20% of rent, capped ₦500,000 | **Verified** — 2 sources | [Mondaq](https://www.mondaq.com/nigeria/capital-gains-tax/1726922/understanding-personal-income-tax-under-the-nigerian-tax-act-2025), [KPMG](https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-168.html) |
| Pension: employee 8% / employer 10% of Basic+Housing+Transport | — | **Verified** | [Mondaq — Pension Reform Act 2014](https://www.mondaq.com/nigeria/retirement-superannuation-pensions/958354/reformations-can-the-pension-reform-act-2014-go-further) |
| FIRS renamed to Nigeria Revenue Service (NRS) | — | **Verified** | [Guardian NG](https://guardian.ng/business-services/firs-transitions-to-nigeria-revenue-service-as-new-tax-regime-begins/), [KPMG](https://kpmg.com/ng/en/insights/2025/07/the-nigeria-revenue-service-establishment-act-2025.html) |
| Property stamp duty (transfer/conveyance): 1.5% ad valorem, ₦10m exemption | — | **Provisional** — single clear source for the exact rate | [Businessday](https://businessday.ng/opinion/article/the-nigeria-tax-act-2025-a-breath-of-fresh-air-for-stamp-duty-tax/) (exemption threshold also referenced by EY) |

Each rule object in `src/lib/calculators/rules/nigeria/*.ts` carries this
same information (`legalBasis`, `effectiveFrom`, `sourceUrl`,
`additionalSources`, `verifiedOn`, `confidence`, `notes`) and is rendered
on the calculator page itself via `SourceList.tsx`, so a visitor sees the
same citations shown here.

### Rules and cases NOT implemented (explicitly out of scope)

- **State governor's consent fees, land registration fees, legal/agency
  fees** on property transactions — genuinely state-specific, and the
  secondary sources found during research gave inconsistent figures for
  individual states (e.g. conflicting figures for Lagos across different
  aggregator sites). Not implemented rather than guessed.
- **Lease stamp duty, mortgage stamp duty, mineral-asset transfer stamp
  duty** — different rate schedules under the NTA 2025 Ninth Schedule; not
  researched to the same depth as the transfer/conveyance rate.
- **Capital Gains Tax on property disposal.**
- **NHF (National Housing Fund), NHIS, life insurance premium relief,
  mortgage interest relief, gratuity taxation** in the payslip calculator —
  one source indicated NHF is "now voluntary" under the NTA 2025, but this
  wasn't independently corroborated, and adding it plus the other reliefs
  would meaningfully complicate the input form for a first version. Flagged
  in the calculator's own "Assumptions" panel.
- **VAT-exempt / zero-rated category detection** — the VAT calculator always
  applies the standard rate; it doesn't ask what the transaction is for.

## 6. Updating tax rates and effective dates safely

1. Edit the relevant file in `src/lib/calculators/rules/nigeria/`. Update the
   value **and** `effectiveFrom`, `sourceUrl`, `verifiedOn`, and `notes` —
   don't change a rate without updating its citation, or the source register
   silently goes stale.
2. If a rule changes to depend on a *date* (e.g. a new tax year with
   different bands starting on a known future date), don't overwrite the
   existing rule object — add a second one and branch on the transaction/tax
   date in the calculation engine, so historical calculations for prior
   periods stay correct. None of the four calculators currently need this
   (they all use the single NTA 2025 regime), so no date-branching
   infrastructure exists yet — build it when the first genuinely
   date-dependent rule shows up rather than speculatively now.
3. Run `npm test` — the unit tests assert specific band boundaries and
   rounding behavior with hardcoded expected values, so a rate change should
   make the relevant test fail until you update its expected values too.
   That's intentional: it forces a human to look at both the rule and the
   test together.
4. Set `confidence: "provisional"` on anything you can't fully verify against
   a primary source, and leave a clear `notes` explanation — the UI will show
   a "Provisional" badge automatically.

## 7. Running and testing

```bash
npm run lint        # ESLint
npx tsc --noEmit     # TypeScript
npm test             # vitest — unit tests for every calculation engine
npm run build        # production build
```

Tests cover: exact boundary values (e.g. ₦9,999,999 vs ₦10,000,000 for the
stamp-duty exemption), a manually-verified multi-band PAYE example, the
progressive-band algorithm never taxing above the top marginal rate, rent
relief capping, employer vs. employee pension contribution separation,
zero/negative/non-finite input handling, and unit-conversion round-trips
(miles↔km) for the fuel calculator.

## 8. Backend / API requirements

**None required.** All four calculators run entirely client-side; no salary,
property value, or personal financial figure is sent to the Laravel API,
stored in localStorage/cookies, or logged. If a future requirement needs
server-side calculation, saved results, or lead capture from a calculator
(e.g. "email me this result"), that needs a new documented API contract
(see `docs/auth-api-contract.md` for the pattern used elsewhere in this
project) and a privacy review before implementation — nothing like that
exists today.

## 9. Outstanding confirmations needed from DAC / a qualified Nigerian tax professional

- **Property stamp duty rate (1.5%) and the ₦10,000,000 exemption** — single
  secondary source, not cross-checked against the gazetted Act text. This is
  the one figure on the page most worth an independent professional check
  before the calculator is presented as authoritative.
- **PAYE bands and rent relief** — corroborated across three professional
  sources, but none of them are the primary gazette text, since `nrs.gov.ng`
  blocked automated retrieval. Worth a final sanity check against the
  gazetted Nigeria Tax Act, 2025 if/when convenient.
- Whether DAC wants NHF/NHIS/other reliefs added to the payslip calculator
  in a future iteration, and whether the property calculator should be
  expanded to cover consent fees for specific states DAC's clients most
  commonly transact in.
