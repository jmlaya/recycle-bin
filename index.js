// var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//     maxZoom: 18,
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     id: 'mapbox.streets'
// }).addTo(mymap);
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
                    href: "javascript:enableLayer(2)"
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
                    href: "javascript:enableLayer(5)"
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
                    href: "javascript:enableLayer(7)"
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
                    href: "javascript:enableLayer(10)"
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

function addMarkers(map) {
    var greenIcon = L.icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([3, -72], {
            icon: greenIcon
        })
        .bindPopup('<div style="width: 200px">Hola mundo</div>')
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
            map.setView([latitude, longitude], 10)
        });
    }
}

function enableLayer(idx){
    var items = $(".panel-list li")
    var layer = $(items[idx])
    items.removeClass('active');
    layer.addClass('active');
    console.log(layer.find('a').html())
}

function searchItems(expresion){
    console.log(expresion)
}

$(document).ready(function () {

    var map = L.map('mapid').setView([4, -72], 6);
    map.zoomControl.setPosition('topright');
    map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }));
    addControls(map);
    addMarkers(map);
    geolocate(map);
});
