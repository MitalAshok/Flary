const userManager = require("../core/managers/userManager")
const up = require("../core/profiles/userProfile")

function readRequest(req, res) {
    if(!req.body || !req.body.id || !req.body.username) {
        res.status(400).send({"error": "Bad Request, expecting parameters (id & username)"})
        return
    }

    var response = new Object()

    var user = userManager.getUserProfileByToken(req.params.token)
    if(user == undefined) {
        response.result = "Error! The provided user token is invalid"
    }else if(user.getAccountType() === up.AccountType.BANNED) {
        response.result = "Error! The provided user is banned"
    }else if(Object.keys(user.getConfigFiles).length > 30) {
        response.result = "Error! The user has more than 30 uploaded files"
    }else{
        user.updateDiscordInfo(req.body.id, req.body.username)
        response.result = "Success!"
    }

    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest