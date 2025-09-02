const eventIndexPath = '/data/events/index.json';
const eventImgPath = '/data/images/bucket/';
const animationDuration = 500; //in ms

const upcomingEventsContainer = document.getElementById('upcoming-events');
const pastEventsContainer = document.getElementById('past-events');

function createEvent(event) {
    const eventDiv = document.createElement('a');
    eventDiv.classList.add('event');
    eventDiv.href = event.link;

    // Convert the date and time to a more comfortable format
    const eventDate = new Date(event.date + 'T' + event.time);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // Remove leading zero from hours and format the time
    let formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    // Remove leading zero from hours
    formattedTime = formattedTime.replace(/^0/, '');

    eventDiv.innerHTML = `
                    <img src="${eventImgPath + event.image}" alt="Event Image">
                    <h3>${formattedTime.toUpperCase()} on ${formattedDate}</h3>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p>${event.description}</p>
    `;

    return eventDiv;
}

function upcomingDropdown(e) {
    if (e) {
        e.preventDefault();
    }

    const parent = e.target.parentElement;
    const eventContainer = document.getElementById('upcoming-events');
    const button = document.getElementById('upcoming-btn');
    const style = document.getElementById('upcoming-drp-style');

    button.disabled = true;

    if (parent.classList.contains('open')) {

        button.querySelector('svg').style.transform = 'translateY(calc(4rem - 10px)) rotate(0deg)'; //calc is for svg height

        const dropUp = `
            
            #upcoming-events {
                animation: upcoming-drop-up ${animationDuration}ms ease forwards;
            }
            
            @keyframes upcoming-drop-up {
                0% {
                    height: ${eventContainer.scrollHeight}px;
                    opacity: 1;
                }
                100% {
                    height: 0;
                    opacity: 0;
                }
            }
        `;

        style.innerHTML = dropUp;

        parent.classList.add('close');

        setTimeout(() => {
            eventContainer.style.height = '0px';

            parent.classList.remove('open');

            button.disabled = false;
        }, animationDuration);
    } else {

        button.querySelector('svg').style.transform = 'translateY(calc(4rem - 10px)) rotate(180deg)';

        const dropDown = `
            
            #upcoming-events {
                animation: upcoming-drop-down ${animationDuration}ms ease forwards;
            }
        
            @keyframes upcoming-drop-down {
                0% {
                    height: 0;
                    opacity: 0;
                }
                100% {
                    height: ${eventContainer.scrollHeight}px;
                    opacity: 1;
                }
            }
        `;

        style.innerHTML = dropDown;

        parent.classList.add('open');

        setTimeout(() => {
            eventContainer.style.height = eventContainer.scrollHeight + 'px';

            parent.classList.remove('close');

            button.disabled = false;
        }, animationDuration);
    }
}

function pastDropdown(e) {
    if (e) {
        e.preventDefault();
    }

    const parent = e.target.parentElement;
    const eventContainer = document.getElementById('past-events');
    const button = document.getElementById('past-btn');
    const style = document.getElementById('past-drp-style');

    button.disabled = true;

    if (parent.classList.contains('open')) {

        button.querySelector('svg').style.transform = 'translateY(calc(4rem - 10px)) rotate(0deg)';

        const dropUp = `
            
            #past-events {
                animation: past-drop-up ${animationDuration}ms ease forwards;
            }
            
            @keyframes past-drop-up {
                0% {
                    height: ${eventContainer.scrollHeight}px;
                    opacity: 1;
                }
                100% {
                    height: 0;
                    opacity: 0;
                }
            }
        `;

        style.innerHTML = dropUp;

        parent.classList.add('close');

        setTimeout(() => {
            eventContainer.style.height = '0px';

            parent.classList.remove('open');

            button.disabled = false;
        }, animationDuration);
    } else {

        button.querySelector('svg').style.transform = 'translateY(calc(4rem - 10px)) rotate(180deg)';

        const dropDown = `
            
            #past-events {
                animation: past-drop-down ${animationDuration}ms ease forwards;
            }
        
            @keyframes past-drop-down {
                0% {
                    height: 0;
                    opacity: 0;
                }
                100% {
                    height: ${eventContainer.scrollHeight}px;
                    opacity: 1;
                }
            }
        `;

        style.innerHTML = dropDown;

        parent.classList.add('open');

        setTimeout(() => {
            eventContainer.style.height = eventContainer.scrollHeight + 'px';

            parent.classList.remove('close');

            button.disabled = false;
        }, animationDuration);
    }
}


fetch(eventIndexPath)
    .then(response => response.json())
    .then(data => {
        const currentDate = new Date();

        // Filter and sort upcoming events ascending (soonest first)
        const upcomingEvents = data
            .filter(event => new Date(event.date + 'T' + event.time) > currentDate)
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

        // Filter and sort past events descending (most recent past first)
        const pastEvents = data
            .filter(event => new Date(event.date + 'T' + event.time) <= currentDate)
            .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

        upcomingEvents.forEach(event => {
            const eventDiv = createEvent(event);
            upcomingEventsContainer.appendChild(eventDiv);
        });

        pastEvents.forEach(event => {
            const eventDiv = createEvent(event);
            pastEventsContainer.appendChild(eventDiv);
        });
    })
    .catch(error => console.error('Error fetching events:', error));


document.getElementById('upcoming-btn').addEventListener('click', upcomingDropdown);
document.getElementById('past-btn').addEventListener('click', pastDropdown);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('upcoming-btn').click();
    }, 500);
    //This is a bad solution, and I am ashamed.
});

