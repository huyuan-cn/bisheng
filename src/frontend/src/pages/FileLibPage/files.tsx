import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ShadTooltip from "../../components/ShadTooltipComponent";
import { deleteFile, readFileByLibDatabase } from "../../controllers/API";
import UploadModal from "../../modals/UploadModal";
export default function FilesPage() {
    const { id } = useParams()
    // 上传 上传成功添加到列表
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [page, setPage] = useState(1)
    const [datalist, setDataList] = useState([])
    const [pageEnd, setPageEnd] = useState(false)

    const loadPage = (_page) => {
        setLoading(true)
        readFileByLibDatabase(id, _page).then(res => {
            setDataList(res)
            setPage(_page)
            setPageEnd(!res.length)
            setLoading(false)
        })
    }
    useEffect(() => {
        // @ts-ignore
        setTitle(window.libname)
        loadPage(1)
    }, [])

    const handleOpen = (e) => {
        setOpen(e)
        loadPage(page)
    }

    // 删除
    const { delShow, idRef, close, delConfim } = useDelete()

    const handleDelete = () => {
        deleteFile(idRef.current).then(res => {
            loadPage(page)
            close()
        })
    }
    return <div className="w-full h-screen p-6 relative overflow-y-auto">
        {loading && <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center z-10 bg-[rgba(255,255,255,0.6)] dark:bg-blur-shared">
            <span className="loading loading-infinity loading-lg"></span>
        </div>}
        <ShadTooltip content="返回" side="top">
            <button className="extra-side-bar-buttons w-[36px] absolute top-[26px]" onClick={() => { }} >
                <Link to='/filelib'><ArrowLeft className="side-bar-button-size" /></Link>
            </button>
        </ShadTooltip>
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="ml-12">
                <TabsTrigger value="account" className="roundedrounded-xl">文件列表</TabsTrigger>
                <TabsTrigger disabled value="password">系统对接</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <div className="flex justify-between items-center">
                    <span className=" text-gray-800">{title}</span>
                    <Button className="h-8 rounded-full" onClick={() => { setOpen(true) }}>上传</Button>
                </div>
                <Table>
                    <TableCaption>
                        <div className="join grid grid-cols-2 w-[200px]">
                            <button disabled={page === 1} className="join-item btn btn-outline btn-xs" onClick={() => loadPage(page - 1)}>上一页</button>
                            <button disabled={pageEnd} className="join-item btn btn-outline btn-xs" onClick={() => loadPage(page + 1)}>下一页</button>
                        </div>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[600px]">文件名称</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>上传时间</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {datalist.map(el => (
                            <TableRow key={el.id}>
                                <TableCell className="font-medium">{el.file_name}</TableCell>
                                <TableCell><span className={el.status === 3 && 'text-red-500'}>{['解析失败', '解析中', '完成', '解析失败'][el.status]}</span></TableCell>
                                <TableCell>{el.create_time.replace('T', ' ')}</TableCell>
                                <TableCell className="text-right">
                                    <a href="javascript:;" onClick={() => delConfim(el.id)} className="underline ml-4">删除</a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 分页 */}
            </TabsContent>
            <TabsContent value="password"></TabsContent>
        </Tabs>
        <UploadModal id={id} open={open} setOpen={handleOpen}></UploadModal>
        {/* 删除确认 */}
        <dialog className={`modal ${delShow && 'modal-open'}`}>
            <form method="dialog" className="modal-box w-[360px] bg-[#fff] shadow-lg dark:bg-background">
                <h3 className="font-bold text-lg">提示!</h3>
                <p className="py-4">确认删除该文件？</p>
                <div className="modal-action">
                    <Button className="h-8 rounded-full" variant="outline" onClick={close}>取消</Button>
                    <Button className="h-8 rounded-full" variant="destructive" onClick={handleDelete}>删除</Button>
                </div>
            </form>
        </dialog>
    </div>
};


const useDelete = () => {
    const [delShow, setDelShow] = useState(false)
    const idRef = useRef<any>(null)

    return {
        delShow,
        idRef,
        close: () => {
            setDelShow(false)
        },
        delConfim: (id) => {
            idRef.current = id
            setDelShow(true)
        }
    }
}