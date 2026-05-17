# CRCF Carbon Removal Calculator & Compliance Prototype

## Assessment of Methodology Implementation

This prototype implements the **EU Carbon Removal Certification Framework (CRCF)** methodology for long-term temporary biogenic carbon storage in buildings (v1.1, April 2026).

### 1. Functional Integrity
*   **Biogenic Storage Logic**: The core formula for calculating stored CO2 per functional unit is fully implemented. It correctly handles volume, density, moisture correction, and dry-mass carbon content conversion to CO2eq using the 44/12 molar ratio.
*   **Building-Level Aggregation (BoQ)**: The tool successfully aggregates multiple bio-based products into a building-level total ($CR_{total}$).
*   **Net Benefit Calculation**: The $TNCRB$ formula correctly accounts for the baseline, project storage, and associated emissions (A1-A5).
*   **Risk & Liability**: The risk assessment module correctly applies the "Buffer Rate" based on the claimed storage period and site-specific risks (Climate/Building), calculating the units required for the liability pool.

### 2. Information Architecture
The current structure mimics the administrative requirements of the methodology:
*   **Product Data**: Maps to EPD (Environmental Product Declaration) or DoPC requirements.
*   **Building Data**: Maps to the "Activity Plan" and "Monitoring Report" requirements.

---

## How it Works

### Core Workflow
1.  **Product Specification**: Enter the physical properties of a bio-based material. The tool calculates the storage capacity ($kgCO_2/unit$).
2.  **Inventory Building**: Add these products to the **Bill of Quantities (BoQ)** to determine the total building-level removal.
3.  **Net Removal (TNCRB)**: Enter the baseline (usually 0 for compliant new builds) and the associated life-cycle emissions (A1-A5) to find the net benefit.
4.  **Liability Check**: Define the storage duration and project risks to see the "Buffer Commitment" (the portion of credits held in reserve).

### Current Formulas
*   **Storage**: $Volume \times Density \times \frac{1}{1 + Moisture} \times Carbon\% \times \frac{44}{12}$
*   **Net Benefit**: $TNCRB = CR_{baseline} - CR_{total} - GHG_{associated}$
*   **Liability**: $Units_{buffer} = CR_{total} \times (Period\% + Risk\%)$

---

## Current Status & Next Steps

### Phase 1: Prototype (Completed)
- [x] Vanilla JS/HTML core calculator.
- [x] Building-level BoQ aggregation.
- [x] Risk-based buffer rate calculation.
- [x] Public web accessibility.

### Phase 2: Enhanced Data Input (Proposed)
- [ ] **GWP Module Breakdown**: Split $GHG_{associated}$ into A1-A3 (Manufacturing), A4 (Transport), and A5 (Installation) for more granular reporting.
- [ ] **Eligible Elements Validation**: Add a selector for building elements (Foundations, Structural Frames, Insulation) to ensure only "Tier 3" elements are counted.
- [ ] **Sustainability Check**: Implement the "Sustainability Criteria" checklists (Biodiversity, Circular Economy, Pollution Control).

### Phase 3: Documentation & Compliance (Proposed)
- [ ] **Plan Generator**: Auto-generate the **Activity Plan** (pre-construction) and **Monitoring Report** (post-construction) as PDF/Markdown.
- [ ] **EPD Library**: A pre-loaded database of common bio-based materials (CLT, Straw Bale, Wood Fibre Insulation) to speed up data entry.

---

## Technical Access
*   **URL**: [https://architools.drawingtable.net/crcf/](https://architools.drawingtable.net/crcf/)
*   **Root Directory**: `~/WebApps/crcf/public/`
*   **Methodology Source**: `Options paper_Methodology LT biogenic carbon storage in buildingsv1.1-10 April.pdf`
