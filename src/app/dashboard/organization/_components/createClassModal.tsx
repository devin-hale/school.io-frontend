'use client'
import { Dialog, DialogContent, DialogTitle, Autocomplete } from "@mui/material";
import { SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { IUserDataState } from "@/redux/slices/userDataSlice";


export interface ICreateClassModalProps {
	createClassModalOpen: boolean;
	setCreateClassModalOpen: SetStateAction<boolean>;
}

export default function CreateClassModal(props:ICreateClassModalProps): JSX.Element {
	const userData:IUserDataState = useSelector((state:RootState) => state.userData)
	
	function handleClose() : void {
		return	
	}

	return <Dialog open={props.createClassModalOpen} onClose={handleClose}>
	<DialogTitle>Create New Class</DialogTitle>	
	<DialogContent>
		Please enter details for new class.
	</DialogContent>



	</Dialog>
}
