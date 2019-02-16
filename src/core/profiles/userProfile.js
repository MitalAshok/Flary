const main = require("../../main")
const uuid = require("uuid/v4")

const TABLE = "users"

var AccountType = {
    NORMAL:"NORMAL", DONATOR:"DONATOR", HELPER:"HELPER", MODERATOR:"MODERATOR", BANNED:"BANNED"
}

class UserProfile {

    constructor(id, name, json) {
        if(json !== undefined) {
            this.id = json.id
            this.name = json.name
            this.lastActivity = json.lastActivity
            this.accountType = json.accountType
            
            this.authCode = json.authCode
            this.password = json.password
            this.latestVersion = json.latestVersion
            this.lastVersions = json.lastVersions

            this.activeModels = json.activeModels
            return
        }

        this.id = id
        this.name = name
        this.lastActivity = new Date().getTime()
        this.accountType = AccountType.NORMAL

        this.authCode = uuid()
        this.password = ""
        this.latestVersion = ""
        this.lastVersions = {}

        this.activeModels = {"capeActive": false, "elytraActive":false, "earsActive":false}
    }

    getId() {
        return this.id
    }

    getName() {
        return this.name
    }

    getToken() {
        return this.authCode
    }

    getPassword() {
        return this.password
    }

    getAccountType() {
        return this.accountType
    }

    getLastActivity() {
        return this.lastActivity
    }

    getActiveModels() {
        return this.activeModels
    }

    updateUserToken() {
        this.authCode = uuid()
        this.lastActivity = new Date().getTime()

        this.save()

        return this.authCode
    }

    updateAccountType(accountType) {
        if(this.accountType === AccountType.BANNED) return false

        this.accountType = accountType

        this.save()
        return true
    }

    updateUserVersion(version, name) {
        if(this.accountType === AccountType.BANNED) return false

        this.latestVersion = version
        this.lastVersions[version] = new Date().getTime()

        this.name = name

        this.save()
        return true
    }

    updateModels(json) {
        if(this.accountType === AccountType.BANNED) return false

        this.activeModels = json
        this.save()
        return true
    }

    updatePassword(password) {
        if(this.accountType === AccountType.BANNED) return false

        this.password = password

        this.save()
        return true
    }

    save() {
        main.rethink.insertValue(TABLE, this)
    }
}

module.exports = UserProfile
module.exports.AccountType = AccountType