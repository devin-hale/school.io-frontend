'use client'
import PageLoader from "../../_components/pageLoader";
import { useEffect } from "react";
import { resetClassInstanceState } from "@/redux/slices/classes/classInstanceSlice";
import { useAppDispatch } from "@/app/hooks";

export default function Loading() : JSX.Element {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(resetClassInstanceState());
		}, []);
	return <PageLoader />
}
