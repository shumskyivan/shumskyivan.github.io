//DOM ELEMENTS
//DOM ELEMENTS: ID
const createBookmarkBtn = document.getElementById('createBookmarkBtn');
const tagSearchBtn = document.getElementById('tagSearchBtn');

//DOM ELEMENTS: CLASS
const modalWrapper = document.querySelector('.modal-wrapper');
const modalHeaderCloseBtn = document.querySelector(".modal-header i");
const modalForm = document.querySelector('.modal-content');
const container = document.querySelector('.container'); 
const updateModal = document.querySelector('.update-modal');


//NEW ELEMENTS, BOOLEANS AND ETC.
let bookmarksArr = [];




//FUNCTIONS
//FUNCTIONS: SHOW MODAL
function showModal(){
    modalWrapper.classList.add("show");
}

//FUNCTIONS: CLOSE MODAL
function closeModal(){
    modalWrapper.classList.remove("show"); 
}

//FUNCTIONS: GET USER DATA: NAME, URL, TAG
function getUserData(e){
    e.preventDefault();

    let nameVal = document.getElementById('webName').value;
    let urlVal = document.getElementById('webUrl').value;
    let tagVal = document.getElementById('webTag').value;


        //check if url is valid
        if(!urlVal.includes("https://", "http://")){
            urlVal = `https://${urlVal}`;
        }
        
        if(!validateUserInputs(nameVal, urlVal, tagVal)){
            return false;
        }

        const newBM = {
            name: nameVal,
            url: urlVal,
            tag: tagVal
        }
        bookmarksArr.push(newBM);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarksArr));

        document.getElementById('webName').focus();
        modalForm.reset();  
        buildUI(); 
        closeModal();   
        showUpdateModal("Ссылка добавлена!");
    }

//FUNCTIONS: CHECK IF INPUTS ARE ALL VALID
function validateUserInputs(nameVal, urlVal, tagVal){
            //check if all inputs are filled with data
            if(!nameVal || !urlVal || !tagVal){
                alert("Заполните все поля!");
                 return false;
            }

            if(tagVal.includes(" ")){
                alert("Тэг не должен содержать пробелов!");
                return false;
            }
        
            //regex on url
            let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
            let urlRegExp = new RegExp(expression);
        
            if(!urlVal.match(urlRegExp)){
                alert("URL не соответсвует требованиям!");
                 return false;
            }

             return true;
}

//FUNCTIONS: FETCH DATA FROM LOCAL STORAGE
function fetchLocalStorage(){
    if(localStorage.getItem("bookmarks")){
        bookmarksArr = JSON.parse(localStorage.getItem("bookmarks"));
    }

    buildUI();
}

//FUNCTIONS: BUILD UI
function buildUI(){
    container.innerHTML = "";
    let count = 0;

    bookmarksArr.forEach(el => {
        const item = document.createElement("div");
         item.classList.add("bookmark-item", `${el.tag}`);

        //img
        const img = document.createElement("img");
        img.src = `https://s2.googleusercontent.com/s2/favicons?domain=${el.url}`;

        //a tag
        const link = document.createElement("a");
        link.target = "_blank";
        link.classList.add("item-name");
        link.href = el.url;
        link.innerText = el.name;

        //delete-item-btn
        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add("delete-item-btn");
        deleteBtn.innerHTML = `<i class="fas fa-times"></i>`;
        deleteBtn.setAttribute("data-count", count);

        //appending
        item.append(img, link, deleteBtn);
        container.appendChild(item);

        count++;

    })

    const deleteBtns = document.querySelectorAll(".delete-item-btn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", function(){
            let num = btn.getAttribute("data-count");
            bookmarksArr.splice(num, 1);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarksArr));
            fetchLocalStorage();
            showUpdateModal("Ссылка удалена!");
        })
        });

}

function showUpdateModal(message){
    updateModal.classList.add("show");
    updateModal.innerText = message;
    setTimeout(() => {
        updateModal.classList.remove("show");
    }, 3000);
}

function filterElements(e){
        let val = e.target.value;
        const bookmarkItems = document.querySelectorAll(".bookmark-item");
        bookmarkItems.forEach(item => {
            if(item.classList.value.includes(val)){
                item.style.display = "flex";
            } else{
                item.style.display = "none";

            }
        }) 
}



//EVENT LISTENERS
createBookmarkBtn.addEventListener('click', showModal);
modalHeaderCloseBtn.addEventListener("click", closeModal);
window.addEventListener('click', function(e){
    if(e.target.classList.contains("modal-wrapper")){
        closeModal();
    }
});
modalForm.addEventListener('submit', getUserData);
tagSearchBtn.addEventListener("keydown", filterElements);


//ON LOAD
fetchLocalStorage();
