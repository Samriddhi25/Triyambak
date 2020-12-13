package com.tryambak.sih.ui.dashboard

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.tryambak.sih.Constants
import com.tryambak.sih.databinding.FragmentDashboardBinding
import com.tryambak.sih.model.CaseModel
import com.tryambak.sih.ui.AddImageActivity
import com.tryambak.sih.ui.dialog.SetCostDialog
import com.tryambak.sih.ui.utils.Utils
import okhttp3.*
import java.io.IOException

class DashboardFragment : Fragment() {
    var binding: FragmentDashboardBinding? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?, savedInstanceState: Bundle?
    ): View? {
       binding = FragmentDashboardBinding.inflate(layoutInflater)
        binding!!.add.setOnClickListener {
            add()
        }
        binding!!.create.setOnClickListener {
            create();

        }
        return binding!!.root
    }

    fun add() {
        val dialog = SetCostDialog()
        dialog.setListener { ID ->
            var db = FirebaseFirestore.getInstance()
            db.collection(Constants.CASES)
                .document(ID.toString())
                .get()
                .addOnCompleteListener() { task ->
                    if (task.isSuccessful) {
                        var snapshot = task.result;
                        if (snapshot != null) {
                            if (snapshot.exists()) {
                                val ref = db.collection(Constants.CASES)
                                    .document(ID.toString())
                                ref.update("users", FieldValue.arrayUnion(Utils.extractUserId()))
                                launchAdd(ID)
                            }


                        }
                    }
                }


        }
        dialog.show(childFragmentManager, "hg")
    }

    fun addtoNodes(Id: Int) {

    }

    fun launchAdd(ID: Int) {
        val intent = Intent(context, AddImageActivity::class.java)
        intent.putExtra("ID", ID)
        startActivity(intent)

    }


    fun create() {

        var id: String? = Utils.extractUserId();
        val caseId = Utils.getRandomNumberString()
        var db = FirebaseFirestore.getInstance()
        var caseModel = CaseModel()
        caseModel.caseId = caseId
        caseModel.userId = id
        caseModel.timestamp = Utils.getCurrentDateTime()
        caseModel.USERS = ArrayList<String>()
        if (id != null) {
            (caseModel.USERS as ArrayList<String>).add(id)
        }

        db.collection(Constants.CASES)
            .document(caseId)
            .set(caseModel)
            .addOnSuccessListener {
                Utils.addLog("Case " + caseModel.caseId + " was created",context)
                launchAdd(Integer.parseInt(caseId))
            }


    }

    fun getTranscription() {

        val url: String = "http://192.168.29.3:8501/v1/models/tryambak_att:predict";
        var req: RequestBody = FormBody.Builder()
            .add("signature_name", "serving_default")
            .build()
        val request: Request = Request.Builder()
            .addHeader("cache-control", "no-cache")
            .addHeader("content-type", "application/json")
            .url(url)
            .post(req)
            .build()

        val client = OkHttpClient()

        client.newCall(request)
            .enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {

                    activity?.runOnUiThread({
                        Toast.makeText(context, "Failed" + e.toString(), Toast.LENGTH_LONG).show()
                    })
                }


                override fun onResponse(call: Call, response: Response) {
                    activity?.runOnUiThread({


                        Toast.makeText(context, "Success" + response.toString(), Toast.LENGTH_LONG)
                            .show()
                    })
                }


            })
    }
}