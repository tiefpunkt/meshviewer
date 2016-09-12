define(["../config", "moment", "router", "leaflet", "gui", "numeral"],
function (config, moment, Router, L, GUI, numeral) {
  return function () {
    function handleData(data) {
      var dataNodes = data[0]

      if (dataNodes.version !== 1 ) {
        var err = "Unsupported nodes version: " + dataNodes.version
        throw err
      }

      var nodes = Object.keys(dataNodes.nodes).map(function (key) { return dataNodes.nodes[key] })
      console.log(nodes)

      nodes = nodes.filter( function (d) {
        return "firstseen" in d && "lastseen" in d
      })

      console.log(nodes)

      nodes.forEach( function(node) {
        node.firstseen = moment.utc(node.firstseen).local()
        node.lastseen = moment.utc(node.lastseen).local()
      })

      var now = moment()
      var age = moment(now).subtract(config.maxAge, "days")

      var newnodes = limit("firstseen", age, sortByKey("firstseen", nodes).filter(online))
      var lostnodes = limit("lastseen", age, sortByKey("lastseen", nodes).filter(offline))

      return { now: now,
               timestamp: moment.utc(data[0].timestamp).local(),
               nodes: {
                 all: nodes,
                 new: newnodes,
                 lost: lostnodes
               },
               graph: {
                 links: [],
                 nodes: []
               }
             }
    }

    numeral.language("de")
    moment.locale("de")

    var router = new Router()

    var urls = [ config.dataPath + "nodes.json"
               ]
    function update() {
      return Promise.all(urls.map(getJSON))
                    .then(handleData)
    }

    update()
      .then(function (d) {
        var gui = new GUI(config, router)
        gui.setData(d)
        router.setData(d)
        router.start()

        window.setInterval(function () {
          update().then(function (d) {
            gui.setData(d)
            router.setData(d)
          })
        }, 60000)
      })
      .catch(function (e) {
        document.body.textContent = e
        console.log(e)
      })
  }
})
