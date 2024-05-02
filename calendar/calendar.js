fetch('events.json')
    .then(response => response.json())
    .then(data => {
        const currentDate = new Date();

        // Filter out past events
        const upcomingEvents = data.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate > currentDate;
        });

        // Display the upcoming events on the webpage
        const eventsContainer = document.getElementById('events-container');

        upcomingEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');

            // Construct the HTML content for each event using event properties
            eventDiv.innerHTML = `
                <h2>${event.date} - ${event.time}</h2>
                <p><strong>Location:</strong> ${event.location}</p>
                <p>${event.description}</p>
                <img src="${event.image}" alt="Event Image">
            `;

            eventsContainer.appendChild(eventDiv);
        });
    })
    .catch(error => console.error('Error fetching events:', error));

