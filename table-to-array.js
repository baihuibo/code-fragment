/**
 * Created by baihuibo on 16/3/11.
 */
/**
 * 将表格的行列转换为二维数组
 * @param thead {HTMLTheadElement | TrElement[]} thead元素或者 tr 数组
 * @param tbody {HTMLTbodyElement | TrElement[]} tbody元素或者 tr 的数组
 * @returns {{headers, bodys}}
 */
function tableToArray(thead, tbody) {
    thead = toArray(thead.rows || thead);
    tbody = toArray(tbody.rows || tbody);

    var headers = thead.map(function (tr) {
        var row = [];
        row._tr = tr;
        return row
    });

    return {
        headers: normals(formatHeaders(headers)),
        bodys: formatBodys(tbody)
    };
}

function normals(headers) {
    headers.forEach(function (row, idx) {
        row.forEach(function (col, i) {
            if (!col) {
                row[i] = getValue(i, idx, headers); //竖着找
            }
        });
    });
    return headers;
}

function getValue(i, idx, headers) {
    var j;
    for (j = idx; j < headers.length; j++) {
        if (headers[j][i]) {
            return headers[j][i];
        }
    }

    for (j = headers.length - 1; j >= 0; j--) {
        if (headers[j][i]) {
            return headers[j][i];
        }
    }
}

function formatBodys(bodys) {
    var rows = [];

    bodys.forEach(function (tr) {
        rows.push(toArray(tr.cells).map(getText));
    });

    return rows;
}

function formatHeaders(rows) {
    rows.forEach(function (row, rowIdx) {
        toArray(row._tr.cells).forEach(function (cell) {
            var val = getText(cell);
            var rowSpan = cell.rowSpan || 1,
                colSpan = cell.colSpan || 1;
            cellPut(rows, rowIdx, rowSpan, colSpan, val);
        });
    });

    function cellPut(arr, rid, rSpan, cSpan, val) {
        var x = getStartX(arr[rid]);
        var row;
        for (var i = 0; i < rSpan; i++) {
            row = arr[rid + i];
            for (var j = 0; j < cSpan; j++) {
                row[x + j] = val;
            }
        }
    }

    function getStartX(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === void 0) {
                return i;
            }
        }
        return i;
    }
}

function toArray(els) {
    return [].slice.call(els, 0);
}

function getText(el) {
    return el ? (el.innerText || el.textContent || '').trim() || '' : '';
}