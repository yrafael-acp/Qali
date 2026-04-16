/**
 * flota.tabla.js
 * Renderizado de la tabla principal de flota y filtros
 */

'use strict';

const FlotaTabla = {

    /**
     * Renderiza la tabla completa con los datos de flota
     * @param {Array} datos
     */
    render(datos) {
    console.log("Datos recibidos de la nube:", datos);
    const cuerpo = document.getElementById('cuerpoTabla');
    cuerpo.innerHTML = '';

    if (!datos || datos.length === 0) {
        FlotaUI.actualizarContador(0);
        return;
    }

    const fechaFinSemana = new Date(FlotaState.lunesReferencia);
    fechaFinSemana.setDate(fechaFinSemana.getDate() + 6);
    fechaFinSemana.setHours(23, 59, 59, 999);

    const datosFiltrados = datos.filter(g => {
        if (!g.fAlta || g.fAlta === 'null' || g.fAlta === '-') return true;

        try {
            const [dia, mes, anio] = g.fAlta.split('/');
            const fechaAlta = new Date(Number(anio), Number(mes) - 1, Number(dia), 0, 0, 0);
            return fechaAlta <= fechaFinSemana;
        } catch (e) {
            console.warn("Error parseando fecha de alta:", g.fAlta);
            return true;
        }
    });

    if (datosFiltrados.length === 0) {
        FlotaUI.actualizarContador(0);
        return;
    }

    datosFiltrados.forEach(g => {
        const fila = this._buildRow(g);
        cuerpo.insertAdjacentHTML('beforeend', fila);
    });

    FlotaUI.actualizarContador(datosFiltrados.length);
},

    /**
     * Construye el HTML de una fila
     * @private
     */
    _buildRow(g) {
    const placa = g.p[0];
    const idVinculo = g.id || placa;
    const esAdmin = sessionStorage.getItem('rolGrifo') === 'ADMIN';

    const labelBaja = (g.baja && g.baja !== 'null' && g.baja !== '')
        ? `<span class="badge-baja-label"><i class="fas fa-arrow-down"></i>BAJA</span>` : '';

    const idHtml = esAdmin
        ? `<div class="placa-id-ref">ID: ${idVinculo}</div>`
        : '';

    const dias = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
    const diasHtml = dias.map(d => {
        const val = g[d];
        const hasVal = val && parseFloat(val) > 0;
        return `<td class="text-center" data-label="${d}">
                    <span class="day-value ${hasVal ? 'has-value' : ''}">
                        ${hasVal ? parseFloat(val).toFixed(2) : '-'}
                    </span>
                </td>`;
    }).join('');

    return `
        <tr>
            <td data-label="PLACA">
                <div class="placa-wrap">
                    <button onclick="FlotaModales.abrirEditarFlota('${placa}', 0)" class="placa-btn">
                        <i class="fas fa-pencil-alt edit-icon"></i>${placa}
                    </button>
                    ${idHtml}
                </div>
            </td>
            <td data-label="RESPONSABLE">
                <div class="resp-name">${g.r}${labelBaja}</div>
                <div class="resp-area">${g.area}</div>
            </td>
            ${diasHtml}
            <td class="cons-cell" data-label="SEMANA">
                ${parseFloat(g.totalSemana || 0).toFixed(2)}
            </td>
            <td class="cons-cell" data-label="MES">
                ${parseFloat(g.totalMes || 0).toFixed(2)}
            </td>
        </tr>`;
},

    /**
     * Filtra las filas de la tabla por texto
     */
    filtrar() {
        const q = document.getElementById('buscador').value.toUpperCase();
        const filas = document.querySelectorAll('#cuerpoTabla tr');
        let visibles = 0;

        filas.forEach(r => {
            const match = r.innerText.toUpperCase().includes(q);
            r.style.display = match ? '' : 'none';
            if (match) visibles++;
        });

        FlotaUI.actualizarContador(visibles);
    },
};

// Expose para HTML onkeyup
function filtrarTabla() { FlotaTabla.filtrar(); }
