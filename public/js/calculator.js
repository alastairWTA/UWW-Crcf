document.addEventListener('DOMContentLoaded', () => {
    // --- Tab System ---
    const tabBtns = document.querySelectorAll('.app-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.style.display = 'none');
            
            btn.classList.add('active');
            const panelId = btn.dataset.tab;
            document.getElementById(panelId).style.display = 'block';

            // Toggle Themes
            if (panelId === 'methodology') {
                document.body.classList.remove('theme-uww');
                document.body.classList.add('theme-standard');
            } else {
                document.body.classList.remove('theme-standard');
                document.body.classList.add('theme-uww');
            }
            
            updateAllFinancials();
        });
    });

    // --- Core Data ---
    const uwwData = {
        'all-timber': { bio: 98.1, wuiMin: 0.35, wuiMax: 0.55 },
        'primarily-timber': { bio: 99.6, wuiMin: 0.25, wuiMax: 0.40 },
        'hybrid': { bio: 69.0, wuiMin: 0.15, wuiMax: 0.35 },
        'mixed': { bio: 76.3, wuiMin: 0.18, wuiMax: 0.34 },
        'mixed-composite': { bio: 49.8, wuiMin: 0.12, wuiMax: 0.28 },
        'composite': { bio: 41.5, wuiMin: 0.08, wuiMax: 0.22 },
        'concrete': { bio: 32.5, wuiMin: 0.05, wuiMax: 0.20 }
    };

    const materialData = {
        'CLT': { density: 470, carbon: 50, moisture: 12, urr: 0.95 },
        'LVL': { density: 470, carbon: 50, moisture: 11, urr: 0.92 },
        'Softwood plywood': { density: 470, carbon: 49, moisture: 10.5, urr: 0.88 },
        'Softwood studwork': { density: 480, carbon: 50, moisture: 16, urr: 0.85 },
        'Glulam': { density: 510, carbon: 50, moisture: 11, urr: 0.94 },
        'Hardwood studwork': { density: 550, carbon: 49, moisture: 17.5, urr: 0.82 },
        'Hardwood plywood': { density: 580, carbon: 49, moisture: 10.5, urr: 0.86 },
        'Hardwood beech LVL': { density: 730, carbon: 48, moisture: 11, urr: 0.90 },
        'Concrete blocks': { density: 600, carbon: 0, moisture: 5.5, urr: 0.10 },
        'OSB': { density: 610, carbon: 47, moisture: 6.5, urr: 0.80 },
        'MDF': { density: 680, carbon: 44, moisture: 7.5, urr: 0.75 },
        'Chipboard': { density: 690, carbon: 43, moisture: 7.5, urr: 0.70 },
        'Bamboo': { density: 700, carbon: 46, moisture: 10, urr: 0.85 }
    };

    // --- State ---
    let lvl1Boq = [];
    let lvl3Boq = [];
    let currentLvl1Storage = 0;
    let currentLvl1Emissions = 0;
    let currentMode = 'opt1';

    // --- LEVEL 1 LOGIC ---
    const biogenicForm = document.getElementById('biogenic-form');
    const modeRadios = document.getElementsByName('mode');

    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentMode = e.target.value;
            const opt2Only = document.querySelectorAll('.opt2-only');
            opt2Only.forEach(el => {
                if (currentMode === 'opt2') el.style.display = 'block';
                else el.style.display = 'none';
            });
            updateLvl1Calculations();
        });
    });

    biogenicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const vol = parseFloat(document.getElementById('volume').value);
        const density = parseFloat(document.getElementById('density').value);
        const moisture = parseFloat(document.getElementById('moisture').value) / 100;
        const carbon = parseFloat(document.getElementById('carbon_content').value) / 100;
        
        currentLvl1Storage = vol * density * (1 / (1 + moisture)) * carbon * (44 / 12);

        const a1a3 = parseFloat(document.getElementById('gwp_a1a3').value);
        const a4 = parseFloat(document.getElementById('gwp_a4').value);
        const a5 = parseFloat(document.getElementById('gwp_a5').value);
        const penalty = parseFloat(document.getElementById('data_quality').value);

        currentLvl1Emissions = (a1a3 + a4 + a5) * (1 + penalty) * 1000;

        document.getElementById('storage-value').textContent = currentLvl1Storage.toFixed(2);
        document.getElementById('emissions-value').textContent = currentLvl1Emissions.toFixed(2);
        document.getElementById('biogenic-result').style.display = 'block';
    });

    document.getElementById('add-to-boq').addEventListener('click', () => {
        if (currentLvl1Storage === 0) { alert("Calculate first"); return; }
        const name = document.getElementById('product_name').value || "Unnamed";
        const element = document.getElementById('building_element').value;
        lvl1Boq.push({
            id: Date.now(),
            name: `${name} (${element})`,
            volume: parseFloat(document.getElementById('volume').value),
            storage: currentLvl1Storage / 1000,
            emissions: currentLvl1Emissions / 1000
        });
        renderLvl1Boq();
    });

    function renderLvl1Boq() {
        const list = document.getElementById('boq-list');
        list.innerHTML = '';
        let totalVol = 0, totalStorage = 0, totalEmissions = 0;

        lvl1Boq.forEach(item => {
            totalVol += item.volume;
            totalStorage += item.storage;
            totalEmissions += item.emissions;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.name}</td><td>${item.volume.toFixed(3)}</td><td>${item.storage.toFixed(3)}</td><td>${item.emissions.toFixed(3)}</td><td><button class="btn btn-outline" style="padding: 2px 8px;" onclick="removeLvl1Item(${item.id})">×</button></td>`;
            list.appendChild(row);
        });

        document.getElementById('boq-total-vol').textContent = totalVol.toFixed(2);
        document.getElementById('boq-total-storage').textContent = totalStorage.toFixed(3);
        document.getElementById('boq-total-emissions').textContent = totalEmissions.toFixed(3);
        updateLvl1Calculations();
    }

    window.removeLvl1Item = (id) => {
        lvl1Boq = lvl1Boq.filter(i => i.id !== id);
        renderLvl1Boq();
    };

    function updateLvl1Calculations() {
        const activityStorage = parseFloat(document.getElementById('boq-total-storage').textContent) || 0;
        const activityEmissions = parseFloat(document.getElementById('boq-total-emissions').textContent) || 0;
        const activityNet = activityStorage - activityEmissions;

        let baselineStorage = 0, baselineEmissions = 0;
        if (currentMode === 'opt2') {
            baselineStorage = parseFloat(document.getElementById('base_storage').value) || 0;
            baselineEmissions = parseFloat(document.getElementById('base_emissions').value) || 0;
        }
        const baselineNet = baselineStorage - baselineEmissions;
        const netBenefit = activityNet - baselineNet;

        document.getElementById('activity-net-val').textContent = activityNet.toFixed(3);
        document.getElementById('baseline-net-val').textContent = baselineNet.toFixed(3);

        const resultEl = document.getElementById('compliance-result');
        const isCompliant = activityNet > baselineNet;
        resultEl.className = isCompliant ? "info-box info-box-success" : "info-box info-box-error";
        resultEl.textContent = isCompliant ? "COMPLIANT: Net Removal Benefit Generated" : "NON-COMPLIANT: No Net Benefit";

        // Summary
        document.getElementById('sum-mode').textContent = currentMode === 'opt1' ? 'Option 1' : 'Option 2';
        document.getElementById('sum-compliance').textContent = isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT';
        document.getElementById('sum-compliance').style.color = isCompliant ? 'var(--color-success)' : 'var(--color-error)';
        document.getElementById('sum-tncrb').textContent = netBenefit.toFixed(3) + ' t';

        // Risk
        const periodRate = parseFloat(document.getElementById('storage_period').value);
        let riskRate = 0;
        if (document.getElementById('risk_flooding').checked) riskRate += 0.005;
        if (document.getElementById('risk_subsidence').checked) riskRate += 0.005;
        if (document.getElementById('risk_moisture').checked) riskRate += 0.002;
        const totalRate = periodRate + riskRate;
        const bufferUnits = activityStorage * totalRate;
        document.getElementById('total-buffer-rate').textContent = (totalRate * 100).toFixed(1);
        document.getElementById('buffer-units').textContent = bufferUnits.toFixed(3);
        
        updateFinancialLvl1(netBenefit);
    }

    // --- LEVEL 2 LOGIC ---
    const estStrType = document.getElementById('est_str_type');
    const estBioPct = document.getElementById('est_bio_pct');
    const estForm = document.getElementById('uww-estimator-form');

    function populateBioPct() {
        estBioPct.innerHTML = '';
        const type = estStrType.value;
        const typical = uwwData[type].bio;
        [typical - 10, typical, typical + 10].forEach(val => {
            if (val > 0 && val <= 100) {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = `${val.toFixed(1)}%`;
                if (val === typical) opt.selected = true;
                estBioPct.appendChild(opt);
            }
        });
    }

    estStrType.addEventListener('change', populateBioPct);
    populateBioPct();

    estForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const area = parseFloat(document.getElementById('est_area').value);
        const type = estStrType.value;
        const data = uwwData[type];

        const volMin = area * data.wuiMin;
        const volMax = area * data.wuiMax;

        const cltFactor = 470 * (1 / (1 + 0.12)) * 0.5 * (44 / 12);
        const storageMin = (volMin * cltFactor) / 1000;
        const storageMax = (volMax * cltFactor) / 1000;

        document.getElementById('est-wui-range').textContent = `${data.wuiMin.toFixed(2)} - ${data.wuiMax.toFixed(2)}`;
        document.getElementById('est-vol-range').textContent = `${volMin.toFixed(0)} - ${volMax.toFixed(0)}`;
        document.getElementById('est-storage-range').textContent = `${storageMin.toFixed(1)} - ${storageMax.toFixed(1)}`;
        
        document.getElementById('est-result').style.display = 'block';
        updateFinancialLvl2(storageMin, storageMax);
    });

    // --- LEVEL 3 LOGIC ---
    const advMaterial = document.getElementById('elem_material');
    const editDensity = document.getElementById('edit_density');
    const editCarbon = document.getElementById('edit_carbon');
    const editUrr = document.getElementById('edit_urr');

    advMaterial.addEventListener('change', () => {
        const mat = materialData[advMaterial.value];
        if (mat) {
            editDensity.value = mat.density;
            editCarbon.value = mat.carbon;
            editUrr.value = mat.urr;
        }
    });

    document.getElementById('add-adv-elem').addEventListener('click', () => {
        const area = parseFloat(document.getElementById('elem_area').value);
        const matName = advMaterial.value;
        const density = parseFloat(editDensity.value);
        const carbon = parseFloat(editCarbon.value) / 100;
        const urr = parseFloat(editUrr.value);
        
        const volume = area * 0.15; 
        const storage = (volume * density * (1 / (1 + 0.12)) * carbon * (44 / 12)) / 1000;

        lvl3Boq.push({ id: Date.now(), name: matName, area, storage, urr });
        renderLvl3Boq();
    });

    function renderLvl3Boq() {
        const list = document.getElementById('adv-boq-list');
        list.innerHTML = '';
        let total = 0;
        lvl3Boq.forEach(item => {
            total += item.storage;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.name}</td><td>${item.area}</td><td>${item.storage.toFixed(3)}</td><td>${item.urr}</td><td><button class="btn btn-outline" style="padding: 2px 8px;" onclick="removeLvl3Item(${item.id})">×</button></td>`;
            list.appendChild(row);
        });
        document.getElementById('adv-total-storage').textContent = total.toFixed(3);
        updateFinancialLvl3(total);
    }

    // --- FINANCIALS ---
    function updateFinancialLvl1(net) {
        const price = parseFloat(document.getElementById('value_method_lvl1').value);
        document.getElementById('sum-financial-value').textContent = '€' + (net * price).toLocaleString(undefined, {minimumFractionDigits: 2});
    }
    function updateFinancialLvl2(min, max) {
        const price = parseFloat(document.getElementById('value_method_lvl2').value);
        document.getElementById('est-financial-value-range').textContent = `€${(min * price).toLocaleString(undefined, {maximumFractionDigits:0})} - €${(max * price).toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    function updateFinancialLvl3(total) {
        const price = parseFloat(document.getElementById('value_method_lvl3').value);
        document.getElementById('adv-financial-value').textContent = '€' + (total * price).toLocaleString(undefined, {minimumFractionDigits: 2});
    }

    function updateAllFinancials() {
        updateLvl1Calculations();
        const estText = document.getElementById('est-storage-range').textContent;
        if (estText !== '—') {
            const parts = estText.split(' - ').map(parseFloat);
            updateFinancialLvl2(parts[0], parts[1]);
        }
        updateFinancialLvl3(parseFloat(document.getElementById('adv-total-storage').textContent) || 0);
    }

    document.getElementById('value_method_lvl1').addEventListener('change', updateLvl1Calculations);
    document.getElementById('value_method_lvl2').addEventListener('change', () => {
        const parts = document.getElementById('est-storage-range').textContent.split(' - ').map(parseFloat);
        updateFinancialLvl2(parts[0], parts[1]);
    });
    document.getElementById('value_method_lvl3').addEventListener('change', () => {
        updateFinancialLvl3(parseFloat(document.getElementById('adv-total-storage').textContent));
    });

    advMaterial.dispatchEvent(new Event('change'));
    window.removeLvl3Item = (id) => { lvl3Boq = lvl3Boq.filter(i => i.id !== id); renderLvl3Boq(); };
    window.removeLvl1Item = (id) => { lvl1Boq = lvl1Boq.filter(i => i.id !== id); renderLvl1Boq(); };

    const riskInputs = document.querySelectorAll('#risk-assessment input, #risk-assessment select');
    riskInputs.forEach(i => i.addEventListener('change', updateLvl1Calculations));
    
    const baselineInputs = document.querySelectorAll('#baseline-section input');
    baselineInputs.forEach(i => i.addEventListener('input', updateLvl1Calculations));
});
