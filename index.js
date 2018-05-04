function CSVtoArray(text) {
    let p = '',
        row = [''],
        ret = [row],
        i = 0,
        r = 0,
        s = !0,
        l;
    for (l in text) {
        l = text[l];
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = ''];
            i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};



function addControls(map) {
    var searchboxControl = createSearchboxControl();
    var control = new searchboxControl({
        searchfunctionCallBack: searchItems,
        sidebarTitleText: 'Map layers',
        sidebarMenuItems: {
            Items: [{
                    type: "link",
                    name: "Paper and cardboard",
                    href: "javascript:enableLayer(0)",
                    icon: "far fa-file"
                },
                {
                    type: "link",
                    name: "Glass",
                    href: "javascript:enableLayer(1)",
                    icon: "fas fa-flask"
                },
                {
                    type: "link",
                    name: "Plastic",
                    href: "javascript:enableLayer(2)",
                    icon: "fas fa-bullseye"
                },
                {
                    type: "link",
                    name: "Batteries",
                    href: "javascript:enableLayer(3)",
                    icon: "fas fa-battery-full"
                },
                {
                    type: "link",
                    name: "Electronic devices",
                    href: "javascript:enableLayer(4)",
                    icon: "fas fa-laptop"
                },
                {
                    type: "link",
                    name: "Clothes & Shoes",
                    href: "javascript:enableLayer(5)",
                    icon: "fas fa-bullseye"
                },
                {
                    type: "link",
                    name: "Furniture",
                    href: "javascript:enableLayer(6)",
                    icon: "fas fa-couch"
                },
                {
                    type: "link",
                    name: "Appliances",
                    href: "javascript:enableLayer(7)",
                    icon: "fas fa-bullseye"
                },
                {
                    type: "link",
                    name: "Building materials",
                    href: "javascript:enableLayer(8)",
                    icon: "far fa-building"
                },
                {
                    type: "link",
                    name: "Books",
                    href: "javascript:enableLayer(9)",
                    icon: "fas fa-book"
                },
                {
                    type: "link",
                    name: "Baby products",
                    href: "javascript:enableLayer(10)",
                    icon: "fas fa-bullseye"
                },
                {
                    type: "link",
                    name: "Biological waste",
                    href: "javascript:enableLayer(11)",
                    icon: "fas fa-prescription-bottle-alt"
                },
            ]
        }
    });

    control._searchfunctionCallBack = function (searchkeywords) {
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }
        alert(searchkeywords);
    }

    map.addControl(control);

    $(".panel").css("display", 'block');
}


function loadMarkers(map) {
    $.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTVC-LFP9OxPSuj5D_DfLc_ChY_ricTX76xR6xEjU-KRASLxyRWPjRThzBoi9QfPK0KPgYdL8TENOEj/pub?gid=2103502970&single=true&output=csv')
        .then(data => {

            const lines = CSVtoArray(data)

           lines.map(line => {
                const [timestamp,
                    email,
                    organization,
                    description,
                    collection_type,
                    items_type,
                    city,
                    state,
                    address,
                    phone,
                    website,
                    facebook,
                    twitter,
                    instagram,
                    latitude,
                    longitude
                ] = line;
                return {
                    timestamp,
                    email,
                    organization,
                    description,
                    collection_type,
                    items_type: items_type.split(', '),
                    city,
                    state,
                    address,
                    phone,
                    website,
                    facebook,
                    twitter,
                    instagram,
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                }
            }).forEach((item, index) => {
                if (index > 0 ) {
                    addMarker(map, item);
                }
            });


        });
}

function addMarker(map, item) {
    var greenIcon = L.icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    console.log(item);

    const filtersPopup = item.items_type.
        map(type=>`<li class="popup__filter"><p class="popup__filter-text">${type}</p></li>`).join('');

    const popupHTML = `
        <div class="card">
            <img class="card-img-top" src="assets/image/logo.png" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${item.organization}</h5>
                <p class="card-text">${item.description}</p>
                <a href="#" class="btn btn-primary text-white" role="button">Say HI</a>
            </div>
        </div>
    `;

    L.marker([item.latitude, item.longitude], {
            // icon: greenIcon
        })
        .bindPopup(popupHTML)
        .addTo(map);
}

function button2_click() {
    alert('button 2 clicked !!!');
}

function geolocate(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const {
                latitude,
                longitude
            } = position.coords;
            map.setView([latitude, longitude], 14)
        });
    }
}

function enableLayer(idx) {
    var items = $(".panel-list li")
    var layer = $(items[idx])
    items.removeClass('active');
    layer.addClass('active');
    console.log(layer.find('a').html())
}

function searchItems(expresion) {
    console.log(expresion)
}

$(document).ready(function () {

    var map = L.map('mapid').setView([4, -72], 6);
    map.zoomControl.setPosition('topright');
    map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }));
    addControls(map);
    loadMarkers(map);
    geolocate(map);

});
