define([], function () {
  return function () {
    var refreshFunctions = []
    var input = document.createElement("input")
    input.addEventListener("input", refresh)

    var value = document.createElement("strong")
    value.classList.add("input")

    updateValue()

    function refresh() {
      refreshFunctions.forEach( function (f) {
        f()
      })
    }

    function updateValue() {
      value.textContent = input.value
    }

    function run(d) {
      return d.nodeinfo.hostname.toLowerCase().includes(input.value.toLowerCase())
    }

    function addRefresh(f) {
      refreshFunctions.push(f)
    }

    function render(el) {
      var label = document.createElement("label")
      label.textContent = "Suche Knoten"
      el.appendChild(label)
      el.appendChild(document.createTextNode(" "))
      el.appendChild(value)

      el.onclick = function () {
        el.removeChild(value)
        el.appendChild(input)
        input.focus()
      }

      input.onblur = blur
      input.onkeypress = function (e) {
        if (e.keyCode === 13)
          input.blur()
      }

      function blur() {
        updateValue()

        el.removeChild(input)
        el.appendChild(value)
      }
    }

    function clear() {
      input.value = ""
      updateValue()
      refresh()
      input.blur()
    }

    return { run: run,
             addRefresh: addRefresh,
             render: render,
             clear: clear
           }
  }
})
