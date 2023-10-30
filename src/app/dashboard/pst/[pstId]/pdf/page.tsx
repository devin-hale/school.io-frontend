'use client';
import { PDFViewer } from '@react-pdf/renderer';
import PSTPDF from '../_components/PDF';

export default function PSTIDPDFPage({
	params,
}: {
	params: { pstId: string };
}): JSX.Element {
	return (
		<PDFViewer>
			<PSTPDF />
		</PDFViewer>
	);
}
