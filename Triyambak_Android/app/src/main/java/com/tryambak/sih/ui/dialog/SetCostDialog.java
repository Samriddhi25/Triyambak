package com.tryambak.sih.ui.dialog;

import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.tryambak.sih.databinding.SetCostDialogBinding;


public class SetCostDialog extends AppCompatDialogFragment {
    SetCostDialogBinding setCostDialogBinding;
    SetCostDialogListener listener;


    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(requireActivity());
        setCostDialogBinding = SetCostDialogBinding.inflate(getActivity().getLayoutInflater());

        View view = setCostDialogBinding.getRoot();

        builder.setView(view)
                .setTitle("Enter Case ID")
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {

                    }
                })
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {

                        Integer cost = Integer.parseInt(setCostDialogBinding.cost.getText().toString());
                        listener.setCost(cost);
                    }
                });


        return builder.create();
    }


    public interface SetCostDialogListener {
        void setCost(int cost);
    }

    public void setListener(SetCostDialogListener listener) {
        this.listener = listener;
    }
}
