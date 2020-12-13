package com.tryambak.sih.ui.auth

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.fingerprint.FingerprintManager
import android.os.Build
import android.os.CancellationSignal
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import com.tryambak.sih.NavigationActivity

@RequiresApi(Build.VERSION_CODES.M)
@SuppressLint("ByteOrderMark")
class FingerprintHelper(private val appContext: Context) :
    FingerprintManager.AuthenticationCallback() {

    lateinit var cancellationSignal: CancellationSignal

    fun startAuth(
        manager: FingerprintManager,
        cryptoObject: FingerprintManager.CryptoObject
    ) {

        cancellationSignal = CancellationSignal()

        if (ActivityCompat.checkSelfPermission(
                appContext,
                Manifest.permission.USE_FINGERPRINT
            ) !=
            PackageManager.PERMISSION_GRANTED
        ) {
            return
        }
        manager.authenticate(cryptoObject, cancellationSignal, 0, this, null)
    }

    override fun onAuthenticationError(
        errMsgId: Int,
        errString: CharSequence
    ) {
        Toast.makeText(
            appContext,
            "Authentication error\n" + errString,
            Toast.LENGTH_LONG
        ).show()
    }

    override fun onAuthenticationHelp(
        helpMsgId: Int,
        helpString: CharSequence
    ) {
        Toast.makeText(
            appContext,
            "Authentication help\n" + helpString,
            Toast.LENGTH_LONG
        ).show()
    }

    override fun onAuthenticationFailed() {
        Toast.makeText(
            appContext,
            "Authentication failed.",
            Toast.LENGTH_LONG
        ).show()
    }

    override fun onAuthenticationSucceeded(
        result: FingerprintManager.AuthenticationResult
    ) {

        Toast.makeText(
            appContext,
            "Authentication succeeded.",
            Toast.LENGTH_LONG
        ).show()
        launchintent()
    }

    fun launchintent() {
        var i = Intent(appContext, NavigationActivity::class.java)
        appContext.startActivity(i);
    }


}