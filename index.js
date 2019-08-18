let animation = `<div id="circleG" ><div id="circleG_1" class="circleG"></div><div id="circleG_2" class="circleG"></div><div id="circleG_3" class="circleG"></div></div>`;
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://swapi.co/api/films/');
xhr.send();
xhr.onload = function() {
    if (xhr.status !== 200) {
        alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
    } else {

        let list = document.getElementById('list');
        let ol = document.createElement('ol');
        let filmsObj = JSON.parse(xhr.response);

        for ( let i = 0; i < filmsObj.results.length; i++) {
           let title = filmsObj.results[i].title;
           let episode = filmsObj.results[i].episode_id;
           let content = filmsObj.results[i].opening_crawl;
           let li = document.createElement('li');
           li.innerHTML = `<p>Фильм: ${title}</p><p>Эпизод: ${episode}</p><p>Описание: ${content}</p><div class="visible">${animation}</div><button type="submit" id="${episode}">Список персонажей</button>`;

           ol.appendChild(li);
        }
       list.appendChild(ol);
    }
};
xhr.onerror = function() {
    alert("Запрос не удался");
};

document.addEventListener('click', function (event) {
    const animateArr = document.getElementsByClassName('visible');
    event.target.style.display = "none";
    for (let k = 0; k < animateArr.length; k++) {

        if (event.target.parentNode == animateArr[k].parentNode) {
            animateArr[k].classList.add('nVis');
            animateArr[k].classList.remove('visible');

            const person = new XMLHttpRequest();
            person.open('GET', 'https://swapi.co/api/films/');
            person.send();
            person.onload = function () {
                if (person.status !== 200) {
                    alert(`Ошибка ${person.status}: ${person.statusText}`);
                } else {

                    let ol = document.createElement('ol');
                    let filmPerson = JSON.parse(person.response);
                    console.log(filmPerson);
                    for (let i = 0; i < filmPerson.results.length; i++) {
                        let per = filmPerson.results[i].characters;
                        if (filmPerson.results[i].episode_id == event.target.id) {
                            for (let j = 0; j < per.length; j++) {
                                let personItem = new XMLHttpRequest();
                                personItem.open('GET', `${per[j]}`);
                                personItem.send();
                                personItem.onload = function () {
                                    let personDetail = JSON.parse(personItem.response);
                                    let li = document.createElement('li');
                                    li.innerHTML = `<p>Имя: ${personDetail.name}.</p><p>Рост: ${personDetail.height}.</p><p>Вес: ${personDetail.mass}.</p><p>Цвет волос: ${personDetail.hair_color}.</p><p>Цвет кожи: ${personDetail.skin_color}.</p>`;

                                    ol.appendChild(li);
                                };
                                personItem.onerror = function () {
                                    alert("Запрос не удался");
                                };
                            }
                            let nVis = document.getElementsByClassName('nVis');
                            for (let t =0; t < nVis.length; t++)  {
                                nVis[t].classList.add('visible');
                                nVis[t].classList.remove('nVis');
                            }
                            event.target.parentNode.appendChild(ol);
                        }
                    }
                }
            };
            person.onerror = function () {
                alert("Запрос не удался");
            };
        }
    }
});