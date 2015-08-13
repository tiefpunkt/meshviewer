define([], function () {
  return function () {
    var self = this

    self.activeTab = null

    var tabs = document.createElement("ul")
    tabs.classList.add("tabs")

    var container = document.createElement("div")

    self.gotoTab = function(li) {
      for (var i = 0; i < tabs.children.length; i++)
        tabs.children[i].classList.remove("visible")

      while (container.firstChild)
        container.removeChild(container.firstChild)

      li.classList.add("visible")

      var tab = document.createElement("div")
      tab.classList.add("tab")
      container.appendChild(tab)
      li.child.render(tab)
      self.activeTab = li
    }

    function switchTab() {
      self.gotoTab(this)

      return false
    }

    self.add = function (title, d) {
      var li = document.createElement("li")
      li.textContent = title
      li.onclick = switchTab
      li.child = d
      tabs.appendChild(li)

      var anyVisible = false

      for (var i = 0; i < tabs.children.length; i++)
        if (tabs.children[i].classList.contains("visible")) {
          anyVisible = true
          break
        }

      if (!anyVisible)
        self.gotoTab(li)

      return li
    }

    self.render = function (el) {
      el.appendChild(tabs)
      el.appendChild(container)
    }

    self.getTab = function() {
      return self.activeTab
    }

    return self
  }
})
