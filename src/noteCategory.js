const testNoteData = [
    {
        name: 'Task',
        active: 0,
        archive: 0
    },
    {
        name: 'Random Thought',
        active: 0,
        archive: 0
    }
];

function renderCategoryTable() {
    const table = document.getElementById("noteCategory");
    table.innerHTML = ''; // Очистка таблицы

    const headerRow = table.insertRow(0);
    headerRow.innerHTML = '<th>a</th><th>Note Category</th><th>Active</th><th>Archived</th>';

    testNoteData.forEach((value, index) => {
        let row = table.insertRow(index + 1);
        row.innerHTML = `
          <td>a</td>
          <td>${value.name}</td>
          <td>${value.active}</td>
          <td>${value.archive}</td>
        `;
    })
}

renderCategoryTable();