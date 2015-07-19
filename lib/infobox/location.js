define(function () {
  return function (config, el, router, d) {
    var h2 = document.createElement("h2")
    h2.textContent = "Location: " + d.toString()
    el.appendChild(h2)

    getJSON("https://nominatim.openstreetmap.org/reverse?format=json&lat=" + d.lat + "&lon=" + d.lng + "&zoom=18&addressdetail=0")
    .then(function(result) {
      h2.textContent = result.display_name
    })

    var textbox = document.createElement("textarea")
    var gpsString = d.lat.toFixed(5)  +  "," + d.lng.toFixed(5)
    textbox.value = gpsString

    var div = document.createElement("div")
    div.innerHTML = "<p>Drücke Strg-C um die Koordinaten zu kopieren.</p>"
    var p = document.createElement("p")
    div.appendChild(p)
    p.appendChild(textbox)
    el.appendChild(div)

    textbox.select()
    textbox.focus()
  }
})
