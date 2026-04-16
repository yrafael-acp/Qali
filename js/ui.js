/* ============================================================
   UI UPDATE
============================================================ */
function actualizarUI(data) {
    stockTotalDiesel  = parseFloat(data.stocks?.diesel)  || 0;
    stockTotalGasohol = parseFloat(data.stocks?.gasohol) || 0;

    document.getElementById('sDiesel').textContent  = stockTotalDiesel.toFixed(2);
    document.getElementById('sGasohol').textContent = stockTotalGasohol.toFixed(2);

    actualizarDesgloseLocal();
}

function actualizarDesgloseLocal() {
    const isoD = parseFloat(document.getElementById('inputIsoDiesel')?.value)  || 0;
    const isoG = parseFloat(document.getElementById('inputIsoGasohol')?.value) || 0;
    const td   = stockTotalDiesel  - isoD;
    const tg   = stockTotalGasohol - isoG;

    const elTD = document.getElementById('tanqueDiesel');
    const elTG = document.getElementById('tanqueGasohol');
    if (elTD) { elTD.textContent = td.toFixed(2) + ' gl'; elTD.style.color = td < 0 ? 'var(--danger)' : ''; }
    if (elTG) { elTG.textContent = tg.toFixed(2) + ' gl'; elTG.style.color = tg < 0 ? 'var(--danger)' : ''; }
}

async function actualizarReservaNube(prod) {
    actualizarDesgloseLocal();
    const id  = prod === 'diesel' ? 'inputIsoDiesel' : 'inputIsoGasohol';
    const val = parseFloat(document.getElementById(id).value) || 0;
    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateReservas',
                sucursal: getSucursalActual(),
                producto: prod,
                cantidad: val
            })
        });
    } catch(e) { console.warn('Error sincronizando reserva:', e); }
}
