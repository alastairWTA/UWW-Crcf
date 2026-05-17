# CRCF - Carbon Removal Certification Framework

## Project Overview
This project is dedicated to implementing the methodology for **long-term temporary biogenic carbon storage in buildings**, as defined in the EU Carbon Removal Certification Framework (CRCF). The primary objective is to provide a structured approach for quantifying, certifying, and monitoring the carbon stored in bio-based construction products.

The core of the methodology is based on the "Options paper on the methodology for long-term temporary biogenic carbon storage in buildings" (v1.1, April 2026).

## Key Components

### 1. Quantification Methodology
The net carbon removal benefit is calculated using the following equation:
`TNCRB = CRbaseline - CRtotal - GHGassociated`

- **CRtotal**: Biogenic carbon stored in eligible products.
- **GHGassociated**: GWP emissions (modules A1-A5) associated with those products.
- **CRbaseline**: Baseline biogenic carbon storage (standardised as zero for certain building types).

### 2. Eligibility Criteria
- **Building Type**: New office buildings, buildings of at least four storeys, or other types with specific baselines.
- **Service Life**: Expected service life of at least 35 years.
- **Elements**: Foundations, structural frames, slabs, panels, and insulation.

### 3. Risk & Liability
- **Risk Assessment**: Climate-related risks (flooding, subsidence, etc.) and building-level risks (moisture ingress).
- **Liability**: A liability mechanism (buffer pool or insurance) is required to handle potential carbon reversals.

## Directory Structure
- `Options paper_Methodology LT biogenic carbon storage in buildingsv1.1-10 April.pdf`: The foundational methodology document.
- `GEMINI.md`: This instruction file.

## Usage
The contents of this directory serve as the technical specification for developing a Carbon Removal Calculator and Compliance Tool. Future development will include:
- A React-based frontend for data input and calculation.
- A PDF generation engine for Activity and Monitoring plans.
- A database/schema for tracking EPD (Environmental Product Declaration) data.
