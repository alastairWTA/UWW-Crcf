# CRCF Carbon Removal Calculator & Compliance Prototype

## Assessment of Methodology Implementation

This prototype implements the **EU Carbon Removal Certification Framework (CRCF)** methodology for long-term temporary biogenic carbon storage in buildings (v1.1, April 2026), aligned with the **Using Wood Well (UWW)** research project.

### 1. Functional Integrity
*   **Biogenic Storage Logic**: The core formula for calculating stored CO2 per functional unit is fully implemented. It correctly handles volume, density, moisture correction, and dry-mass carbon content conversion to CO2eq using the 44/12 molar ratio.
*   **Upfront Carbon Reporting**: Implements "Omitted Carbon" tracking (A1-A3 Manufacturing emissions) based on **IStructE Structural Carbon Tool v3 (2025)** default values.
*   **Net Benefit Calculation**: The $TNCRB$ formula correctly accounts for the baseline, project storage, and associated emissions (A1-A5) to derive the true "Net Benefit".
*   **Use Renewal Ratio (URR)**: Implements dual URR reporting:
    *   **UWW Range**: Based on biological renewal periods of 25-45 years.
    *   **35yr Reference**: A fixed reference point for standard building service life compliance.
*   **Risk & Liability**: The risk assessment module applies the "Buffer Rate" based on the claimed storage period and site-specific risks (Climate/Building), calculating the units required for the liability pool.

### 2. Information Architecture
The current structure mimics the administrative requirements of the methodology:
*   **Standard Methodology (Level 1)**: Detailed product-level entry for official certification (Activity Plan/Monitoring Report).
*   **UWW Estimator (Level 2)**: High-level early-stage estimation based on Building Area and Structural Typology.
*   **UWW Simple Methodology (Level 3)**: A volume-based (M3) element inventory with aggregated Project Summary stats.

---

## How it Works

### Core Workflow
1.  **Product Specification**: Enter the physical properties of a bio-based material. The tool calculates the storage capacity ($kgCO_2/unit$).
2.  **Inventory Building**: Add these products to the **Bill of Quantities (BoQ)** to determine the total building-level removal.
3.  **Net Removal (TNCRB)**: Enter the baseline and the associated life-cycle emissions (A1-A5) to find the net benefit.
4.  **Liability Check**: Define the storage duration and project risks to see the "Buffer Commitment" (the portion of credits held in reserve).

### Current Formulas
*   **Storage**: $Volume \times Density \times \frac{1}{1 + Moisture} \times Carbon\% \times \frac{44}{12}$
*   **Net Benefit**: $TNCRB = (CR_{total} - GHG_{A1-A5}) - (CR_{baseline} - GHG_{baseline})$
*   **URR**: $Service Life / Renewal Time$

---

## Technical Details

### Environment & Deployment
*   **Root Directory**: `/home/pi/WebApps/UWW/crcf/`
*   **URL**: [https://architools.drawingtable.net/UWW/crcf/](https://architools.drawingtable.net/UWW/crcf/)
*   **Redirection**: Legacy traffic from `/crcf/` is automatically redirected to `/UWW/crcf/` via Nginx.
*   **Testing**: URR logic and quantification formulas are verified via Bun tests in `tests/`.

### Tech Stack
*   **Frontend**: Vanilla HTML5/CSS3 (Architools Boilerplate v3) & JavaScript.
*   **Runtime**: Bun.
*   **Methodology Source**: `Options paper_Methodology LT biogenic carbon storage in buildingsv1.1-10 April.pdf`.

---

## Current Status & Next Steps

### Phase 1: Infrastructure & Core Logic (Completed)
- [x] Project relocation to `/UWW/` subdirectory.
- [x] Implementation of "Omitted Carbon" and "Net Benefit" metrics.
- [x] URR range and reference value logic.
- [x] Automated redirection and testing.

### Phase 2: Documentation & Compliance (Planned)
- [ ] **Plan Generator**: Auto-generate the **Activity Plan** (pre-construction) and **Monitoring Report** (post-construction) as PDF/Markdown.
- [ ] **EPD Library**: A pre-loaded database of common bio-based materials (CLT, Straw Bale, Wood Fibre Insulation) to speed up data entry.
