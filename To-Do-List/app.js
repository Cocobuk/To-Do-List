const inputBox = document.querySelector(".input-box input"),
  filters = document.querySelectorAll(".span-box span"),
  temizle = document.querySelector(".temizle-btn"),
  taskBox = document.querySelector(".task-box");

let duzenleId;
let duzenleTask = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));

function goster(filter) {  //Todolari dinamik olarak ekler ve ekranda gosterir
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let Iscompleted = todo.status == "biten" ? "checked" : "";
      if (filter == todo.status || filter == "hepsi") {
        li += `<li class="task">
        <label for="${id}">
            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${Iscompleted}>
            <p class="${Iscompleted}">${todo.name}</p>
        </label>
        <div class="ayarlar">
            <i onclick="MenuGoster(this)" class="fa-solid fa-ellipsis"></i>
            <ul class="menu">
                <li onclick="Duzenleme(${id},'${todo.name}')"><i class="fa-solid fa-pencil"></i>Düzenle</li>
                <li onclick="sil(${id})"><i class="fa-regular fa-trash-can"></i>Sil</li>
                </ul>
                  </div>
              </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span>_Yapılacaklar Listesi Boş_</span>`;
}

goster("hepsi");//Sayfa yenilendiginde todolari tekrar gosterir

filters.forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelector("span.tiklama").classList.remove("tiklama");
    btn.classList.add("tiklama");
    goster(btn.id);
  });
});

function sil(deleteId) {//Todoyu hem ekrandan hemde localstorageden siler 
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  goster("hepsi");
}

temizle.addEventListener("click", function () {//Temizle butonuyla hepsini siler ekrandan ve localstoragende de hepsini siler
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  goster("hepsi");
});

function Duzenleme(taskId, taskname) {//Todoyu duzenler
  duzenleId = taskId;
  duzenleTask = true;
  inputBox.value = taskname;
}

function MenuGoster(selectedTask) {//Uc noktayi tiklaninca gosterir ve icindeki silme,duzenlemeyi ayarlar
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", function (e) {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {//Isaretlenen kutuyu gosterir ve butonlara ona gore atar
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "biten";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "devameden";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

inputBox.addEventListener("keyup", function (e) {//Enter tusuna basildiginda todoyu ekrana ekler ve localstorage ye ekler
  let user = inputBox.value.trim();
  if (e.key == "Enter" && user) {
    if (!duzenleTask) {
      if (!todos) {
        todos = [];
      }
      let info = { name: user, status: "devameden" };
      todos.push(info);
    } else {
      duzenleTask = false;
      todos[duzenleId].name = user;
    }

    inputBox.value = "";

    localStorage.setItem("todo-list", JSON.stringify(todos));
    goster("hepsi");
  }
});
