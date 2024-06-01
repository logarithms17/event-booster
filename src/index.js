import axios from 'axios';
import { BASE_URL, options } from './discovery-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { last, size, throttle } from 'lodash';


const eventGallery = document.querySelector('.main-container');
const selectCountry = document.querySelector('.select')
const searchCountry = document.querySelector('.input')
const pageNumbersUl = document.getElementById('page-numbers');
const currentPageDiv = document.querySelector('.current-page');
const ellipsisContainer = document.querySelector('.ellipsisContainer')

//=======FETCH DATA FROM API========//
async function fetchData() { 
  try { 
    const res = await axios.get(BASE_URL, options); 
    const { events } = res.data._embedded;
    const {totalPages} = res.data.page
    console.log(events)
    console.log(res.data)
    renderEvent(events)
    renderPageNumbers(1, totalPages);

  } catch (err) { 
      console.log(err)
    Notify.failure(`Sorry! No event found!`);
    pageNumbersUl.innerHTML = ""
    ellipsisContainer.innerHTML = ""
  }
}

async function fetchDataError() { 
      try { 
        const res = await axios.get(BASE_URL, options); 
        const { events } = res.data._embedded;
        renderEvent(events)

      } catch (err) { 
          console.log(err)
          Notify.failure(`Sorry! No event found!`);
          
      }
    }

//=========INSERT MARKUP==========//

function renderEvent(events) {
    const markup = events.map(({ name, id, images, dates, _embedded : {venues} }) => {
        return `
                <a class="card" >
                        <div class="second-border"></div>
                        <img src="${images[0].url}" alt="sample pic" class="card-img" id="${id}">
                        <h5 class="event-name">${name}</h5>
                        <div class="event-info"><p class="date">${dates.start.localDate}</p>
                          <p class="location">
                              <img src="/event-booster/location-icon.bb39e645.png" alt="location icon" class="location-icon">
                              ${venues[0].name}
                          </p></div>
                    </a>
                `;
    }).join("")

  eventGallery.insertAdjacentHTML("beforeend", markup)
}

//======== RENDER EVENTS AS PER COUNTRY ===========//

selectCountry.addEventListener("change", countryEvent)

async function countryEvent(e) {
  options.params.page = 0
  eventGallery.innerHTML = "";
  let selectedCountry = e.target.value;
  options.params.countryCode = selectedCountry
  fetchData()
}

//=========RENDER EVENTS BY SEARCH ==========//
async function inputEvent() {
  if (searchCountry.value === "") {
    options.params.keyword = "";
    fetchData()
  } eventGallery.innerHTML = "" 
  options.params.keyword = searchCountry.value

  fetchData()
}

//========RENDER EVENT PER PAGE======//

document.addEventListener('click', function (event) {
  const eventId = event.target.getAttribute("id")
  if (event.target.classList.contains('card-img')) {
    options.params.id = eventId;
    let currentPage = options.params.page;
    fetchModalData(currentPage);
    openModalFunction(); 
  }
});


async function fetchModalData(currentPage) { 
  try { 
    options.params.page = 0;
    const res = await axios.get(BASE_URL, options); 
    const { events } = res.data._embedded;
    addModalMarkup(events)
    options.params.page = currentPage;
    options.params.id = '';

  } catch (err) { 
      console.log(err)
      Notify.failure(`Error fetchModalData Function!`);
      
  }
}

// ==========PAGINATION ===========//

console.log(ellipsisContainer)

function renderPageNumbers(startIndex, totalPage) {
  ellipsisContainer.innerHTML=""
  const nums = [...Array(totalPage).keys()];
  console.log(nums)
    pageNumbersUl.innerHTML = '';
    if (startIndex > 1) {
        const previousPageLi = document.createElement('li');
        previousPageLi.textContent = 1;
        pageNumbersUl.appendChild(previousPageLi);
        const previousEllipsisLi = document.createElement('li');
        previousEllipsisLi.textContent = '...';
        pageNumbersUl.appendChild(previousEllipsisLi);
        previousEllipsisLi.addEventListener('click', () => {
            const previousStartIndex = Math.max(startIndex - 5, 1);
            renderPageNumbers(previousStartIndex, totalPage);
        });
    }
  const endIndex = Math.min(startIndex + 4);
  console.log(endIndex)
    for (let i = startIndex; i <= endIndex; i++) {
        const li = document.createElement('li');
        li.textContent = i;
        if (i === startIndex) {
          li.classList.add('active');
        } else if (i === totalPage) {
          li.classList.add('active')
        }
        li.addEventListener('click', () => {
            pageNumbersUl.querySelectorAll('.active').forEach(activeLi => activeLi.classList.remove('active'));
            li.classList.add('active');
            currentPageDiv.textContent = i;
        });
        pageNumbersUl.appendChild(li);
    }
  if (endIndex < nums.length) {
    const nextEllipsisLi = document.createElement('li');
    console.log("entered")
    nextEllipsisLi.textContent = '. . .';
    ellipsisContainer.appendChild(nextEllipsisLi);
    const lastPageLi = document.createElement('li');
    lastPageLi.textContent = nums.length;
    ellipsisContainer.appendChild(lastPageLi);
        
    nextEllipsisLi.addEventListener('click', () => {
        const nextStartIndex = endIndex + 1;
      renderPageNumbers(nextStartIndex, totalPage);
    });

    lastPageLi.addEventListener("click", () => {
      let lastPage = lastPageLi.innerText
      console.log(lastPage)
      options.params.page = lastPage
      fetchDataError()
    })
    }
}


