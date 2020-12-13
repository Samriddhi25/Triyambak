package com.tryambak.sih.ui.utils;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;

import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.tryambak.sih.Constants;
import com.tryambak.sih.model.LocationModel;
import com.tryambak.sih.model.LogModel;

import org.threeten.bp.Instant;
import org.threeten.bp.LocalDateTime;
import org.threeten.bp.ZoneId;
import org.threeten.bp.zone.ZoneRulesException;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.UUID;

public class Utils {

    private static FusedLocationProviderClient
            fusedLocationProviderClient;


    public static long getCurrentDateTime() {
        return Instant.now().toEpochMilli();
    }

    public static LocalDateTime getLocalDateTime(long datetime) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(datetime), ZoneId.systemDefault());
    }


    public static String getDateTime(long date) {
        String mdate = "";
        try {
            LocalDateTime dateTime = getLocalDateTime(date);
            mdate = dateTime.getMonth() + " " + dateTime.getDayOfMonth() + "," + dateTime.getYear() + " " + dateTime.getHour() + ":" + dateTime.getMinute();

        } catch (ZoneRulesException e) {

        }

        return mdate;
    }


    public static String getRandomNumberString() {
        // It will generate 6 digit random Number.
        // from 0 to 999999
        Random rnd = new Random();
        int number = rnd.nextInt(999999);
        String tmp = String.format("%06d", number);
        if (tmp.charAt(0) == 0)
            tmp = tmp.substring(1);
        tmp = "1" + tmp;

        // this will convert any number sequence into 6 character.
        return tmp;
    }

    public static String extractUserId() {
        String userId = null;
        FirebaseAuth auth = FirebaseAuth.getInstance();
        if (auth != null) {
            userId = auth.getCurrentUser().getEmail().substring(0, Constants.USERID_LENGTH);
        }

        return userId;
    }

    public static String getIPAddress(boolean useIPv4) {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf.getInetAddresses());
                for (InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress()) {
                        String sAddr = addr.getHostAddress();
                        //boolean isIPv4 = InetAddressUtils.isIPv4Address(sAddr);
                        boolean isIPv4 = sAddr.indexOf(':') < 0;

                        if (useIPv4) {
                            if (isIPv4)
                                return sAddr;
                        } else {
                            if (!isIPv4) {
                                int delim = sAddr.indexOf('%'); // drop ip6 zone suffix
                                return delim < 0 ? sAddr.toUpperCase() : sAddr.substring(0, delim).toUpperCase();
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        } // for now eat exceptions
        return "";
    }

    public static void addLog(final String message, Context ctx) {
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(ctx);
        if (ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        fusedLocationProviderClient.getLastLocation()
                .addOnSuccessListener(new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        LogModel logModel = new LogModel();
                        logModel.setEventId(UUID.randomUUID().toString());
                        logModel.setTimestamping(getCurrentDateTime());
                        logModel.setUserId(extractUserId());
                        logModel.setLm(new LocationModel(location.getLatitude(), location.getLongitude()));
                        logModel.setMessage(message);
                        logModel.setMacAddress(getMACAddress("wlan0"));
                        logModel.setIp(getIPAddress(true));
                        if (logModel.getIp() == null)
                            logModel.setIp(getIPAddress(false));
                        FirebaseFirestore db = FirebaseFirestore.getInstance();
                        db.collection(Constants.LOGS)
                                .document(logModel.getEventId())
                                .set(logModel);
                    }
                });

    }

    public static String getMACAddress(String interfaceName) {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                if (interfaceName != null) {
                    if (!intf.getName().equalsIgnoreCase(interfaceName)) continue;
                }
                byte[] mac = intf.getHardwareAddress();
                if (mac == null) return "";
                StringBuilder buf = new StringBuilder();
                for (byte aMac : mac) buf.append(String.format("%02X:", aMac));
                if (buf.length() > 0) buf.deleteCharAt(buf.length() - 1);
                return buf.toString();
            }
        } catch (Exception ignored) {
        } // for now eat exceptions
        return "";
        /*try {
            // this is so Linux hack
            return loadFileAsString("/sys/class/net/" +interfaceName + "/address").toUpperCase().trim();
        } catch (IOException ex) {
            return null;
        }*/
    }


}
