define([], function () {
  return function (filterManager) {
    var container = document.createElement("ul")
    container.classList.add("filters")
    var div = document.createElement("div")

    function render(el) {
      el.appendChild(div)
    }

    function filtersChanged(filters) {
      while (container.firstChild)
        container.removeChild(container.firstChild)

      filters.forEach( function (d) {
        var li = document.createElement("li")
        var div = document.createElement("div")
        container.appendChild(li)
        li.appendChild(div)
        d.render(div)

        var button = document.createElement("button")
        button.textContent = ""
        button.onclick = function () {
          if (typeof d.clear !== "undefined")
            d.clear()
          else
            filterManager.removeFilter(d)
        }
        // Prevent blur events from stealing the click event
        button.onmousedown = function (ev) {
          ev.preventDefault()
        }
        li.appendChild(button)
      })

      if (container.parentNode === div && filters.length === 0)
        div.removeChild(container)
      else if (filters.length > 0)
        div.appendChild(container)
    }

    return { render: render,
             filtersChanged: filtersChanged
           }
  }
})
