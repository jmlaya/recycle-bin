let allMarkers  = [];
let curGroup ;
const menuItems = [{
    type: "link",
    name: "Paper and cardboard",
    href: "javascript:selectMenuItem(0)",
    icon: "far fa-file"
},
{
    type: "link",
    name: "Glass",
    href: "javascript:selectMenuItem(1)",
    icon: "fas fa-glass-martini"
},
{
    type: "link",
    name: "Plastic",
    href: "javascript:selectMenuItem(2)",
    icon: "fas fa-recycle"
},
{
    type: "link",
    name: "Batteries",
    href: "javascript:selectMenuItem(3)",
    icon: "fas fa-battery-full"
},
{
    type: "link",
    name: "Electronic devices",
    href: "javascript:selectMenuItem(4)",
    icon: "fas fa-laptop"
},
{
    type: "link",
    name: "Clothes & Shoes",
    href: "javascript:selectMenuItem(5)",
    icon: "fas fa-bullseye"
},
{
    type: "link",
    name: "Furniture",
    href: "javascript:selectMenuItem(6)",
    icon: "fas fa-couch"
},
{
    type: "link",
    name: "Appliances",
    href: "javascript:selectMenuItem(7)",
    icon: "fas fa-bullseye"
},
{
    type: "link",
    name: "Building materials",
    href: "javascript:selectMenuItem(8)",
    icon: "far fa-building"
},
{
    type: "link",
    name: "Books",
    href: "javascript:selectMenuItem(9)",
    icon: "fas fa-book"
},
{
    type: "link",
    name: "Baby products",
    href: "javascript:selectMenuItem(10)",
    icon: "fas fa-child"
},
{
    type: "link",
    name: "Biological waste",
    href: "javascript:selectMenuItem(11)",
    icon: "fas fa-prescription-bottle-alt"
},
];


const map = L.map('mapid').setView([4, -72], 6);

function makeNoCacheId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 25; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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
        sidebarTitleText: 'Item types',
        sidebarMenuItems: {
            Items: menuItems
        }
    });

    control._searchfunctionCallBack = function (searchkeywords) {
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }
        alert(searchkeywords);
    }

    map.addControl(control);

    if(!window.device.mobile()){
        $(".panel").css("display", 'block');
    }

}


function loadMarkers(map) {
    const d = new Date();
    return $.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTVC-LFP9OxPSuj5D_DfLc_ChY_ricTX76xR6xEjU-KRASLxyRWPjRThzBoi9QfPK0KPgYdL8TENOEj/pub?gid=2103502970&single=true&output=csv&h='+d.getTime())
        .then(data => {

            return new Promise(resolve => {
                const layers = [];
                const lines = CSVtoArray(data);
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
                        longitude,
                        picture,
                        verified
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
                        longitude: Number(longitude),
                        picture,
                        verified: Boolean(Number(verified))
                    }
                })
                .filter(i => i.verified)
                .forEach((item, index) => {
                    if (index > 0) {
                        layers.push({
                            item,
                            marker:buildMarker(map, item)
                        });
                    }
                });
                resolve(layers);
            });

        });
}

function buildMarker(map, item) {
    var greenIcon = L.icon({
        iconUrl: 'http://poliklinika-krhen.hr/wp-content/uploads/2015/05/icon.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',

        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const filtersPopup = item.items_type.
    map(type => `<li class="popup__filter"><p class="popup__filter-text">${type}</p></li>`).join('');

    const popupHTML = `
        <div class="card">
            ${ item.picture ? `<img class="card-img-top" src="${item.picture}" alt="${item.organization}">` : '' }
            <div class="card-body">
                <h5 class="card-title">${item.organization}</h5>
                <p class="item-types">
                    ${item.items_type.map(i => `<span>${i}</span>`).join(', ')}
                </p>
                <p class="card-text">${item.description}</p>
                <p>
                    Address: <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}">${item.address}</a>
                </p>
                ${ item.phone && !window.device.mobile() ? `<p>Call them: ${item.phone}</p>` : ''}
                <p class="social">
                    ${ item.facebook ? `<a target="_blank" href="${item.facebook}"><i class="fab fa-facebook"></i></a>` : '' }
                    ${ item.instagram ? `<a target="_blank" href="${item.instagram}"><i class="fab fa-instagram"></i></a>` : '' }
                    ${ item.twitter ? `<a target="_blank" href="${item.twitter}"><i class="fab fa-twitter"></i></a>` : '' }
                    ${ item.address ? `<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}"><i class="fas fa-location-arrow"></i></a>` : '' }
                </p>
                ${ item.website ? `<a href="${item.website}" class="btn btn-primary text-white ${window.device.mobile() ? 'btn-block' : ''}" role="button">Say HI</a>` : '' }
                ${ item.phone && window.device.mobile() ? `<a href="tel:${item.phone}" class="btn btn-success text-white btn-block" role="button">Call them</a>` : '' }
            </div>
        </div>
    `;

    return L.marker([item.latitude, item.longitude], {
            // icon: greenIcon
        })
        .bindPopup(popupHTML)
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

function selectMenuItem(idx) {
    const items = $(".panel-list li")
    const layer = $(items[idx]);
    const name = menuItems[idx].name;
    items.removeClass('active');
    layer.addClass('active');
    const markers = allMarkers.filter((m) => m.item.items_type.indexOf(name)> -1);
    showMarkers(map, markers);
}

function searchItems(expresion) {

}

function showMarkers(map, markers) {
    if (curGroup) {
       curGroup.remove();
    }
    curGroup = L.layerGroup(markers.map(m => m.marker));
    curGroup.addTo(map);
}

$(document).ready(function () {
    window.device = new MobileDetect(window.navigator.userAgent);
    map.zoomControl.setPosition('topright');
    map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }));
    addControls(map);
    geolocate(map);
    loadMarkers(map).then(markers => {
        allMarkers = markers;
        showMarkers(map, allMarkers);
    });

});
