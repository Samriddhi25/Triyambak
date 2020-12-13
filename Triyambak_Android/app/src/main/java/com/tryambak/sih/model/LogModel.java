package com.tryambak.sih.model;

public class LogModel {
    String userId;
    String eventId;
    String message;
    long timestamping;
    LocationModel lm;
    String ip;
    String macAddress;

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }

    public LogModel() {
    }

    public LogModel(String userId, String eventId, String message, long timestamping, LocationModel lm, String ip) {
        this.userId = userId;
        this.eventId = eventId;
        this.message = message;
        this.timestamping = timestamping;
        this.lm = lm;
        this.ip = ip;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTimestamping() {
        return timestamping;
    }

    public void setTimestamping(long timestamping) {
        this.timestamping = timestamping;
    }

    public LocationModel getLm() {
        return lm;
    }

    public void setLm(LocationModel lm) {
        this.lm = lm;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }
}
