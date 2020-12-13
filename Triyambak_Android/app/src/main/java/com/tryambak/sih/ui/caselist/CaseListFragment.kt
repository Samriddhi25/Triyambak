package com.tryambak.sih.ui.caselist

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.widget.AppCompatButton
import androidx.appcompat.widget.AppCompatTextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.firebase.ui.firestore.FirestoreRecyclerAdapter
import com.firebase.ui.firestore.FirestoreRecyclerOptions
import com.google.firebase.firestore.FirebaseFirestore
import com.tryambak.sih.Constants
import com.tryambak.sih.R
import com.tryambak.sih.databinding.FragmentCaseListBinding
import com.tryambak.sih.model.CaseModel
import com.tryambak.sih.ui.AddImageActivity
import com.tryambak.sih.ui.utils.Utils

class CaseListFragment : Fragment() {

    lateinit var binding: FragmentCaseListBinding;

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment

        binding = FragmentCaseListBinding.inflate(inflater)
        var id: String? = Utils.extractUserId()
        val query: com.google.firebase.firestore.Query = FirebaseFirestore.getInstance()
            .collection(Constants.CASES)
            .whereEqualTo("userId",id)
            .orderBy("timestamp")



        val options: FirestoreRecyclerOptions<CaseModel> =
            FirestoreRecyclerOptions.Builder<CaseModel>()
                .setQuery(query, CaseModel::class.java)
                .setLifecycleOwner(viewLifecycleOwner)
                .build()


        val adapter = object : FirestoreRecyclerAdapter<CaseModel, CaseListViewHolder>(options) {
            override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CaseListViewHolder {
                val view: View = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.layout_case_item, parent, false)
                return CaseListViewHolder(view)
            }

            override fun onBindViewHolder(
                holder: CaseListViewHolder,
                position: Int,
                model: CaseModel
            ) {
                holder.caseID.setText(model.caseId)
                holder.CaseDate.setText(Utils.getDateTime(model.timestamp))
                holder.CasedetailButton.tag = model.caseId
                holder.CasedetailButton.setOnClickListener {
                    var i: Intent =
                        Intent(context, AddImageActivity::class.java)
                    var id:String= holder.CasedetailButton.tag as String
                    i.putExtra(Constants.ID,Integer.parseInt(id))
                    startActivity(i)
                }
            }
        }
        binding.list.layoutManager = LinearLayoutManager(context)
        binding.list.adapter = adapter
        return binding.root
    }


    class CaseListViewHolder(itemview: View) : RecyclerView.ViewHolder(itemview) {

        var caseID: AppCompatTextView = itemview.findViewById(R.id.caseId)
        var CaseDate: AppCompatTextView = itemview.findViewById(R.id.caseDate)
        var CasedetailButton: AppCompatButton = itemview.findViewById(R.id.showDetails)
    }


}