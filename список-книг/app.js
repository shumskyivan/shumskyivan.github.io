//DOM ЭЛЕМЕНТЫ      
const form = document.querySelector('#form');
const alertContainer = document.querySelector('.alert-container');
const resultContainer = document.querySelector('.result-container tbody');

//ЛОКАЛЬНОЕ ХРАНИЛИЩЕ
class Storage {
    static getItems(){
        let books;
        if(localStorage.getItem("books")){
            books = JSON.parse(localStorage.getItem("books"));
        } else {
            books = [];
        }

        return books;
    }

    static addItem(item){
        let books = Storage.getItems();
        books.push(item);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeItem(item){
        let books = Storage.getItems();
        books.forEach((el, i) => {
            if(`${el.id}` === item){
                books.splice(i, 1);
            };
        })
        localStorage.setItem("books", JSON.stringify(books));
        
    }
}

//ИНТЕРФЭЙС ПОЛЬЗОВАТЕЛЯ
class UI {
    static showAlertContainer(color, text){
        alertContainer.style.color = color;
        alertContainer.textContent = text;
        alertContainer.classList.add("show");
        setTimeout(() => {
            alertContainer.classList.remove("show");
        }, 3000);
    }

    static addBookToList(book){
            const tr = document.createElement("tr");
            tr.classList.add("item-row");
            tr.innerHTML = `<td class="title-row"><a href="${book.link}">${book.title}</a></td>
            <td class="author-row">${book.author}</td>
            <td class="remove-row"><i class="delete-btn fas fa-trash"></i></td>`;
            tr.setAttribute("data-id", book.id);
            resultContainer.appendChild(tr);
            // let books = Storage.getItems();
    }

    static displayBooks(){
        let books = Storage.getItems();

        books.forEach(book => {
            UI.addBookToList(book);
        })
    }
}

//СОЗДАНИЕ НОВОГО ЭЛЕМЕНТА Book
class Book {
    constructor(title, author, link, id){
        this.title = title;
        this.author = author;
        this.link = link;
        this.id = id;
    }
}

//СОБЫТИЯ
form.addEventListener("submit", function(e){
    e.preventDefault();

    let titleEl = document.querySelector("#title");
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    let link = document.querySelector('#link').value;
    let id = Math.random() * 100000000;

    if(!link.includes("https://")){
        link = `https://${link}`;
    }

    if(!author || !link || !title){
        UI.showAlertContainer("red", "Заполните все поля!");
        return false;
    }

    let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const addressValidation = new RegExp(re);
    if(!link.match(addressValidation)){
     return false;   
    } 

    const newBook = new Book(title, author, link, id);
    Storage.addItem(newBook);
    UI.addBookToList(newBook);
    form.reset();
    titleEl.focus();
});
resultContainer.addEventListener("click", function(e){
        if(e.target.classList.contains("delete-btn")){
            let confirmWindow = confirm("Вы уверены, что хотите удалить это?");

            if(confirmWindow){
                let thisID = e.target.parentElement.parentElement.getAttribute("data-id");
                resultContainer.querySelectorAll(".item-row").forEach(el => {if(el.getAttribute("data-id") === thisID){
                    el.remove();
                    Storage.removeItem(thisID);
                }});
            }

        
        }
    

});

//ПРИ ЗАГРУЗКЕ
UI.displayBooks();
const titles = document.querySelectorAll('#title');
console.log(titles);
