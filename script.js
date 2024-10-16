document.getElementById('syncBtn').addEventListener('click', loadDataSync);
document.getElementById('asyncBtn').addEventListener('click', loadDataAsync);
document.getElementById('fetchBtn').addEventListener('click', loadDataFetch);

function processAndDisplay(data) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = ''; 
    data.forEach(entry => {
        const nameParts = entry.name.split(' ');
        const row = `<tr>
            <td>${nameParts[0]}</td>
            <td>${nameParts[1]}</td>
            <td>${entry.id}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Synchronous XMLHttpRequest
function loadDataSync() {
    const reference = getJSONSync('data/reference.json');
    const data1 = getJSONSync(`data/${reference.data_location}`);
    const data2 = getJSONSync(`data/${data1.data_location}`);
    const data3 = getJSONSync('data/data3.json');
    
    const allData = [...data1.data, ...data2.data, ...data3.data];
    processAndDisplay(allData);
}

function getJSONSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); 
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error(`Error fetching ${url}`);
    }
}

// Asynchronous XMLHttpRequest with callbacks
function loadDataAsync() {
    getJSONAsync('data/reference.json', reference => {
        getJSONAsync(`data/${reference.data_location}`, data1 => {
            getJSONAsync(`data/${data1.data_location}`, data2 => {
                getJSONAsync('data/data3.json', data3 => {
                    const allData = [...data1.data, ...data2.data, ...data3.data];
                    processAndDisplay(allData);
                });
            });
        });
    });
}

function getJSONAsync(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true); 
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        } else {
            console.error(`Error fetching ${url}`);
        }
    };
    xhr.send();
}

// Fetch API with promises
function loadDataFetch() {
    fetch('data/reference.json')
        .then(response => response.json())
        .then(reference => fetch(`data/${reference.data_location}`))
        .then(response => response.json())
        .then(data1 => fetch(`data/${data1.data_location}`)
            .then(response => response.json())
            .then(data2 => {
                return { data1, data2 };
            }))
        .then(({ data1, data2 }) => fetch('data/data3.json')
            .then(response => response.json())
            .then(data3 => {
                const allData = [...data1.data, ...data2.data, ...data3.data];
                processAndDisplay(allData);
            })
        )
        .catch(error => console.error('Error fetching data:', error));
}
