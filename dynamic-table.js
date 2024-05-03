// ---------------
// Hot to use:
// const columns = ['name', 'age', 'email', 'actions'];
// const data = [ { id: 1, name: 'Sasha', age: 20, email: 'test@gmail.com'}];
// const table = new DynamicTable('#data', columns, data);
// table.render();
// ---------------
class DynamicTable {
    constructor(container, columns, data, actions, styleClasses = {}) {
        this.container = container;
        this.columns = columns;
        this.data = data;
        this.styleClasses = {
            table: styleClasses.table || 'table',
            rowPrefix: styleClasses.rowPrefix || 'row',
            cell: styleClasses.cell || 'cell',
        };
        this.actions = { 
            delete: () => { console.log('Delete was triggered'); }, 
            edit: () => { console.log('Edit was triggered') },
            ...actions
        };
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
                        html += `<button data-selector="${this.container}" data-type="${action}" data-id="${dataItem.id}" style="margin-right:5px">${action}</button>`;
                    });
                    html += `</td>`;
                    return;
                }
                const dataValue = dataItem[col] ? dataItem[col] : '';
                html += `<td class="${this.styleClasses.cell}" data-property="${col}" data-value="${dataValue}">${dataValue}</td>`
            });
            html += '</tr>';
        });
        html += '</table>';
        insertToEl.innerHTML = html;

        function handleActionClick(event) {
            const target = event.target;
            const id = target.getAttribute('data-id');
            const type = target.getAttribute('data-type');
            if (self.actions[type]) {
                self.actions[type](id);
                return
            }
            console.log(`Action ${type} was triggered for id ${id}, but no handler was found`);
        }

        const buttons = insertToEl.querySelectorAll('table button');
        buttons.forEach((button) => {
            button.addEventListener('click', handleActionClick);
        });
    }
}
