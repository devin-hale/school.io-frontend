'use client'

export default function PSTIdPage ({params}:{params: {pstId: string;}}) : JSX.Element {
	return <div>{params.pstId}</div>
}
