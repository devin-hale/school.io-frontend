'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
	Paper,
	Card,
	Divider,
	CircularProgress,
	ListItem,
	ListItemButton,
	Button,
	IconButton,
} from '@mui/material';
import { useAppDispatch } from '@/app/hooks';
import { RootState } from '@/redux/store/store';
import { getPstInstance } from '@/redux/slices/pst/pstSlice';
import EditPSTHeaderModal from './_components/editHeaderModal';
import EditWeekModal from './_components/editWeekModal';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import {
	AddRounded,
	CheckRounded,
	CloseRounded,
	DeleteRounded,
	DownloadRounded,
	EditRounded,
	PermDeviceInformationRounded,
	PictureAsPdfRounded,
	SettingsRounded,
} from '@mui/icons-material';
import { addWeek } from '@/redux/slices/pst/modifyPSTSlice';
import AddStudentToPSTModal from './_components/addStudentModal';
import DeleteWeekModal from './_components/deleteWeekConfirm';
import ReactPDF, { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import PSTPDF from './_components/PDF';
import { useRouter } from 'next/navigation';
dayjs.extend(weekday);

interface IPSTWeek {
	weekNo: number;
	dates: string;
	attendance: {
		monday: string;
		tuesday: string;
		wednesday: string;
		thursday: string;
		friday: string;
	};
	tier1: {
		documentation: string[];
		standards: string[];
	};
	tier2: string[];
	parentComm: string[];
	progressMonitor: string[];
}

export default function PSTIdPage({
	params,
}: {
	params: { pstId: string };
}): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const pstGet = useSelector((state: RootState) => state.pst);
	const pstInstance = pstGet.pstInstance.content;
	const pstModify = useSelector((state: RootState) => state.pstModify);
	const router = useRouter();

	const [editHeaderModal, setEditHeaderModal] = useState(false);
	const [editWeekModal, setEditWeekModal] = useState<boolean>(false);
	const [selectedWeek, setSelectedWeek] = useState<IPSTWeek | null>(null);
	const [deleteWeek, setDeleteWeek] = useState<boolean>(false);
	const [addStudentOpen, setAddStudentOpen] = useState<boolean>(false);

	const [pdfSave, setPDFSave] = useState(false);

	const handlePDFSave = () => {};

	const handlePDFNav = () => {
		router.push(`/dashboard/pst/${params.pstId}/pdf`);
	};

	const handleSelectWeek = (week: IPSTWeek) => {
		setSelectedWeek({
			...week,
		});
	};

	function handleAddWeek() {
		dispatch(addWeek({ token: user.token!, params: { pstId: params.pstId } }));
	}

	useEffect(() => {
		if (
			user.token! &&
			!pstModify.editHeader.loading &&
			!pstModify.editHeader.loading &&
			!pstModify.addStudent.loading &&
			!pstModify.deleteWeek.loading
		) {
			dispatch(
				getPstInstance({ token: user.token!, params: { pstId: params.pstId } })
			);
		}
	}, [
		user.token,
		pstModify.editHeader.loading,
		pstModify.editWeek.loading,
		pstModify.addWeek.loading,
		pstModify.addStudent.loading,
		pstModify.deleteWeek.loading,
	]);

	const pstWeekList = pstInstance
		? [...pstInstance.weeks]
				.sort((a: any, b: any) => (a.weekNo < b.weekNo ? -1 : 1))
				.map((week: any, index: number, weekArr) => (
					<ListItem
						key={index}
						className='w-[1000px]'
					>
						<Card
							elevation={4}
							className='p-2 w-full'
						>
							<header>
								<Button
									className='float-right bg-green-400'
									type='button'
									variant='contained'
									onClick={() => {
										handleSelectWeek(week);
										setEditWeekModal(true);
									}}
								>
									<EditRounded className='text-white' />
								</Button>
								{index === weekArr.length - 1 && (
									<IconButton
										className='float-right mr-1'
										onClick={() => {
											handleSelectWeek(week);
											setDeleteWeek(true);
										}}
									>
										<DeleteRounded color='error' />
									</IconButton>
								)}
								<div className='text-[20px]'>
									<strong className='underline'>Week Number:</strong>
									{` ${week.weekNo}`}
								</div>
								<div className='mb-3'>
									<strong className='underline'>Dates:</strong>
									{` ${week.dates}`}
								</div>
								<Divider />
							</header>
							<div className='mt-3 mb-3 w-full'>
								<strong className='underline text-[18px]'>Attendance:</strong>
								<div className='flex flex-row flex-wrap justify-evenly'>
									<Card
										elevation={3}
										className='p-1 m-1 w-[150px]'
									>
										<strong className='underline'>Monday:</strong>
										<p>{week.attendance.monday ?? 'N/A'}</p>
									</Card>
									<Card
										elevation={3}
										className='p-1 m-1 w-[150px]'
									>
										<strong className='underline'>Tuesday:</strong>
										<p>
											{week.attendance.monday !== ''
												? week.attendance.tuesday
												: 'N/A'}
										</p>
									</Card>
									<Card
										elevation={3}
										className='p-1 m-1 w-[150px]'
									>
										<strong className='underline'>Wednesday:</strong>
										<p>
											{week.attendance.monday !== ''
												? week.attendance.wednesday
												: 'N/A'}
										</p>
									</Card>
									<Card
										elevation={3}
										className='p-1 m-1 w-[150px]'
									>
										<strong className='underline'>Thursday:</strong>
										<p>
											{week.attendance.monday !== ''
												? week.attendance.thursday
												: 'N/A'}
										</p>
									</Card>
									<Card
										elevation={3}
										className='p-1 m-1 w-[150px]'
									>
										<strong className='underline'>Friday:</strong>
										<p>{week.attendance.friday ?? 'N/A'}</p>
									</Card>
								</div>
							</div>
							<div className='flex flex-row justify-start'>
								<div className='mb-3 mr-5'>
									<strong className='underline text-[18px]'>
										Tier 1 Documentation:
									</strong>
									<div>
										{week.tier1.documentation.map((doc: any, index: number) => (
											<p key={index}>- {doc}</p>
										))}
									</div>
									<strong className='underline'>Standards:</strong>
									<div className='flex flex-row'>
										{week.tier1.standards.map(
											(standard: any, index: number, arr: []) => (
												<p
													key={index}
													className='mr-1'
												>
													{standard}
													{index < arr.length - 1 ? ',' : null}
												</p>
											)
										)}
									</div>
								</div>
								<div className='mr-5 p-1 min-h-[150px]'>
									<strong className='underline text-[18px]'>
										Tier 2 Documentation:
									</strong>
									<div>
										{week.tier2.map((comm: any, index: number) => (
											<p key={index}>- {comm}</p>
										))}
									</div>
								</div>
								<div className='mr-5 p-1 min-h-[150px]'>
									<strong className='underline text-[18px]'>
										Parent Communication:
									</strong>
									<div>
										{week.parentComm.map((comm: any, index: number) => (
											<p key={index}>- {comm}</p>
										))}
									</div>
								</div>
								<div className='mr-5 p-1 min-h-[150px]'>
									<strong className='underline text-[18px]'>
										Progress Monitoring
									</strong>
									<div>
										{week.progressMonitor.map((prog: any, index: number) => (
											<p key={index}>- {prog}</p>
										))}
									</div>
								</div>
							</div>
						</Card>
					</ListItem>
				))
		: [];

	return (
		<>
			{pstGet.pstInstance.content && (
				<EditPSTHeaderModal
					open={editHeaderModal}
					setOpen={setEditHeaderModal}
					headerInfo={{
						pstId: pstInstance._id,
						schoolYear: pstInstance.header.schoolYear,
						gradingPeriod: pstInstance.header.gradingPeriod,
						studentName: pstInstance.student
							? `${pstInstance.student.first_name} ${pstInstance.student.last_name}`
							: '',
						interventionType: pstInstance.header.intervention_type,
						west_virginia_phonics: pstInstance.header.west_virginia_phonics,
						progress_monitoring_goal:
							pstInstance.header.progress_monitoring_goal,
					}}
				/>
			)}
			{pstGet.pstInstance.content && selectedWeek && (
				<>
					<EditWeekModal
						open={editWeekModal}
						setOpen={setEditWeekModal}
						pstId={params.pstId}
						weekInfo={selectedWeek}
					/>
					<DeleteWeekModal
						open={deleteWeek}
						setOpen={setDeleteWeek}
						pstId={params.pstId}
						weekNo={selectedWeek.weekNo.toString()}
					/>
				</>
			)}
			{pstGet.pstInstance.content && (
				<AddStudentToPSTModal
					open={addStudentOpen}
					setOpen={setAddStudentOpen}
					pstId={params.pstId}
				/>
			)}
			{!pstGet.pstInstance.content ? (
				<CircularProgress />
			) : (
				<div
					id='printTarget'
					className='p-2 relative'
				>
					<Card className='p-2 m-2 flex flex-row flex-wrap items-center relative'>
						<h2 className='m-1 mr-[40px]'>
							<strong className='underline'>Documenting Teacher:</strong>
							{` ${pstInstance.owner.last_name}, ${pstInstance.owner.first_name}`}
						</h2>
						<h2>
							<strong className='underline'>Student Name:</strong>
							{pstInstance.student
								? ` ${pstInstance.student.first_name} ${pstInstance.student.last_name}`
								: ''}
							<IconButton onClick={() => setAddStudentOpen(true)}>
								<EditRounded
									className='w-[20px]'
									color='primary'
								/>
							</IconButton>
						</h2>
						<PDFDownloadLink
							className='absolute right-0 mr-2 text-white bg-blue-400 p-2 rounded hover:bg-blue-200 hover:transition-all transition-all drop-shadow-md'
							document={<PSTPDF data={pstGet.pstInstance.content}/>}
							fileName='example.pdf'
						>
							<PictureAsPdfRounded className='mr-1' />
							Download as PDF{' '}
						</PDFDownloadLink>
					</Card>
					<Card className='p-2 m-2 flex flex-col relative'>
						<div className='mr-5 flex flex-row'>
							<h2 className='mr-[40px]'>
								<strong className='underline'>School Year:</strong>
								{` ${pstInstance.header.schoolYear}`}
							</h2>
							<h2>
								<strong className='underline'>Grading Period:</strong>
								{` ${pstInstance.header.gradingPeriod}`}
							</h2>
						</div>
						<div>
							<h2>
								<strong className='underline'>Intervention Type:</strong>
								{` ${pstInstance.header.intervention_type}`}
							</h2>

							<h2>
								<strong className='underline'> West Virginia Phonics:</strong>
								{pstInstance.header.west_virginia_phonics ? <CheckRounded color='primary' /> : <CloseRounded color='error'/>}
							</h2>
							<h2>
								<strong className='underline'>Progress Monitoring Goal:</strong>
								{` ${pstInstance.header.progress_monitoring_goal}`}
							</h2>
						</div>
						<Button
							className='bg-green-400 text-white w-[25px] absolute top-[0] right-0 m-1'
							type='button'
							variant='contained'
							onClick={() => setEditHeaderModal(true)}
						>
							<EditRounded className='text-white w-[23px]' />
						</Button>
					</Card>
					<div className='p-2 m-2 flex flex-row justify-between'>
						<div>{pstWeekList}</div>
						<Button
							type='button'
							className='bg-green-400 text-white h-fit'
							variant='contained'
							onClick={handleAddWeek}
						>
							<AddRounded /> Add Week
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
