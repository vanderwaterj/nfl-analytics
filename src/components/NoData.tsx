
interface NoDataProps {
    message: string;
}

export default function NoData(props:NoDataProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl text-gray-600">{props.message}</div>
        </div>
    )
}