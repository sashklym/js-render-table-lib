// ---------------
// ***************
// This is a simple class that renders a table with dynamic columns and data. 
// It also allows to add actions for each row.
// ***************
// How to use:
// const columns = ['name', 'age', 'email', { name: 'actions', list: [{ type: 'delete', name: 'delete me' }];
// const data = [ { id: 1, name: 'Sasha', age: 20, email: 'test@gmail.com'}];
// const actions = { delete: (id) => { console.log('Delete was triggered for id', id); } };
// new DynamicTable('#data', columns, data, actions, { table: 'table', rowPrefix: 'row', cell: 'cell' });
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
        this.render();
    }

    render() {
        const insertToEl = document.querySelector(this.container);
        if (!insertToEl) {
            console.error(`Element with selector ${this.container} was not found`);
            return;
        }
        const html = `
            <table class=${this.styleClasses.table}>
                ${this._renderHeaderRow()}
                ${this._renderDataRows()}
            </table>
        `;
        insertToEl.insertAdjacentHTML('beforeend', html);

        const buttons = insertToEl.querySelectorAll('table button');
        buttons.forEach((button) => {
            button.addEventListener('click', this._handleActionClick.bind(this));
        });
    }

    _handleActionClick(event) {
        const target = event.target;
        const id = target.getAttribute('data-id');
        const type = target.getAttribute('data-type');
        if (this.actions[type]) {
            this.actions[type](id);
            return
        }
        console.log(`Action ${type} was triggered for id ${id}, but no handler was found`);
    }

    _renderDataRows() {
        let html = '';
        this.data.forEach((dataItem) => {
            html += `<tr class="${this.styleClasses.rowPrefix}-${dataItem.id}">`;
            this.columns.forEach((col) => {
                const isPropertyCol = typeof col !== 'string';
                if (isPropertyCol) {
                    html += `<td>`;
                    col.list.forEach((action) => {
                        html += `<button data-selector="${this.container}" data-type="${action.type}" data-id="${dataItem.id}" style="margin-right:5px">${action.name}</button>`;
                    });
                    html += `</td>`;
                    return;
                }
                const dataValue = dataItem[col] ? dataItem[col] : '';
                html += `<td class="${this.styleClasses.cell}" data-property="${col}" data-value="${dataValue}">${dataValue}</td>`;
            });
            html += '</tr>';
        });
        return html;
    }

    _renderHeaderRow() {
        let html = '<tr>';
        this.columns.forEach((col) => {
            const isPropertyCol = typeof col !== 'string';
            html += `<th>${(isPropertyCol ? col.name : col).toUpperCase()}</th>`;
        });
        html += '</tr>';
        return html;
    }
}
