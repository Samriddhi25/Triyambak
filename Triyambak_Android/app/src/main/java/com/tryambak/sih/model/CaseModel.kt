package com.tryambak.sih.model

class CaseModel {
    var caseId: String? = null
    var userId: String? = null
    var USERS: MutableList<String>? = null
    var images: MutableList<String>? = null
    var timestamp: Long = 0
    var area: String? = "lorium ipsum"
    var description: String? = "lorium ipsum"
    var verified: Boolean? = false
    var checked: Boolean? = false


    constructor() {}
    constructor(
        caseId: String?,
        userId: String?,
        USERS: MutableList<String>?,
        timestamp: Long,
        area: String?,
        description: String?,
        verified: Boolean?,
        checked: Boolean?
    ) {
        this.caseId = caseId
        this.userId = userId
        this.USERS = USERS
        this.timestamp = timestamp
        this.area = area
        this.description = description
        this.verified = verified
        this.checked = checked
    }


}