//========RENDER EVENT PER PAGE======//

const activePage = document.querySelector(".pagination")
console.log(activePage)
console.log(currentPageDiv.innerText)


async function renderEventByPage(e) {
  eventGallery.innerHTML = "";
  if (e.target.classList.contains('active')) {
    let newPage = e.target.innerText
    console.log(newPage)
    options.params.page = newPage
    try { 
      const res = await axios.get(BASE_URL, options); 
      const { events } = res.data._embedded;
      const { totalPages } = res.data.page
      console.log(events)
      renderEvent(events)


    } catch (err) { 
        console.log(err)
        Notify.failure(`Sorry! Exceeded limit free access`);
        
    }
  } else {
    eventGallery.innerHTML = "";
    Notify.failure(`Please click the page button again!`)
    
    fetchDataError()
  }
  
}



pageNumbersUl.addEventListener("click", renderEventByPage) 




searchCountry.addEventListener("input", throttle(inputEvent, 1500))

fetchData()



// MODAL JS
const modalContainer = document.querySelector(".modal-container")
  
  
function openModalFunction() {
  const modal = document.querySelector('.backdrop');
  if (modal) {
    modal.classList.remove('is-hidden');
  }
}

function closeModalFunction() {
  // console.log("entered")
  const closeButton = document.querySelector('.modal-close-button');
  if (closeButton) {
    // console.log("entered")
    closeButton.addEventListener('click', function() {
      const modal = document.querySelector('.backdrop');
      if (modal) {
        options.params.id = "";
        modalContainer.innerHTML = ""; //problem
        modal.classList.add('is-hidden');
        // fetchData()
      }
    });
  }

}




function addModalMarkup(events) {
  console.log(events)
  console.log(events[0].priceRanges[0].min)
  //   modalContainer.insertAdjacentHTML("beforeend", closeButtonMarkup)
  // const modalMarkup = events.map(({ name, images, dates, _embedded: { venues } }) => {
  const modalMarkup = `
                      <img class="circle-event-img" src="${events[0].images[0].url}">
                      <div class="event info-container">
                          <img class="event-img" src="${events[0].images[0].url}">
                          <div class="event-info">
                              <div class="event-info-item">
                                  <h3 h3 class="info-heading">INFO</h3>
                                  <p class="info-description event-info-description">Atlas Weekend is the largest music festival. <br>
                                      More than 200 artists will create a proper music
                                      festival atmosphere on 10 stages</p>
                              </div>
                              <div class="event-info-item">
                                  <h3 class="info-heading">WHEN</h3>
                                  <p class="info-description date-info-description">${events[0].dates.start.localDate}</p>
                                  <p class="info-description timezone-info-description">${events[0].dates.start.localTime} (${events[0]._embedded.venues[0].city.name}/${events[0]._embedded.venues[0].country.name})</p>
                              </div>
                              <div class="event-info-item">
                                  <h3 class="info-heading">WHERE</h3>
                                  <p class="info-description country-info-description">${events[0]._embedded.venues[0].city.name}/${events[0]._embedded.venues[0].country.name}</p>
                                  <p class="info-description venue-info-description">${events[0]._embedded.venues[0].name}</p>
                              </div>
                          </div>
                      </div>
                      <div class="artist-info">
                          <div class="artist-info-item">
                              <h3 class="info-heading">WHO</h3>
                              <p class="info-description artist-name">${events[0].name}</p>
                          </div>
                      </div>
                      <div class="ticket-info">
                          <div class="ticket-info-item">
                              <h3 class="info-heading">PRICES</h3>
                              <div class="ticket-prices">
                                  <img src="/event-booster/ticket.4ca21708.png" alt="ticket barcode" class="barcode-image">
                                  <p class="info-description standard-ticket-price">Standard ${events[0].priceRanges[0].min}-${events[0].priceRanges[0].max} ${events[0].priceRanges[0].currency}</p>
                              </div>
                              <button type="button" class="buy-button">BUY TICKETS</button>
                          </div>
                          <button type="button" class="more-button">MORE FROM THIS AUTHOR</button>
                      </div>
                      `;
  modalContainer.insertAdjacentHTML("beforeend", modalMarkup)
  // return modalMarkup
}

closeModalFunction();