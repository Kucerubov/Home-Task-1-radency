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
        name: "Запись 3",
        created: "July 26, 2023",
        category: "Random Thought",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 4",
        created: "July 25, 2023",
        category: "Idea",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 5",
        created: "July 24, 2023",
        category: "Task",
        content: "Содержимое записи 2",
        dates: "",
        archived: false
    },
    {
        name: "Запись 6",
        created: "July 23, 2023",
        category: "Random Thought",
        content: "Содержимое записи 2",
        dates: "",
        archived: true
    },
    {
        name: "Запись 7",
        created: "July 22, 2023",
        category: "Idea",
        content: "Содержимое записи 2",
        dates: "",
        archived: true
    },
    {
        name: "Запись 8",
        created: "July 21, 2023",
        category: "Task",
        content: "Содержимое записи 2",
        dates: "",
        archived: true
    }
];

let showArchivedData = false;

document.querySelector("#toggleButton").addEventListener("click", toggleRenderTable);

function toggleRenderTable() {
    if (showArchivedData) {
        renderTable();
        this.innerText = "See archive note";
    } else {
        renderTable(true);
        this.innerText = "Hide archive note";
    }
    showArchivedData = !showArchivedData;
}


 function renderTable(showArchive = false) {
    const table = document.getElementById("myTable");
    table.innerHTML = '<table class="table table-bordered" id="myTable">';

    table.innerHTML = `
           <tr class="header">
           <th>Name</th>
           <th>Created</th>
           <th>Category</th>
           <th>Content</th>
           <th>Dates</th>
           <th class="text-right">
              <i class="fas fa-archive"></i>
              <i class="fas fa-trash"></i>
           </th>
           </tr>`;

    testData.forEach((value, index) => {
        let row = table.insertRow(index + 1);
        if (value.archived === showArchive){
          row.innerHTML =
          `
          <tr>
            <td>${value.name}</td>
            <td>${value.created}</td>
            <td>${value.category}</td>
            <td>${value.content}</td>
            <td>${value.dates}</td>
            <td class="text-right">
                <button class="icon-btn" onclick="editRow(this)">
                    <i class="fas fa-edit"></i>
                </button>
                ${value.archived ? '<button class="icon-btn" onclick="archiveRow(this)">Unzip</button>' : '<button class="icon-btn" onclick="archiveRow(this)"><i class="fas fa-archive"></i></button>'}
                <button class="icon-btn" onclick="deleteRow(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>`;
        }
    })
}

function addNewRow() {
    try {
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
    } catch (error) {
        console.error("An error occurred while adding a new row:", error);
    }
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
    const name = cells[0].getElementsByTagName("input")[0].value;
    const category = cells[2].getElementsByTagName("select")[0].value;
    const content = cells[3].getElementsByTagName("input")[0].value;
    const dates = cells[4].getElementsByTagName("input")[0].value;

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

    cells[0].innerHTML = name;
    cells[2].innerHTML = category;
    cells[3].innerHTML = content;
    cells[4].innerHTML = dates;

    row.classList.remove("editing");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    renderCategoryTable();
}

function enterEditMode(row, cells, currentCategory, categories, editButton) {
    for (let i = 0; i < cells.length - 1; i++) {
        if (i !== 1) {
            const cellValue = cells[i].innerHTML;
            if (i === 2) {
                const selectOptions = categories.map(category => {
                    const selectedAttribute = category === currentCategory ? 'selected' : '';
                    return `<option value="${category}" ${selectedAttribute}>${category}</option>`;
                });
                cells[i].innerHTML = '<select>' + selectOptions.join('') + '</select>';
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
    const currentCategory = cells[2].innerText;
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
     table.innerHTML = ' <table class="table table-bordered" id="noteCategory">';
     table.innerHTML = `
        <tr class="header-archive">
            <th>Note Category</th>
            <th>Active</th>
            <th>Archived</th>
        </tr>`;

     categoryData.forEach((value, index) => {
         let row = table.insertRow(index + 1);
         row.innerHTML = `
          <tr>
            <td>${value.category}</td>
            <td>${value.archivedCount}</td>
            <td>${value.unarchivedCount}</td>
          </tr>
        `;
     })
 }

 renderTable();
 renderCategoryTable();