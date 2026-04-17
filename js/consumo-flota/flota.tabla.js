/**
 * flota.tabla.js
 * Render de tabla principal de consumo de flota
 */

'use strict';

const FlotaTabla = {
    _tbodyId: 'tbodyFlota',
    _contadorId: 'contadorFlota',

    render(data = []) {
        const tbody = document.getElementById(this._tbodyId);
        if (!tbody) {
            console.error(`No existe #${this._tbodyId}`);
            return;
        }

        if (!Array.isArray(data) || !data.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="12" style="text-align:center;padding:24px;color:var(--text-muted)">
                        No hay datos de flota para la semana seleccionada.
                    </td>
                </tr>`;
            this.actualizarContador(0);
            return;
        }

        tbody.innerHTML = data.map(g => this.buildRow(g)).join('');
        this.actualizarContador(data.length);
    },

    actualizarContador(total) {
        const el = document.getElementById(this._contadorId);
        if (el) el.textContent = `${total} unidad${total === 1 ? '' : 'es'}`;
    },

    buildRow(g) {
        const placa = Array.isArray(g.p) && g.p.length ? g.p[0] : '-';
        const responsable = g.r || '-';
        const area = g.area || '-';

        const labelBaja =
            g.baja && g.baja !== 'null' && g.baja !== ''
                ? `<span class="badge-baja-label"><i class="fas fa-arrow-down"></i>BAJA</span>`
                : '';

        const dias = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
        const diasHtml = dias.map(d => {
            const val = g[d];
            const hasVal = val !== undefined && val !== null && val !== '' && !isNaN(parseFloat(val));
            return `
                <td class="text-center" data-label="${d}">
                    <span class="day-value ${hasVal ? 'has-value' : ''}">
                        ${hasVal ? parseFloat(val).toFixed(2) : '-'}
                    </span>
                </td>`;
        }).join('');

        const asignado = this._fmt(g.a);
        const usado = this._fmt(g.u);
        const saldo = this._fmt(g.s);

        return `
            <tr>
                <td data-label="PLACA">
                    <div class="placa-wrap">
                        <span class="placa-btn" style="pointer-events:none;cursor:default;">
                            ${placa}
                        </span>
                        ${labelBaja}
                    </div>
                </td>
                <td data-label="RESPONSABLE">${responsable}</td>
                <td data-label="ÁREA">${area}</td>
                ${diasHtml}
                <td class="text-center" data-label="ASIGNADO">
                    <span class="cant-value">${asignado}</span>
                </td>
                <td class="text-center" data-label="USADO">
                    <span class="cant-value">${usado}</span>
                </td>
                <td class="text-center" data-label="SALDO">
                    <span class="cant-value">${saldo}</span>
                </td>
            </tr>`;
    },

    _fmt(val) {
        const num = parseFloat(val);
        return Number.isFinite(num) ? num.toFixed(2) : '-';
    }
};
