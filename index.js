let animations = `<div id="circleG" class="visible"><div id="circleG_1" class="circleG"></div><div id="circleG_2" class="circleG"></div><div id="circleG_3" class="circleG"></div></div>`;
let list = document.getElementById('list');
let ol = document.createElement('ol');

let arr = [];
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://swapi.co/api/films/');
xhr.send();
xhr.onload = function() {
    if (xhr.status !== 200) {
        alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
    } else {

        let filmsObj = JSON.parse(xhr.response);
        console.log(filmsObj);

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
        console.log(arr);
    }
};

ol.addEventListener('click', function (event) {
    const animateArr = document.getElementsByClassName('visible');
    if ( event.target.classList.contains('btn')) {
        event.target.style.display = "none";
        for (let y = 0; y < animateArr.length; y++) {
            if (event.target.parentNode == animateArr[y].parentNode) {
                animateArr[y].classList.remove('visible');
                for (let d = 0; d < arr.length; d++) {
                    if (arr[d].episode == event.target.id) {
                        let olPers = document.createElement('ol');
                        for (let k = 0; k < arr[d].persons.length; k++) {
                            const per = new XMLHttpRequest();
                            per.open('GET', `${arr[d].persons[k]}`);
                            per.send();
                            per.onload = function () {
                                if (per.status !== 200) {
                                    alert(`Ошибка ${per.status}: ${per.statusText}`);
                                } else {
                                    let personItem = JSON.parse(per.response);
                                    let liPers = document.createElement('li');
                                    liPers.textContent = `${personItem.name}`;
                                    olPers.appendChild(liPers);
                                }
                            };
                            per.onerror = function () {
                                alert("Запрос не удался");
                            };
                        }
                        event.target.parentNode.appendChild(olPers);


                    }
                }
                animateArr[y].classList.add('visible');
            }
        }
    } else {
        event.target.style.display = "block";
    }
});

xhr.onerror = function() {
    alert("Запрос не удался");
};

function render (item, animation) {
    for (let h = 0; h < item.length; h++) {
        let li = document.createElement('li');
        li.innerHTML = `<p>Фильм: ${item[h].title}</p><p>Эпизод: ${item[h].episode}</p><p>Описание: ${item[h].content}</p><div class="visible">${animation}</div><button id="${item[h].episode}" class="btn">Список персонажей</button>`;
        ol.appendChild(li);
    }
}


