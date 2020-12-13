package com.tryambak.sih.model

class ImageModel {
    var url: String? = null
    var timestamp: Long = 0
    lateinit var userId: String
    lateinit var caseId: String
    lateinit var imageId: String
    lateinit var hash: String
     var text: String?=" "
    var tampered: Boolean = false;
    var location: LocationModel? = null

    constructor() {}
}