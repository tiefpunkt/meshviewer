define([ "chroma-js", "map", "sidebar", "tabs", "container", "meshstats",
         "linklist", "nodelist", "simplenodelist", "infobox/main",
         "proportions", "forcegraph", "title", "about", "datadistributor",
         "filters/filtergui", "filters/hostname" ],
function (chroma, Map, Sidebar, Tabs, Container, Meshstats, Linklist,
          Nodelist, SimpleNodelist, Infobox, Proportions, ForceGraph,
          Title, About, DataDistributor, FilterGUI, HostnameFilter) {
  return function (config, router) {
    var self = this
    var content
    var contentDiv
    var tabOverview
    var tabNodelist
    var tabAbout

    var linkScale = chroma.scale(chroma.interpolate.bezier(["#04C714", "#FF5500", "#F02311"])).domain([1, 5])
    var sidebar

    var buttons = document.createElement("div")
    buttons.classList.add("buttons")

    var fanout = new DataDistributor()
    var fanoutUnfiltered = new DataDistributor()
    fanoutUnfiltered.add(fanout)

    function removeContent() {
      if (!content)
        return

      router.removeTarget(content)
      fanout.remove(content)

      content.destroy()

      content = null
    }

    function addContent(K) {
      removeContent()

      content = new K(config, linkScale, sidebar.getWidth, router, buttons)
      content.render(contentDiv)

      fanout.add(content)
      router.addTarget(content)
    }

    function mkView(K) {
      return function () {
        addContent(K)
      }
    }

    contentDiv = document.createElement("div")
    contentDiv.classList.add("content")
    document.body.appendChild(contentDiv)

    sidebar = new Sidebar(document.body)

    contentDiv.appendChild(buttons)

    /*var buttonToggle = document.createElement("button")
    buttonToggle.textContent = ""
    buttonToggle.setAttribute("data-tooltip", "Zwischen Karten- und Graphenansicht wechseln")
    buttonToggle.onclick = function () {
      if (content.constructor === Map)
        router.view("g")
      else
        router.view("m")
    }

    buttons.appendChild(buttonToggle)*/

    var title = new Title(config)

    var header = new Container("header")
    var infobox = new Infobox(config, sidebar, router)
    var tabs = new Tabs()
    var overview = new Container()
    var meshstats = new Meshstats(config)
    var newnodeslist = new SimpleNodelist("new", "firstseen", router, "Neue Sensoren")
    var lostnodeslist = new SimpleNodelist("lost", "lastseen", router, "Verschwundene Sensoren")
    var nodelist = new Nodelist(router)
    var linklist = new Linklist(linkScale, router)
    var statistics = new Proportions(config, fanout)
    var about = new About()

    fanoutUnfiltered.add(meshstats)
    fanoutUnfiltered.add(newnodeslist)
    fanoutUnfiltered.add(lostnodeslist)
    fanout.add(nodelist)
    fanout.add(linklist)
    fanout.add(statistics)

    sidebar.add(header)
    header.add(meshstats)

    overview.add(newnodeslist)
    overview.add(lostnodeslist)

    var filterGUI = new FilterGUI(fanout)
    fanout.watchFilters(filterGUI)
    header.add(filterGUI)

    var hostnameFilter = new HostnameFilter()
    hostnameFilter.addRefresh(function(){
      if((tabs.getTab() === tabOverview || tabs.getTab() === tabAbout) && tabNodelist !== undefined)
        tabs.gotoTab(tabNodelist)
    })
    fanout.addFilter(hostnameFilter)

    sidebar.add(tabs)
    tabOverview = tabs.add("Aktuelles", overview)
    tabNodelist = tabs.add("Sensoren", nodelist)
    //tabs.add("Verbindungen", linklist)
    tabs.add("Statistiken", statistics)
    tabAbout = tabs.add("Über", about)

    router.addTarget(title)
    router.addTarget(infobox)

    router.addView("m", mkView(Map))
    //router.addView("g", mkView(ForceGraph))

    router.view("m")

    self.setData = fanoutUnfiltered.setData

    return self
  }
})
