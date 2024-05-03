class DynamicTable {
    constructor(container, columns, data, onEdit, onDelete) {
        this.container = container;
        this.columns = columns;
        this.data = data;
        this.onEdit = onEdit;
        this.onDelete = onDelete;
    }

    render() {
        const self = this;
        const insertToEl = document.querySelector(this.container);
        if (!insertToEl) {
            return;
        }
        let html = '<table><tr>';
        this.columns.forEach((col) => {
            const isPropertyCol = typeof col !== 'string';
            html += `<th>${(isPropertyCol ? col.name : col).toUpperCase()}</th>`
        });
        html += '</tr>';

        this.data.forEach((dataItem) => {
            html += `<tr class="user-${dataItem.id}">`;
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
                html += `<td data-property="${col}" data-value="${dataValue}">${dataValue}</td>`
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
