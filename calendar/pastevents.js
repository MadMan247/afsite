document.addEventListener("DOMContentLoaded", function() {
    const eventsContainer = document.getElementById('events-container');

    fetch('events.json')
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();

            // Filter and sort events by date in descending order 
            const upcomingEvents = data
                .filter(event => new Date(event.date + 'T' + event.time) < currentDate)
                .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

            upcomingEvents.forEach(event => {
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
                    <img src="${event.image}" alt="Event Image">
                    <h3>${formattedTime.toUpperCase()} on ${formattedDate}</h3>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p>${event.description}</p>
                `;

                eventsContainer.appendChild(eventDiv);
            });
        })
        .catch(error => console.error('Error fetching events:', error));

});



// Scroll to top function
document.addEventListener('DOMContentLoaded', function() {
    const toTopButton = document.querySelector('.to-top-icon');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            toTopButton.classList.add('active');
        } else {
            toTopButton.classList.remove('active');
        }
    });

    toTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

