const testData = [
    {
        name: "Note 1",
        created: "July 28, 2023",
        category: "Task",
        content: "Post content 1",
        dates: "",
        archived: false
    },
    {
        name: "Note 2",
        created: "July 27, 2023",
        category: "Idea",
        content: "Post content 2",
        dates: "",
        archived: false
    },
    {
        name: "Note 3",
        created: "July 26, 2023",
        category: "Random Thought",
        content: "Post content 3",
        dates: "",
        archived: false
    },
    {
        name: "Note 4",
        created: "July 25, 2023",
        category: "Idea",
        content: "Post content 4",
        dates: "",
        archived: false
    },
    {
        name: "Note 5",
        created: "July 24, 2023",
        category: "Task",
        content: "Post content 5",
        dates: "",
        archived: false
    },
    {
        name: "Note 6",
        created: "July 23, 2023",
        category: "Random Thought",
        content: "Post content 6",
        dates: "",
        archived: true
    },
    {
        name: "Note 7",
        created: "July 22, 2023",
        category: "Idea",
        content: "Post content 7",
        dates: "",
        archived: true
    },
    {
        name: "Note 8",
        created: "July 21, 2023",
        category: "Task",
        content: "Post content 8",
        dates: "",
        archived: true
    }
];

let showArchivedData = false;

document.querySelector("#toggleButton").addEventListener("click", () => {
    if (showArchivedData) {
        renderTable();
        this.innerText = "See archive note";
    } else {
        renderTable(true);
        this.innerText = "Hide archive note";
    }
    showArchivedData = !showArchivedData;
});


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
            <td title="${value.name}">${value.name}</td>
            <td>${value.created}</td>
            <td>${value.category}</td>
            <td title="${value.content}">${value.content}</td>
            <td title="${value.dates}">${value.dates}</td>
            <td class="text-right">
                <button class="icon-btn" onclick="editRow(this)">
                    <i class="fas fa-edit"></i>
                </button>
                ${
                 value.archived ? '<button class="icon-btn" onclick="archiveRow(this)">Unzip</button>' 
                : '<button class="icon-btn" onclick="archiveRow(this)"><i ' +
                'class="fas fa-archive"></i></button>'
                }
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
            name: `Note ${num}`,
            created: formattedDate,
            category: `Task`,
            content: `Post content ${num}`,
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

function extractAndAppendDates(sentence) {
    const dateRegex = /\b(\d{1,2}\.\d{1,2}\.\d{4})\b/g;
    const datesFound = sentence.match(dateRegex);

    if (datesFound && datesFound.length >= 2) {
       return testData[testData.length - 1].dates = datesFound.join(", ");
    }
}

function saveChanges(row, cells, editButton) {
    const name = cells[0].getElementsByTagName("input")[0].value;
    const category = cells[2].getElementsByTagName("select")[0].value;
    const content = cells[3].getElementsByTagName("input")[0].value;
    const datesFromContent = extractAndAppendDates(content);

    const rowIndex = row.rowIndex - 1;
    testData[rowIndex].name = name;
    testData[rowIndex].category = category;
    testData[rowIndex].content = content;
    testData[rowIndex].dates =  datesFromContent ? datesFromContent : "";

    row.classList.remove("editing");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    renderCategoryTable();
    renderTable();
}

function enterEditMode(row, cells, currentCategory, categories, editButton) {
    for (let i = 0; i < cells.length - 2; i++) {
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