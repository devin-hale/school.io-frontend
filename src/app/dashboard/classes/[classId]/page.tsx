'use client'
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export default function ClassInstancePagea({ params }: { params: { classId: string } }): JSX.Element {
	const nextRouter: AppRouterInstance = useRouter();
	return <div>{params.classId}</div>
}
