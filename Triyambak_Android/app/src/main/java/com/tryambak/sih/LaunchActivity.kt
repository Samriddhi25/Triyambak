package com.tryambak.sih

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.tryambak.sih.ui.auth.FingerprintLoginActivity
import com.tryambak.sih.ui.auth.LoginActivity
import java.io.File


class LaunchActivity : AppCompatActivity() {
    private lateinit var mAuth: FirebaseAuth;
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_launch)


        mAuth = FirebaseAuth.getInstance()
        if (mAuth.currentUser == null) {
            signin()
        } else {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                var i = Intent(this@LaunchActivity, FingerprintLoginActivity::class.java)
                startActivity(i);
                finish()
            } else {
                var i = Intent(this@LaunchActivity, NavigationActivity::class.java)
                startActivity(i);
                finish()
            }

        }




    }

    private fun signin() {
        var i = Intent(this@LaunchActivity, LoginActivity::class.java)
        startActivity(i);
        finish()

    }

    fun isRooted(): Boolean {

        // get from build info
        val buildTags = Build.TAGS
        if (buildTags != null && buildTags.contains("test-keys")) {
            return true
        }

        // check if /system/app/Superuser.apk is present
        try {
            val file = File("/system/app/Superuser.apk")
            if (file.exists()) {
                return true
            }
        } catch (e1: Exception) {
            // ignore
        }

        // try executing commands
        return (canExecuteCommand("/system/xbin/which su")
                || canExecuteCommand("/system/bin/which su") || canExecuteCommand("which su"))
    }

    // executes a command on the system
    private fun canExecuteCommand(command: String): Boolean {
        val executedSuccesfully: Boolean
        executedSuccesfully = try {
            Runtime.getRuntime().exec(command)
            true
        } catch (e: Exception) {
            false
        }
        return executedSuccesfully
    }
}