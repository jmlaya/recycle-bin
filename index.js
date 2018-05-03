// var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//     maxZoom: 18,
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     id: 'mapbox.streets'
// }).addTo(mymap);

$(document).ready(function () {

    var map = L.map('mapid').setView([4, -72], 6);
    map.zoomControl.setPosition('topright');
    map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }
    ));

    var searchboxControl = createSearchboxControl();
    var control = new searchboxControl({
        sidebarTitleText: 'Recycle.bin',
        sidebarMenuItems: {
            Items: [
                { type: "link", name: "Link 1 (github.com)", href: "http://github.com", icon: "icon-local-carwash" },
                { type: "link", name: "Link 2 (google.com)", href: "http://google.com", icon: "icon-cloudy" },
                { type: "button", name: "Button 1", onclick: "alert('button 1 clicked !')", icon: "icon-potrait" },
                { type: "button", name: "Button 2", onclick: "button2_click();", icon: "icon-local-dining" },
                { type: "link", name: "Link 3 (stackoverflow.com)", href: 'http://stackoverflow.com', icon: "icon-bike" },
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

    var greenIcon = L.icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([3, -72], { icon: greenIcon })
        .bindPopup('<h1>Hola mundo</h1>')
        .addTo(map);
});

function button2_click() {
    alert('button 2 clicked !!!');
}
