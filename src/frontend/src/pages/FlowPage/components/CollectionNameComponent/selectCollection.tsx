import { useEffect, useRef, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { readFileLibDatabase } from "../../../../controllers/API";

export default function SelectCollection({ collectionId, onChange }:
    { collectionId: string, onChange: (id: string) => void }) {

    const [datalist, setDataList] = useState([])
    const inputRef = useRef(null)
    const allData = useRef([])

    useEffect(() => {
        readFileLibDatabase().then(res => {
            setDataList(res)
            allData.current = res
        })
    }, [])

    // 检索（暂无分页，本地search）
    const timerRef = useRef(null)
    const handleInputChange = (e) => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            const value = e.target.value
            setDataList(allData.current.filter(item => item.name.indexOf(value) !== -1))
        }, 500);
    }

    return <div>
        <p className="my-4 font-bold">知识库选择</p>
        <Input placeholder='搜索知识库' ref={inputRef} onChange={handleInputChange} />
        <div className="mt-4 h-[280px] overflow-y-auto no-scrollbar">
            {datalist.map(item =>
                <div
                    key={item.collection_name}
                    className={`hover:bg-gray-100 cursor-pointer px-4 py-2 rounded-md ${item.collection_name === collectionId && 'bg-gray-100'}`}
                    onClick={() => onChange(item.collection_name)}
                >
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.collection_name}</p>
                </div>
            )}
        </div>
    </div>
};
