//DOM
const cardContent = document.querySelector('.card-content');
const flipBtn = document.querySelector('#flipBtn');
const frontCardText = document.querySelector('#frontCardText');
const backCardText = document.querySelector('#backCardText');

const leftBtn = document.querySelector('#leftBtn');
const rightBtn = document.querySelector('#rightBtn');
const addNewDeck = document.querySelector('#addNewDeck');
const closeModalIcon = document.querySelector('.modal-header i');
const removeBtn = document.querySelector('#removeBtn');


const modalWrapper = document.querySelector('.modal-wrapper');
const formContent = document.querySelector('.modal-content');

let counterDOM = document.querySelector('.counter');

//values
let activeVal = false;
let countVal = 0;


function getStorageData(){
    if(localStorage.getItem("cards")){
        cardsData = JSON.parse(localStorage.getItem("cards"));
    } else {
        cardsData = [
            {
                question: "Когда умер Пушкин?",
                answer: "1837"
            }
        ];
    }
}
JSON.parse(localStorage.getItem("cards"));
getStorageData();


//CARD CONTAINER STUFF
function flipQuestion(){
    if(activeVal){
        backCardText.style.display = "none";
        frontCardText.style.display = "block";
        activeVal = false;
    
       } else {
        frontCardText.style.display = "none";
        backCardText.style.display = "block";
        activeVal = true;
       }
}

function changeCount(){
    if(countVal > cardsData.length - 1){
        countVal = 0;
    } else if(countVal < 0){
        countVal = cardsData.length - 1;
    }

    counterDOM.innerText = `${countVal + 1} / ${cardsData.length}`;
    frontCardText.innerText = cardsData[countVal].question;
    backCardText.innerText = cardsData[countVal].answer; 

    if(activeVal){
        backCardText.style.display = "none";
        frontCardText.style.display = "block";
        activeVal = false;
       }
}


// EVENTS
modalWrapper.addEventListener("click", function(e){
    if(e.target.classList.contains("modal-wrapper")){
        modalWrapper.classList.remove("show");
    }
})

;
leftBtn.addEventListener("click", ()=>{
    countVal--;
    changeCount();

})


rightBtn.addEventListener("click", ()=>{
    countVal++;
    changeCount();    
})


flipBtn.addEventListener("click", function(){
    flipQuestion();
})

;
addNewDeck.addEventListener("click", () => {
    modalWrapper.classList.add("show");
})

;
closeModalIcon.addEventListener("click", () => {
    modalWrapper.classList.remove("show");
})

removeBtn.addEventListener("click", function(){
    let newConfirm = confirm("Вы уверены, что хотите это удалить?");
    if(newConfirm){
        getStorageData();
        cardsData.splice(countVal, 1);
        localStorage.setItem("cards", JSON.stringify(cardsData));
        changeCount();
    }
})



formContent.addEventListener("submit", function(e){
    e.preventDefault();
    let question = document.querySelector("#questionInput").value;
    let answer = document.querySelector("#answerInput").value;
    if(!question || !answer){
        alert("Заполните все поля!");
        return false;
    }

    
    getStorageData();
    cardsData.push({
        question: question,
        answer: answer
    });
    localStorage.setItem("cards", JSON.stringify(cardsData));
    

    changeCount();
    modalWrapper.classList.remove("show");
    formContent.reset();
})


//ON LOAD
window.addEventListener("DOMContentLoaded", function(){
changeCount();
})
