class DynamicTable {
    constructor(container, columns, data, onEdit, onDelete, styleClasses = {}) {
        this.container = container;
        this.columns = columns;
        this.data = data;
        this.styleClasses = {
            table: styleClasses.table || 'table',
            rowPrefix: styleClasses.rowPrefix || 'row',
            cell: styleClasses.cell || 'cell',
        };
        this.onEdit = onEdit;
        this.onDelete = onDelete;
    }

    render() {
        const self = this;
        const insertToEl = document.querySelector(this.container);
        if (!insertToEl) {
            return;
        }
        let html = `<table class=${this.styleClasses.table}><tr>`;
        this.columns.forEach((col) => {
            const isPropertyCol = typeof col !== 'string';
            html += `<th>${(isPropertyCol ? col.name : col).toUpperCase()}</th>`
        });
        html += '</tr>';

        this.data.forEach((dataItem) => {
            html += `<tr class="${this.styleClasses.rowPrefix}-${dataItem.id}">`;
            this.columns.forEach((col) => {
                const isPropertyCol = typeof col !== 'string';
                if (isPropertyCol) {
                    html += `<td>`;
                    col.list.forEach((action) => {
                        html += `<button data-selector="${this.container}" data-type="${action}" data-user="${dataItem.id}" style="margin-right:5px">${action}</button>`;
                    });
                    html += `</td>`;
                    return;
                }
                const dataValue = dataItem[col] ? dataItem[col] : '';
                html += `<td class=${this.styleClasses.cell} data-property="${col}" data-value="${dataValue}">${dataValue}</td>`
            });
            html += '</tr>';
        });
        html += '</table>';
        insertToEl.innerHTML = html;

        function handleButtonClick(event) {
            const target = event.target;
            const id = target.getAttribute('data-user');
            const type = target.getAttribute('data-type');
            if (type === 'edit') {
                self.onEdit(event.target);
                return;
            }
            self.onDelete(id);
            const removedEl = insertToEl.querySelector(`.user-${id}`);
            removedEl.classList.add('hide');
        }
        
        const buttons = insertToEl.querySelectorAll('table button');
        buttons.forEach((button) => {
            button.addEventListener('click', handleButtonClick);
        });    
    }
}
