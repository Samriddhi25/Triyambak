package com.tryambak.sih.ui.dialog;

import android.app.Dialog;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.tryambak.sih.databinding.DialogDetailsBinding;

public class DetailsDialog extends AppCompatDialogFragment {

    DialogDetailsBinding binding ;
    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {

        binding=DialogDetailsBinding.inflate(getActivity().getLayoutInflater());
        AlertDialog.Builder builder = new AlertDialog.Builder(requireActivity());

        return super.onCreateDialog(savedInstanceState);
    }
}
