package com.tryambak.sih.ui

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatImageView
import androidx.appcompat.widget.AppCompatTextView
import androidx.core.app.ActivityCompat
import androidx.core.content.FileProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.CircularProgressDrawable
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.request.RequestOptions
import com.firebase.ui.firestore.FirestoreRecyclerAdapter
import com.firebase.ui.firestore.FirestoreRecyclerOptions
import com.google.android.gms.common.util.Base64Utils
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import com.tryambak.sih.Constants
import com.tryambak.sih.PermissionManager
import com.tryambak.sih.R
import com.tryambak.sih.databinding.ActivityAddImageBinding
import com.tryambak.sih.model.ImageModel
import com.tryambak.sih.model.LocationModel
import com.tryambak.sih.ui.utils.Utils
import okhttp3.*
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*


class AddImageActivity : AppCompatActivity() {
    lateinit var fusedLocationClient: FusedLocationProviderClient
    lateinit var caseId: String;
    lateinit var binding: ActivityAddImageBinding;

    override fun onStart() {
        super.onStart()

    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityAddImageBinding.inflate(layoutInflater)
       window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        setContentView(binding.root)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        var i = intent;
        if (i.extras != null) {
            caseId = (i.extras?.get("ID") as Int).toString();
        } else {
            caseId = Utils.getRandomNumberString()
        }
        binding.casId.setText(caseId);
        binding.upload.setOnClickListener({
            upload()
        })

        binding.capture.setOnClickListener({ capture() })
        var user: FirebaseUser? =
            FirebaseAuth.getInstance().currentUser
        var id: String? = user?.email
        id = id?.substring(0, 7);
        if (id != null) {

            val query: com.google.firebase.firestore.Query = FirebaseFirestore.getInstance()
                .collection(Constants.IMAGES)
                .whereEqualTo("caseId", caseId)
                .whereEqualTo("userId", id)
                .orderBy("timestamp")


            val options: FirestoreRecyclerOptions<ImageModel> =
                FirestoreRecyclerOptions.Builder<ImageModel>()
                    .setQuery(query, ImageModel::class.java)
                    .setLifecycleOwner(this)
                    .build()


            val adapter = object : FirestoreRecyclerAdapter<ImageModel, ImageViewHolder>(options) {
                override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ImageViewHolder {
                    val view: View = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.layout_images, parent, false)
                    return ImageViewHolder(view)
                }

                protected override fun onBindViewHolder(
                    holder: ImageViewHolder,
                    position: Int,
                    model: ImageModel
                ) {

                    val circularProgressDrawable = CircularProgressDrawable(applicationContext)
                    circularProgressDrawable.strokeWidth = 5f
                    circularProgressDrawable.centerRadius = 30f
                    circularProgressDrawable.start()

                    Glide.with(holder.image).load(model.url)
                        .placeholder(circularProgressDrawable)
                        .diskCacheStrategy(DiskCacheStrategy.ALL)
                        .into(holder.image)
                    holder.time?.text = Utils.getDateTime(model.timestamp)
                    holder.text?.text = model.text
                    holder.location?.text =
                        "Lat:" + model.location?.lat + " Lon:" + model.location?.lon;
                    if (!model.tampered)
                        holder.tampered.text = "Image not tampered"
                    else
                        holder.tampered.text = "Image  tampered"


                }


            }
            binding.list.adapter = adapter;
            binding.list.layoutManager = LinearLayoutManager(this)


        }
    }


    val CAMERA_REQUEST: Int = 123
    lateinit var imageUri: Uri

    fun capture() {
        createImageFile()
        dispatchTakePictureIntent()
    }

    lateinit var uploadref: StorageReference;
    lateinit var storage: FirebaseStorage;


    var flag: Boolean = false;
    var hash: String? = "f"
    var ihash: String = "g"
    fun upload() {
        binding.upload.isEnabled = false;
        binding.progressCircular.visibility = View.VISIBLE;
        storage = FirebaseStorage.getInstance()
        uploadref =
            storage.reference.child("images").child(caseId).child(UUID.randomUUID().toString());
        uploadref.putFile(imageUri)
            .addOnSuccessListener { taskSnapshot ->
                var hsh: String? = taskSnapshot?.metadata?.md5Hash

                ihash = hsh!!

                hsh = Base64Utils.decode(hsh).toString()
                //                  hash = Base64Utils.encode(image.readBytes()).toString()
hash=hsh

                if (hash.equals(hsh))
                    flag = false;
                else
                    flag = true


                taskSnapshot.storage.downloadUrl.addOnSuccessListener { uri ->
                    Toast.makeText(applicationContext, "Download URl ", Toast.LENGTH_SHORT)
                        .show();
                   setImage(uri, flag)
                }
                    .addOnFailureListener({
                        binding.progressCircular.visibility = View.GONE;
                        binding.upload.isEnabled = true;
                        Toast.makeText(applicationContext, "Error Occured", Toast.LENGTH_SHORT)
                            .show();

                    })
            }


    }


    fun getTranscription(id: String) {
        Toast.makeText(applicationContext, "Transcript Requested", Toast.LENGTH_SHORT)
            .show();
           val url = HttpUrl.parse("http://192.168.29.3:4555/upload_page/")!!.newBuilder()
     //   val url = HttpUrl.parse("http://192.168.137.1:4555/upload_page/")!!.newBuilder()
            .addQueryParameter("name", id)
            .build()
        Log.d("TAG", "getTranscription: Requested ")


        val request: Request = Request.Builder()
            .addHeader("cache-control", "no-cache")
            .addHeader("content-type", "application/json")
            .addHeader("name", id)
            .url(url)
            .build()

        Log.d("host", "getTranscription: " + request.toString())

        val client = OkHttpClient()

        client.newCall(request)
            .enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {

                    runOnUiThread({


                        Toast.makeText(
                            applicationContext,
                            "Failed" + e.toString(),
                            Toast.LENGTH_LONG
                        ).show()
                    })
                }


                override fun onResponse(call: Call, response: Response) {
                    runOnUiThread({
                        response.body()

                        Toast.makeText(
                            applicationContext,
                            "Success" + response.toString(),
                            Toast.LENGTH_LONG
                        )
                            .show()
                    })
                }


            })


    }


    fun addtoCases(CaseId: String, imageId: String) {
        var db = FirebaseFirestore.getInstance()
        db.collection(Constants.CASES)
            .document(CaseId)
            .get()
            .addOnCompleteListener() { task ->
                if (task.isSuccessful) {
                    var snapshot = task.result;
                    if (snapshot != null) {
                        if (snapshot.exists()) {
                            val ref = db.collection(Constants.CASES)
                                .document(CaseId)
                            ref.update("images", FieldValue.arrayUnion(imageId))

                        }


                    }
                }
            }

    }

    fun setImage(uri: Uri, flag: Boolean) {
        var im = ImageModel()
        im.url = uri.toString()
        im.tampered = this.flag;
        im.caseId = caseId;
        im.hash = hash.toString()
        im.userId = FirebaseAuth.getInstance().currentUser?.email?.substring(0, 7).toString()
        im.timestamp = Utils.getCurrentDateTime();
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            var manager: PermissionManager = PermissionManager(this, this)
            manager.checkAndAskPermissions(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )

            return
        }
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location: Location? ->
                // Got last known location. In some rare situations this can be null.
                if (location != null)
                    im.location = LocationModel(
                        location!!.longitude,
                        location!!.latitude
                    )

                Toast.makeText(applicationContext, location.toString(), Toast.LENGTH_SHORT).show();
                val key = UUID.randomUUID().toString()
                im.imageId = key
                addtoCases(caseId, key)
                Toast.makeText(applicationContext, "In here", Toast.LENGTH_SHORT)
                    .show();
                var db: FirebaseFirestore = FirebaseFirestore.getInstance()
                db.collection(Constants.IMAGES)
                    .document(key)
                    .set(im)
                    .addOnSuccessListener {
                        binding.progressCircular.visibility = View.GONE;
                        binding.upload.isEnabled = true;
                        Utils.addLog("Image Uploaded Succeesfully ID=$key", applicationContext)
                        Toast.makeText(applicationContext, "", Toast.LENGTH_LONG)
                            .show()

                        Log.d("TAG", "setImage: inside ")
                        getTranscription(key)

                        Toast.makeText(applicationContext, "Upload Successfull", Toast.LENGTH_LONG)
                            .show()
                    }
                    .addOnFailureListener {
                        Toast.makeText(applicationContext, "Failure "+it.toString(), Toast.LENGTH_LONG)
                            .show()

                    }


            }


    }


    var mCurrentPhotoPath: String? = null
    val REQUEST_TAKE_PHOTO = 1
    lateinit var image: File;

    @Throws(IOException::class)
    private fun createImageFile(): File? {
        // Create an image file name
        val timeStamp: String = SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
        val imageFileName = "JPEG_" + timeStamp + "_"
        val storageDir: File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        image = File.createTempFile(
            imageFileName,  /* prefix */
            ".jpg",  /* suffix */
            storageDir /* directory */
        )

        // Save a file: path for use with ACTION_VIEW intents
        mCurrentPhotoPath = image.getAbsolutePath()
        return image
    }

    private fun dispatchTakePictureIntent() {
        val takePictureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        // Ensure that there's a camera activity to handle the intent
        if (takePictureIntent.resolveActivity(packageManager) != null) {
            // Create the File where the photo should go
            var photoFile: File? = null
            try {
                photoFile = createImageFile()
            } catch (ex: IOException) {
                // Error occurred while creating the File
            }
            // Continue only if the File was successfully created
            if (photoFile != null) {
                imageUri = FileProvider.getUriForFile(
                    this,
                    "com.tryambak.sih.fileprovider",
                    photoFile
                )
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri)
                startActivityForResult(takePictureIntent, REQUEST_TAKE_PHOTO)
            }
        }
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        intent: Intent?
    ) {
        super.onActivityResult(requestCode, resultCode, intent)
        try {

            if (resultCode == Activity.RESULT_OK) {
                Toast.makeText(applicationContext, "RESult Ok", Toast.LENGTH_SHORT).show()
                val file = File(mCurrentPhotoPath)
                val bitmap = MediaStore.Images.Media
                    .getBitmap(baseContext.contentResolver, Uri.fromFile(file))
                if (bitmap != null) {
                    Toast.makeText(applicationContext, "RESult Ok again", Toast.LENGTH_SHORT).show()

                    Glide.with(binding.userImage)
                        .applyDefaultRequestOptions(RequestOptions.centerCropTransform())
                        .load(bitmap)
                        .into(binding.userImage)

                }
            }
        } catch (error: Exception) {
            error.printStackTrace()
        }
    }


}


private class ImageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    var image: AppCompatImageView = itemView.findViewById(R.id.image)
    var time: AppCompatTextView = itemView.findViewById(R.id.timestamp)
    var text: AppCompatTextView = itemView.findViewById(R.id.transcript)
    var location: AppCompatTextView = itemView.findViewById(R.id.location)
    var tampered: AppCompatTextView = itemView.findViewById(R.id.tampered)
}

