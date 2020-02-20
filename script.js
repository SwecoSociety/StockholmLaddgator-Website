var isIE = /*@cc_on!@*/ false || !!document.documentMode;
if (isIE) {
	alert("Det verkar som att du använder en webbläsare som inte stödjer alla funktioner på sajten. Vänligen överväg att byta till en modern webbläsare, såsom Chrome eller Firefox.")
}

var internVy = false
var tidigareSynpunkter, zoomYtor

var keyNumbers = {
	gator: {
		totalt: 0,
		utpekade: {
			normal: 0,
			snabb: 0,
			snabbOchNormal: 0,
			snabbEllerNormal: 0,
		},
		avtalade: 0,
		anlagda: 0,
		reserverade: 0,
		oevriga: 0,
	}
}

var trackedStatuses = ['tillgängliga','förbereds','reserverade','avtalade','anlagda']

for (var s in trackedStatuses){
	keyNumbers.gator[s] = 0
}

keyNumbers.platser = Object.assign({},keyNumbers.gator) //Den omständliga variant behövs pga Edge, istället för  = {...keyNumbers.gator}

var OpenStreetMap_BlackAndWhite = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})

var Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var mapbox_light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVycmthcmxzb24iLCJhIjoiY2p0cjhvaGVtMGN0cDN6cW5sbjhxM3VmNiJ9.IvDJRSM2SJEtBis1qI1hLQ', {
	tileSize: 512,
	zoomOffset: -1,
})

var mapbox_normal = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVycmthcmxzb24iLCJhIjoiY2p0cjhvaGVtMGN0cDN6cW5sbjhxM3VmNiJ9.IvDJRSM2SJEtBis1qI1hLQ', {
	tileSize: 512,
	zoomOffset: -1,
})

var stockholm_gråFörenkladTiled = L.tileLayer('http://openmap.stockholm.se/bios/wms/app/baggis/web/WMS_STHLM_STOCKHOLMSKARTA_GRA_FORENKLAD?')
var stockholm_gråFörenkladEjTiled = L.tileLayer('http://openmap.stockholm.se/bios/wms/app/baggis/web/WMS_STHLM_STOCKHOLMSKARTA_GRA_FORENKLAD_RASTER?')
var stockholm_gråFörenkladNedtonadTiled = L.tileLayer('http://openmap.stockholm.se/bios/wms/app/baggis/web/WMS_STHLM_STOCKHOLMSKARTA_GRA_FORENKLAD_NT')
var stockholm_gråFörenkladNedtonadEjTilad = L.tileLayer('http://openmap.stockholm.se/bios/wms/app/baggis/web/WMS_STHLM_STOCKHOLMSKARTA_GRA_FORENKLAD_NT_RASTER')


var baseMaps = {
	"Ljus": mapbox_light,
	"Normal": mapbox_normal,
	"Satellit": Esri_WorldImagery,
}

var map = L.map('map', {
	//center: [59.3274541, 18.0543566],
	//zoom: 13,
	layers: [baseMaps['Ljus']]
})


var colors = {
	'red99': '#e6194B',
	'green99': '#3cb44b',
	'yellow100': '#ffe119',
	'blue100': '#4363d8',
	'orange9999': '#f58231',
	'purple95': '#911eb4',
	'cyan99': '#42d4f4',
	'magenta99': '#f032e6',
	'lime95': '#bfef45',
	'pink9999': '#fabebe',
	'teal99': '#469990',
	'lavender9999': '#e6beff',
	'brown99': '#9A6324',
	'beige99': '#fffac8',
	'maroon9999': '#800000',
	'mint99': '#aaffc3',
	'olive95': '#808000',
	'apricot95': '#ffd8b1',
	'navy9999': '#000075',
	'grey100': '#a9a9a9',
	'white100': '#ffffff',
	'black100': '#000000',
}

//Add layers to top right menu
L.control.layers(baseMaps).addTo(map)

