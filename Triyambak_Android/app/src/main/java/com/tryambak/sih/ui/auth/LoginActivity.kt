package com.tryambak.sih.ui.auth

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import com.google.firebase.auth.FirebaseAuth
import com.tryambak.sih.NavigationActivity
import com.tryambak.sih.databinding.ActivityLoginBinding
import com.tryambak.sih.ui.utils.Utils

class LoginActivity : AppCompatActivity() {

    private lateinit var mAuth: FirebaseAuth;

    lateinit var binding: ActivityLoginBinding;
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        mAuth = FirebaseAuth.getInstance()


        binding.Login.setOnClickListener({
            sanitize(binding.userName, binding.password)

        })

    }

    fun sanitize(username: TextInputEditText, password: TextInputEditText) {
        var id = username.editableText?.toString()
        val pass = password.editableText?.toString()
        id = id + "@dcoders.com"
        if (pass != null) {
            login(id, pass)
        } else
            Toast.makeText(applicationContext, "Passsword can't be empty", Toast.LENGTH_LONG).show()

    }

    fun login(username: String, password: String) {
        mAuth.signInWithEmailAndPassword(username, password)
            .addOnCompleteListener(this) { tast ->


                if (tast.isSuccessful) {
                    Toast.makeText(
                        applicationContext,
                        "Login Successfull",
                        Toast.LENGTH_LONG
                    ).show()
                    Utils.addLog("User Logged In", applicationContext)

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        val i = Intent(this@LoginActivity, FingerprintLoginActivity::class.java)
                        startActivity(i)
                        finish()
                    } else {
                        val i = Intent(this@LoginActivity, NavigationActivity::class.java)
                        startActivity(i)
                        finish()
                    }


                } else {
                    Toast.makeText(applicationContext, "Error Occured", Toast.LENGTH_LONG).show()
                }
            }

    }


}