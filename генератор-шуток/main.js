        // DOM: элементы
        const text = document.getElementById("text");
        const popupWindow = document.querySelector('.popup-window');
        const favsContainer = document.querySelector(".favs-container");

        //DOM: кнопки
        const copyBtn = document.getElementById('copyBtn');
        const favoriteBtn = document.getElementById('favoriteBtn');
        const nextBtn = document.getElementById('nextBtn');

        //массив для локального хранилища
        let favsStorage = [];

        //Добавить шутку в браузере
        function loadQuote(){
        getJSONP('http://www.RzhuNeMogu.ru/Widzh/WidzhRNM.aspx?type=1', onSuccess); 
        function onSuccess(res){
            text.innerHTML = res.result;
        }}

        //скопировать текст
        function copyText(){
            var range = document.createRange();
                    range.selectNode(document.getElementById("text"));
                    window.getSelection().removeAllRanges(); 
                    window.getSelection().addRange(range); 
                    document.execCommand("copy");
                    window.getSelection().removeAllRanges();
                    text.classList.add("active"); 
                    setTimeout(() => {
                        text.classList.remove("active"); 

                    }, 400); 
        }

        //добавить элемент в локальное хранилище
        function addToFavs(){
            if(localStorage.getItem("favs")){
                favsStorage = JSON.parse(localStorage.getItem("favs"));
            } else{
                favsStorage = [];    
            }

        
        let thisText = document.getElementById("text").innerHTML;
        thisText.replace(".www.rzhunemogu.ru", "");
        let random = Math.floor(Math.random() * 100000000000);

        let now = new Date();

        let date = now.getDate();
        let month = now.getMonth() + 1;
        let year = now.getFullYear();
        let hours = now.getHours();
        let minutes = now.getMinutes();  
        
        minutes < 10 ? minutes = "0" + minutes : minutes;
        hours < 10 ? hours = "0" + hours : hours;
        month < 10 ? month = "0" + month : month;
        date < 10 ? date = "0" + date : date;

        let time = `${date}.${month}.${year}, ${hours}:${minutes}`;

        let newItem = {
            text: thisText,
            date: time,
            id: random
        }

        favsStorage.push(newItem);
        localStorage.setItem("favs", JSON.stringify(favsStorage));
        displayFavorites();
        showPopupWindow("Добавлено!");
        }

        //расположить каждый избранный элемент на странице
        function displayFavorites(){

            favsContainer.innerHTML = "";
            favsStorage = JSON.parse(localStorage.getItem("favs"));
            
            favsStorage.forEach(el => {
                let item = document.createElement("div");
                item.classList.add("favs-item");
                item.setAttribute("id", el.id);
                item.innerHTML = ` <div class="favs-text">${el.text}</div>
                
                 <div class="favs-date">${el.date}</div> <div class="remove-btn"><i class="fas fa-trash"></i></div>
                `;

                favsContainer.append(item);
            })
        }

        //модальное окно
        function showPopupWindow(text){
            popupWindow.classList.add("active");
            popupWindow.textContent = text;
            setTimeout(() => {
                popupWindow.classList.remove("active");
            }, 1000);
        }

        //удалить элемент
        function removeItem(e){
            favsStorage.forEach((el, i) => {
                    if(el.id == e.target.parentElement.parentElement.getAttribute("id")){
                        favsStorage.splice(i, 1);
                        localStorage.setItem("favs", JSON.stringify(favsStorage)); 
                     }
                     displayFavorites();
            });
            showPopupWindow("Удалено!");
        }

        //СЛУШАТЕЛИ СОБЫТИЙ
        nextBtn.addEventListener("click", loadQuote);
        copyBtn.addEventListener("click", copyText);
        favoriteBtn.addEventListener("click", addToFavs);
        favsContainer.addEventListener("click", removeItem);


        //ПРИ ЗАГРУЗКЕ
        window.onload = loadQuote();
        displayFavorites();

        

