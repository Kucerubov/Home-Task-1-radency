 const testData = [
    {
        name: "Запись 1",
        created: "2023-07-27",
        category: "Task",
        content: "Содержимое записи 1",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "2023-07-28",
        category: "Idea",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "2023-07-28",
        category: "Random Thought",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "2023-07-28",
        category: "Idea",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 2",
        created: "2023-07-28",
        category: "Task",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    }
];

function renderTable() {
    const table = document.getElementById("myTable");
    table.innerHTML = ''; // Очистка таблицы

    const headerRow = table.insertRow(0);
    headerRow.innerHTML = '<th>a</th><th>Name</th><th>Created</th><th>Category</th><th>Content</th><th>Dates</th><th>a</th><th>a</th><th>a</th>';

    testData.forEach((value, index) => {
        let row = table.insertRow(index + 1);
        if (!value.archived){
            row.innerHTML = `
          <td>a</td>
          <td>${value.name}</td>
          <td>${value.created}</td>
          <td>${value.category}</td>
          <td>${value.content}</td>
          <td>${value.dates}</td>
          <td><button onclick="archiveRow(this)">Архивировать</button></td>
          <td><button onclick="editRow(this)">Редактировать</button></td>
          <td><button onclick="deleteRow(this)">Удалить</button></td>
        `;
        }
    })
}

function addNewRow() {
    const num = testData.length + 1;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = year + '-' + month + '-' + day;

    testData.push(
    {
        name: `Запись ${num}`,
        created: formattedDate,
        category: `Категория ${num}`,
        content: `Содержимое записи ${num}`,
        dates: ""
    }
    )
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
         console.log(testData);
     }
 }

// Функция для редактирования строки
 function editRow(button) {
     const row = button.parentNode.parentNode;
     const cells = row.getElementsByTagName("td");
     const editButton = button;
     const currentCategory = cells[3].innerText;

     const categories = ["Task", "Idea", "Random Thought"];

     if (row.classList.contains("editing")) {

         const name = cells[1].getElementsByTagName("input")[0].value;
         const category = cells[3].getElementsByTagName("select")[0].value;
         const content = cells[4].getElementsByTagName("input")[0].value;
         const dates = cells[5].getElementsByTagName("input")[0].value;

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
     } else {
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
             // Если категория уже существует, увеличиваем соответствующие счетчики
             existingCategory.archivedCount += archivedCount;
             existingCategory.unarchivedCount += unarchivedCount;
         } else {
             // Если категории нет, добавляем ее в массив categoryData
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