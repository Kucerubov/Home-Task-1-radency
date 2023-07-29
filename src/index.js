const testData = [
    {
        name: "Запись 1",
        created: "July 28, 2023",
        category: "Task",
        content: "Содержимое записи 1",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "July 27, 2023",
        category: "Idea",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "July 26, 2023",
        category: "Random Thought",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "July 25, 2023",
        category: "Idea",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "July 24, 2023",
        category: "Task",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "July 23, 2023",
        category: "Random Thought",
        content: "Содержимое записи 2",
        dates: "",
        archived: true
    },
    {
        name: "Запись 2",
        created: "July 22, 2023",
        category: "Idea",
        content: "Содержимое записи 2",
        dates: "",
        archived: true
    },
    {
        name: "Запись 2",
        created: "July 21, 2023",
        category: "Task",
        content: "Содержимое записи 2",
        dates: "",
        archived: true
    }
];

function renderTable(showArchivedData = false) {
    const table = document.getElementById("myTable");
    table.innerHTML = '';

    const headerRow = table.insertRow(0);
    headerRow.innerHTML = '<th></th><th>Name</th><th>Created</th><th>Category</th><th>Content</th><th>Dates</th><th></th><th></th><th></th>';

    testData.forEach((value, index) => {
        let row = table.insertRow(index + 1);
        if (value.archived === showArchivedData){
          row.innerHTML = `
                <td>a</td>
            <td>${value.name}</td>
            <td>${value.created}</td>
            <td>${value.category}</td>
            <td>${value.content}</td>
            <td>${value.dates}</td>
            <td>${value.archived ? '<button onclick="archiveRow(this)">Unzip</button>' : '<button onclick="archiveRow(this)">Archive</button>'}</td>
            <td><button onclick="editRow(this)">Edit</button></td>
            <td><button onclick="deleteRow(this)">Delte</button></td>
                `;
        }
    })
}

// изменить
function addNewRow() {
    const num = testData.length + 1;
    const currentDate = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    testData.push({
        name: `Запись ${num}`,
        created: formattedDate,
        category: `Task`,
        content: `Содержимое записи ${num}`,
        dates: "",
        archived: false
    });

    renderCategoryTable();
    renderTable();
}


 function archiveRow(button) {
     const row = button.parentNode.parentNode;
     const rowIndex = row.rowIndex - 1;
     const rowData = testData[rowIndex];

     if (!rowData.archived) {
         rowData.archived = true;
         renderCategoryTable();
         renderTable();
     }else {
         rowData.archived = false;
         renderCategoryTable();
         renderTable();
     }
 }

function saveChanges(row, cells, editButton) {
    const name = cells[1].getElementsByTagName("input")[0].value;
    const category = cells[3].getElementsByTagName("select")[0].value;
    const content = cells[4].getElementsByTagName("input")[0].value;
    const dates = cells[5].getElementsByTagName("input")[0].value;


    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dates) || dates === '') {
        alert("Invalid data! Insert YYYY-MM-DD.");
        return;
    }

    const rowIndex = row.rowIndex - 1;
    testData[rowIndex].name = name;
    testData[rowIndex].category = category;
    testData[rowIndex].content = content;
    testData[rowIndex].dates = dates;

    cells[1].innerHTML = name;
    cells[3].innerHTML = category;
    cells[4].innerHTML = content;
    cells[5].innerHTML = dates;

    row.classList.remove("editing");
    editButton.innerHTML = "Edit";
    renderCategoryTable();
}

function enterEditMode(row, cells, currentCategory, categories, editButton) {
    for (let i = 1; i < cells.length - 3; i++) {
        if (i !== 2) {
            const cellValue = cells[i].innerHTML;
            if (i === 3) {
                let selectHTML = '<select>';
                categories.forEach((category) => {
                    selectHTML += `<option value="${category}" ${category === currentCategory ? 'selected' : ''}>${category}</option>`;
                });
                selectHTML += '</select>';
                cells[i].innerHTML = selectHTML;
            } else {
                cells[i].innerHTML = `<input type="text" value="${cellValue}">`;
            }
        }
    }
    row.classList.add("editing");
    editButton.innerHTML = "Save";
}

function editRow(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName("td");
    const editButton = button;
    const currentCategory = cells[3].innerText;
    const categories = ["Task", "Idea", "Random Thought"];

    if (row.classList.contains("editing")) {
        saveChanges(row, cells, editButton);
    } else {
        enterEditMode(row, cells, currentCategory, categories, editButton);
    }
}


function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const rowIndex = row.rowIndex;
    testData.splice(rowIndex - 1, 1);
    renderCategoryTable();
    renderTable();
}
 const categoryData = [];

 function updateCategoryData() {
     categoryData.length = 0;
     testData.forEach((item) => {
         const category = item.category;
         const archivedCount = item.archived ? 0 : 1;
         const unarchivedCount = item.archived ? 1 : 0;

         const existingCategory = categoryData.find((categoryItem) => categoryItem.category === category);

         if (existingCategory) {
             existingCategory.archivedCount += archivedCount;
             existingCategory.unarchivedCount += unarchivedCount;
         } else {
             categoryData.push({
                 category: category,
                 archivedCount: archivedCount,
                 unarchivedCount: unarchivedCount
             });
         }
     });
 }

 function renderCategoryTable() {
     updateCategoryData();
     const table = document.getElementById("noteCategory");
     table.innerHTML = '';

     const headerRow = table.insertRow(0);
     headerRow.innerHTML = '<th>a</th><th>Note Category</th><th>Active</th><th>Archived</th>';

     categoryData.forEach((value, index) => {
         let row = table.insertRow(index + 1);
         row.innerHTML = `
          <td>a</td>
          <td>${value.category}</td>
          <td>${value.archivedCount}</td>
          <td>${value.unarchivedCount}</td>
        `;
     })
 }

 renderTable();
 renderCategoryTable();