function CSVToArray(strData, strDelimiter) {
	strDelimiter = (strDelimiter || ",");
	var objPattern = new RegExp(
		(
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
	);
	var arrData = [
		[]
	];
	var arrMatches = null;
	while (arrMatches = objPattern.exec(strData)) {
		var strMatchedDelimiter = arrMatches[1];
		if (
			strMatchedDelimiter.length &&
			strMatchedDelimiter !== strDelimiter
		) {
			arrData.push([]);
		}
		var strMatchedValue;
		if (arrMatches[2]) {
			strMatchedValue = arrMatches[2].replace(
				new RegExp("\"\"", "g"),
				"\""
			);
		} else {
			strMatchedValue = arrMatches[3];
		}
		arrData[arrData.length - 1].push(strMatchedValue);
	}
	return (arrData);
}

function transposeArray(a) {
	var w = a.length || 0;
	var h = a[0] instanceof Array ? a[0].length : 0;
	if (h === 0 || w === 0) {
		return [];
	}
	var i, j, t = [];
	for (i = 0; i < h; i++) {
		t[i] = [];
		for (j = 0; j < w; j++) {
			t[i][j] = a[j][i];
		}
	}
	return t;
}


var formDefaultVals = {
	'synpunkt': '',
	'namn': '',
	'kontaktinfo': ''
}

function searchAndZoom(e) {
	var input, filter

	input = document.getElementById('text_search_box')
	filter = input.value.toUpperCase().split(";")

	//ESC removes search and zooms out
	if (e.keyCode == 27) {
		input.value = ""
		filter = []
	}
	if (zoomYtor) {
		map.removeLayer(zoomYtor)
	}

	zoomYtor = L.geoJson(globalValues[0], { //Alltså alla ytor som inte är utfiltrerade (alltid dold)
			onEachFeature: onEachFeature,
			filter: function(feature, layer) {
				if (feature.properties['id'].toUpperCase() == input.value.toUpperCase()) {
					return true
				}
				if (!isNaN(parseInt(input[0], 10))) {
					return false
				}
				if (!feature.properties['Platsnamn']) {
					return false
				}
				for (l = 0; l < filter.length; l++) {

					var searchableString = feature.properties['Platsnamn']
					if (searchableString.toUpperCase().indexOf(filter[l]) == -1) {
						return false
					} else {
						console.log(searchableString.toUpperCase().indexOf(filter[l]))
					}
				} //feature.properties['id']
				return true
			},
			style: function(params) {
				return {
					opacity: 0,
					fillOpacity: 0,
					//weight: 10,
				}
			}
		}).addTo(map)
		// Loop through all the features and hide those who should not show
	map.fitBounds(zoomYtor.getBounds())
}

function jsSubmitForm(e) {
	if ($(e).find("button").text() == 'Skicka') {
		$(e).append("Skickat. Tack för din synpunkt!")
	}
	$(e).find("button").text("Skicka igen");
	$.post($(e).attr('js_action'), $(e).serialize(), function(response) {
		// do something here on success
		$(e).append
	}, 'json');
	formDefaultVals.synpunkt = $(e).find('[name="Synpunkt"]').val()
	formDefaultVals.namn = $(e).find('[name="Namn"]').val()
	formDefaultVals.kontaktinfo = $(e).find('[name="Kontaktinfo"]').val()
	return false;
}

function buildPopupContent(feature) {

	var popupContent = ''

	var fp = feature.properties
		//Skriver ut vad som är utpekat
	popupContent += '<div style="width:160px"><h4>'
	if (fp.UtpekadNormal && fp.UtpekadSnabb) {
		popupContent += 'Snabb- och normalladdning'
	} else if (fp.UtpekadNormal) {
		popupContent += 'Endast normalladdning'
	} else if (fp.UtpekadSnabb) {
		popupContent += 'Endast snabbladdning'
	} else if (fp.ejInventerad){
		popupContent += 'Ej inventerad'
	} else {
		popupContent += 'Ingen typ av laddning'
	}
	popupContent += "</h4>"

	popupContent += '<b>Skapad: </b>' + fp['skapad'].replace(/\//g, "-") + '<br>' //This replaces all "/" instead of just the first one.
	popupContent += '<b>ID: </b>' + fp['id'] + '<br>' //+ ' (' + fp['qc_id'] + ')' + '<br>'

	if (fp['AntalPlatser'] != '' && fp['AntalPlatser'] != null ){
		popupContent += '<b>Ungefärligt antal platser: </b>' + fp['AntalPlatser'] + '<br>'
	}

	popupContent += '<b>Status: </b>' + fp['Status'] + '<br>'


	if (fp['Aktoer'] != '' && fp['Aktoer'] != null) {
		popupContent += '<b>Aktör: </b>' + fp['Aktoer'] + '<br>'
	}

	if (internVy) {
		popupContent += '<br><h4>Kriteriebedömning</h4>'
		popupContent += '<b>Exponering: </b>' + fp['Exponering'] + '<br>'
		popupContent += '<b>Parkeringsvinkel: </b>' + fp['Pvinkel'] + '<br>'
		popupContent += '<b>Gaturum: </b>' + fp['Gaturum'] + '<br>'
		popupContent += '<b>Driftbredd: </b>' + fp['Driftmaott'] + '<br>'
		popupContent += '<b>Plankrock: </b>' + fp['Plankrock'] + '<br>'
		popupContent += '<b>Storlek: </b>' + fp['AntalPlBetyg'] + '<br>'
		popupContent += '<b>Vattenavstånd: </b>' + fp['Vattennaerhet'] + '<br>'
		popupContent += '<b>Sommargågata: </b>' + fp['Sommargaogata'] + '<br>'
			//popupContent += '<b>Trädavstånd: </b>' + fp['Traed'] + '<br>'
		popupContent += '<br><b>Lämpligghet för normalladdning: </b>' + fp['normalScore'] + '<br>'
		popupContent += '<b>Lämpligghet för snabbladdning: </b>' + fp['snabbScore'] + '<br>'
	}

	//if (fp.UtpekadNormal || fp.UtpekadSnabb) {
	if (fp.Status == 'Förbereds'){
		popupContent += 'Laddgatan förbereds med ledningsdragning och fundament av Ellevio, samordning med elnätsprojekt kan förekomma.'
	}
	if (fp.Traed == 1) {
		popupContent += '<br>Känsliga träd finns i närheten. Stor risk att vacuum-, eller handschakt blir nödvändligt.<br>'
	} else if (fp.Traed == 2) {
		popupContent += '<br>Känsliga träd finns i närheten. Vacuum-, eller handschakt kan bli nödvändligt.<br>'
	}
	/*if (fp.Sommargaogata) { //Numera sållas alla dessa bort.
		popupContent += '<br>Del av sommargågata med begränsad tillgång för fordon under sommarmånader.'
	}*/
	if (fp.DyrElanslutning) {
		popupContent += '<br>Kostnad för att ansluta till elnätet bedöms vara mycket hög.<br>'
	//	}
	}
	if (fp['PublikKommentar'] != '' && fp['PublikKommentar'] != null) {
		popupContent += '<br>' + fp['PublikKommentar'] + '<br>'
	}
	if (internVy) {
		popupContent += '<br><br><div name="inkomna_synpunkter"><h3>Inkomna synpunkter:</h3>'
		for (var i in fp.Synpunkter) {
			popupContent += fp.Synpunkter[i] + '<br>'
		}

		popupContent += '<br><h3>Lämna synpunkt</h3><form style="width:200px" js_action="https://script.google.com/macros/s/AKfycbzx8DB2Rct2AoYHuDOr5biKW3FWjs8zXCbQbpQ1Xg/exec" "id="gform" >' //target="hiddenFrame"   method="POST" action="https://script.google.com/macros/s/AKfycbzx8DB2Rct2AoYHuDOr5biKW3FWjs8zXCbQbpQ1Xg/exec" ">'
		popupContent += 'Synpunkt:<br>'
		popupContent += '<input type="text" name="Synpunkt" value="' + formDefaultVals.synpunkt + '"><br>'
		popupContent += 'Namn:<input type="text" name="Namn" value="' + formDefaultVals.namn + '"><br>'
		popupContent += 'Kontaktinfo:<input type="text" name="Kontaktinfo" value="' + formDefaultVals.kontaktinfo + '"><br>'
		popupContent += '<button type="button" class="button" onClick="jsSubmitForm(this.form)">Skicka</button> ' //'<input type="submit" value="Submit">'
		//popupContent += '<input type="hidden" value="' + fp.qc_id + '" name="cq_id">'
		popupContent += '</form>'
		popupContent += '</div>'
	}
	popupContent += '</div>'


	return popupContent
}

function onEachFeature(feature, layer) {
	layer.bindPopup(buildPopupContent(feature)).on('popupopen', function(popup) {
		layer.getPopup().setContent(buildPopupContent(feature))
			//console.log($(popup).find('select [name="Synpunkt"]').val())

	});
}

var allaYtor = new Promise(function(resolve, reject) {
	$.getJSON("js/allaYtor.geojson", function(data) {
		if(document.URL.indexOf("dev") >= 0){
			console.log(data)
		}
		//Interpreting antal platser and diskvalificeringskolumn.

		for (feat in data.features) {
			props = data.features[feat].properties

			if (props.Status == '' || props.Status == null) {
				props.Status = 'Tillgänglig'
				if (props.Driftmaott == '' || props.Driftmaott == null) {
					props.ejInventerad = true
				}
			}

			//Summing totalts in keyNumbers.

			keyNumbers.gator.totalt += 1
			keyNumbers.platser.totalt += props.AntalPlatser

			if (props.Status == 'Tillgänglig') {
				if (props.UtpekadNormal || props.UtpekadSnabb) {
					keyNumbers.gator.utpekade.snabbEllerNormal += 1
					keyNumbers.platser.utpekade.snabbEllerNormal += props.AntalPlatser
				}
				if (props.UtpekadNormal) {
					keyNumbers.gator.utpekade.normal += 1
					keyNumbers.platser.utpekade.normal += props.AntalPlatser
				}
				if (props.UtpekadSnabb) {
					keyNumbers.gator.utpekade.snabb += 1
					keyNumbers.platser.utpekade.snabb += props.AntalPlatser
				}
				if (props.UtpekadNormal && props.UtpekadSnabb) {
					keyNumbers.gator.utpekade.snabbOchNormal += 1
					keyNumbers.platser.utpekade.snabbOchNormal += props.AntalPlatser
				}
			} else if (props.Status == 'Avtalad') {
				keyNumbers.gator.avtalade += 1
				keyNumbers.platser.avtalade += props.AntalPlatser

			} else if (props.Status == 'Anlagd') {
				keyNumbers.gator.anlagda += 1
				keyNumbers.platser.anlagda += props.AntalPlatser
			} else if (props.Status == 'Reserverad') {
				keyNumbers.gator.reserverade += 1
				keyNumbers.platser.reserverade += props.AntalPlatser
			} else {
				keyNumbers.gator.oevriga += 1
				keyNumbers.platser.oevriga += props.AntalPlatser

			}


		}
		console.log(keyNumbers)
		resolve(data)
	});
});

var tidigareSynpunkter = new Promise(function(resolve, reject) {
	$.get(
		"https://docs.google.com/spreadsheets/d/e/2PACX-1vR2YweDwSLRgG04w6aJqRSQLGUtbtv7IyNyQCoac4P0EcuusbKimuRaYgKvdXPWpcDy72jGjHBmESn-/pub?gid=0&single=true&output=csv",
		//Reading the data from google sheets...
		function(data) {
			data = CSVToArray(data)
			tidigareSynpunkter = data
				//console.log(data)
			resolve(data)
		}
	)
});

var globalValues

Promise.all([allaYtor]).then(function(values) {
	//console.log(values);
	globalValues = values

	var nyutpekadeYtor = L.geoJson(values[0], {
		onEachFeature: onEachFeature,
		filter: function(feature, layer) {
			return Date.parse(feature.properties['SenastÄndradUtpekning']) > Date.now()-2*29*24*60*60*1000;
		},
		style: function(params) {
			return {
				weight: 30,
				color: colors.green99+33
			}
		}
	}).addTo(map)

	var ejInventeradeYtor = L.geoJson(values[0], {
		onEachFeature: onEachFeature,
		filter: function(feature, layer) {
			return feature.properties.ejInventerad;
		},
		style: function(params) {
			return {
				weight: 3,
				color: colors.grey100
			}
		}
	}).addTo(map)


	var andraYtor = L.geoJson(values[0], {
		onEachFeature: onEachFeature,
		filter: function(feature, layer) {
			return internVy //!feature.properties.UtpekadNormal && !feature.properties.UtpekadSnabb;
		},
		style: function(params) {
			return {
				weight: 3,
				color: colors.black100
			}
		}
	}).addTo(map)

	var tagnaYtor = L.geoJson(values[0], {
		onEachFeature: onEachFeature,
		filter: function(feature, layer) {
			return feature.properties.Status == 'Avtalad' || feature.properties.Status == 'Anlagd' || feature.properties.Status == 'Reserverad' || feature.properties.Status == 'Delvis tillgänglig' || feature.properties.Status == 'Delvis avtalad'; //Ta bort delvis:arna när jag styckar upp ytor direkt innan publicering.
		},
		style: function(params) {
			return {
				weight: 3,
				color: colors.blue100
			}
		}
	}).addTo(map)

	var normalladdningsytor = L.geoJson(values[0], {
		onEachFeature: onEachFeature,
		filter: function(feature, layer) {

			return feature.properties.UtpekadNormal && feature.properties.Status == 'Tillgänglig';
		},
		style: function(params) {
			return {
				weight: 3,
				color: colors.green99
			}
		}
	}).addTo(map)

	var snabbladdningsytor = L.geoJson(values[0], {
		onEachFeature: onEachFeature,
		filter: function(feature, layer) {
			return feature.properties.UtpekadSnabb && feature.properties.Status == 'Tillgänglig';
		},
		style: function(params) {
			return {
				weight: 3,
				color: colors.green99,
				dashArray: '4,6',
				lineCap: 'butt',
				fill: false
			}
		}
	}).addTo(map)

	var ytorUnderFoerberedelse = L.geoJson(values[0], {
		onEachFeature: onEachFeature,
		filter: function(feature, layer) {
			return feature.properties.Status == 'Förbereds';
		},
		style: function(params) {
			return {
				weight: 3,
				color: colors.orange9999
			}
		}
	}).addTo(map)


	var group = new L.featureGroup([andraYtor, /*tagnaYtor ,*/ normalladdningsytor, snabbladdningsytor]);
	map.fitBounds(group.getBounds());

	var legend = L.control({
		position: 'bottomright'
	});

	legend.onAdd = function(map) {
		var usedColors = {
			'Utpekad': colors.green99,
			'Avtalad eller anlagd': colors.blue100,
			'Laddgatan förbereds med ledningsdragning och fundament av Ellevio': colors.orange9999,
			'Ej utredd': colors.grey100,
			'Nyligen utpekad': colors.green99+55
		}
		var div = L.DomUtil.create('div', 'info legend');
		labels = ['<strong>Teckenförklaring</strong>']
		style = 'fill:none;stroke-width:2;stroke:'
		box = '<rect x="2" y="5" width="26" height="8" rx="2" ry="2" style="'
		for (var i in usedColors) {
			if (i=='Nyligen utpekad'){
				style = 'fill:'+usedColors[i]+';stroke-width:0;stroke:'
				box = '<rect x="1" y="4" width="26" height="14" rx="4" ry="4" style="'
			}
			div.innerHTML +=
				labels.push(' <svg width="30" height="14">'+
				box + style +
				usedColors[i] +
				'" /></svg>  ' +
				i
			);
		}

		//labels.push('<br>Denna karta visar ytor som har pekats ut av Stockholms stad som lämpliga för etablering av allmänna laddplatser. Platser som anses olämpliga visas inte i kartan. <br>Senast uppdaterad 2019-05-24')
		div.innerHTML = labels.join('<br>');
		return div;
	};
	legend.addTo(map);
});

//Lägg in analytics
//Fixa legend igen
//Fixa totaler i legend
//Föreslå ny plats-funktion