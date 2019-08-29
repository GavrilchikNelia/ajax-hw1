let animations = `<div id="circleG" class="visible"><div id="circleG_1" class="circleG"></div><div id="circleG_2" class="circleG"></div><div id="circleG_3" class="circleG"></div></div>`;
let list = document.getElementById('list');
let ol = document.createElement('ol');
let arr = [];

function getResponse(url, func) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
           return  func(xhr.response);
        }
    };
    xhr.onerror = function() {
        alert("Запрос не удался");
    };
}
getResponse("https://swapi.co/api/films/", createList);
function createList(resp) {
    let filmsObj = JSON.parse(resp);
        // console.log(filmsObj);

        for ( let i = 0; i < filmsObj.results.length; i++) {
            let films = {
                title: filmsObj.results[i].title,
                episode: filmsObj.results[i].episode_id,
                content: filmsObj.results[i].opening_crawl,
                persons: filmsObj.results[i].characters,
            };
            arr.push(films);
        }
        render(arr, animations);
        list.appendChild(ol);
}

function render (item, animation) {
    for (let h = 0; h < item.length; h++) {
        let li = document.createElement('li');
        li.innerHTML = `<p>Фильм: ${item[h].title}</p><p>Эпизод: ${item[h].episode}</p><p>Описание: ${item[h].content}</p><div class="visible">${animation}</div><button id="${item[h].episode}" class="btn">Список персонажей</button>`;
        ol.appendChild(li);
    }
}
ol.addEventListener('click', clickList);
function clickList (event) {
    const animateArr = document.getElementsByClassName('visible');
    if ( event.target.classList.contains('btn')) {
        event.target.style.display = "none";
        for (let y = 0; y < animateArr.length; y++) {
            if (event.target.parentNode == animateArr[y].parentNode) {
                animateArr[y].classList.remove('visible');
                for (let d = 0; d < arr.length; d++) {
                    if (arr[d].episode == event.target.id) {
                        let olPers = document.createElement('ol');
                        olPers.classList.add(event.target.id);
                        event.target.parentNode.appendChild(olPers);
                        for (let k = 0; k < arr[d].persons.length; k++) {
                            console.log(arr[d].persons[k]);
                            getResponse(`${arr[d].persons[k]}`, renderPerson);;
                        }
                    }
                }
                animateArr[y].classList.add('visible');
            }
        }
    } else {
        event.target.style.display = "block";
    }
}

function renderPerson(res) {
    let personItem = JSON.parse(res);
    let liPers = document.createElement('li');
    liPers.textContent = `${personItem.name}`;
    let olAll = document.getElementsByTagName('ol');
    for (let d = 0; d < arr.length; d++) {
        for(let g=0; g< olAll.length; g++) {
            if (olAll[g].classList.contains(arr[d].episode)) {
                olAll[g].appendChild(liPers);
            }
        }
    }
}



