package com.tryambak.sih.ui.utils;

import com.google.gson.Gson;
import com.tryambak.sih.model.ImageModel;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class NetworkUtils {

    public static void sendrequest(ImageModel model) {

        final String POST_PARAMS = new Gson().toJson(model);
        final String NETWORK_URL = "";
        try {

            System.out.println(POST_PARAMS);
            URL obj = new URL(NETWORK_URL);
            HttpURLConnection postConnection = (HttpURLConnection) obj.openConnection();
            postConnection.setRequestMethod("POST");
            postConnection.setRequestProperty("Content-Type", "application/json");
            postConnection.setDoOutput(true);
            OutputStream os = postConnection.getOutputStream();
            os.write(POST_PARAMS.getBytes());
            os.flush();
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }


    }
/*
    public static  void call(String id)
    {
        URL url = new URL("https://www.stackabuse.com");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        Map<String, String> params = new HashMap<>();
        params.put("name", id);
        StringBuilder requestData = new StringBuilder();

        for (Map.Entry<String, String> param : params.entrySet()) {
            if (requestData.length() != 0) {
                requestData.append('&');
            }
            // Encode the parameter based on the parameter map we've defined
            // and append the values from the map to form a single parameter
            requestData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            requestData.append('=');
            requestData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }

// Convert the requestData into bytes
        byte[] requestDataByes = requestData.toString().getBytes("UTF-8");
     }

 */
}
