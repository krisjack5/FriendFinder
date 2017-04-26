// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on friendsData
// ===============================================================================

var friendsData = require("../data/friendsData");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // allow developer to access friends data.
  app.get("/api/friends", function(req, res) {
    res.json(friendsData);
  });
  //POST new friend and push to freindData array.
  app.post("/api/friends", function(req, res) {
    var newFriend = req.body;
    // pushing body data onto the friendsData array.
    friendsData.push(newFriend); 
    //must respond, if you dont, the browswer will just hang until it times out.
    res.json(friendsData);
  });
};