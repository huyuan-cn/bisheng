import { FileDown, FileUp, Menu, Save, Search, TerminalSquare, LogOut, Combine, Bell } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import ShadTooltip from "../../../../components/ShadTooltipComponent";
import { Separator } from "../../../../components/ui/separator";
import { alertContext } from "../../../../contexts/alertContext";
import { PopUpContext } from "../../../../contexts/popUpContext";
import { TabsContext } from "../../../../contexts/tabsContext";
import { typesContext } from "../../../../contexts/typesContext";
import ApiModal from "../../../../modals/ApiModal";
import ExportModal from "../../../../modals/exportModal";
import { APIClassType, APIObjectType } from "../../../../types/api";
import { classNames, nodeColors, nodeIconsLucide, nodeNames, } from "../../../../utils";
import DisclosureComponent from "../DisclosureComponent";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import L2ParamsModal from "../../../../modals/L2ParamsModal";
import AlertDropdown from "../../../../alerts/alertDropDown";
import { FlowType } from "../../../../types/flow";

export default function ExtraSidebar({ flow }: { flow: FlowType }) {
  const { data } = useContext(typesContext);
  const { openPopUp } = useContext(PopUpContext);
  const { flows, tabId, uploadFlow, tabsState, saveFlow } =
    useContext(TabsContext);
  const AlertWidth = 384;
  const { notificationCenter, setNotificationCenter, setSuccessData, setErrorData } = useContext(alertContext);
  const [dataFilter, setFilterData] = useState(data);
  const [search, setSearch] = useState("");
  const isPending = tabsState[tabId]?.isPending;

  const [open, setOpen] = useState(false)
  // const flow = useMemo(() => {
  //   return flows.find(el => el.id === tabId)
  // }, [flows, tabId])

  function onDragStart(
    event: React.DragEvent<any>,
    data: { type: string; node?: APIClassType }
  ) {
    //start drag event
    var crt = event.currentTarget.cloneNode(true);
    crt.style.position = "absolute";
    crt.style.top = "-500px";
    crt.style.right = "-500px";
    crt.classList.add("cursor-grabbing");
    document.body.appendChild(crt);
    event.dataTransfer.setDragImage(crt, 0, 0);
    event.dataTransfer.setData("nodedata", JSON.stringify(data));
  }

  function handleSearchInput(e: string) {
    setFilterData((_) => {
      let ret = {};
      Object.keys(data).forEach((d: keyof APIObjectType, i) => {
        ret[d] = {};
        let keys = Object.keys(data[d]).filter((nd) =>
          nd.toLowerCase().includes(e.toLowerCase())
        );
        keys.forEach((element) => {
          ret[d][element] = data[d][element];
        });
      });
      return ret;
    });
  }

  const navgate = useNavigate()
  return (
    <div className="side-bar-arrangement">
      <ShadTooltip content="简化配置" side="bottom">
        <button className="extra-side-bar-buttons w-[80px] absolute right-[173px] top-4 bg-gray-0 z-10 rounded-l-full rounded-r-none" onClick={() => setOpen(true)}>
          <Combine strokeWidth={1.5} className="side-bar-button-size mr-2 pr-[2px]" color="#34d399"></Combine>简化
        </button>
      </ShadTooltip>
      <ShadTooltip content="通知" side="bottom">
        <button
          className="extra-side-bar-buttons w-[80px] absolute right-[94px] top-4 bg-gray-0 z-10 rounded-none"
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            setNotificationCenter(false);
            const { top, left } = (
              event.target as Element
            ).getBoundingClientRect();
            openPopUp(
              <>
                <div className="absolute z-10" style={{ top: top + 40, left: left - AlertWidth }} ><AlertDropdown /></div>
                <div className="header-notifications-box"></div>
              </>
            );
          }}
        >
          {notificationCenter && <div className="header-notifications"></div>}
          <Bell className="side-bar-button-size" aria-hidden="true" />通知
        </button>
      </ShadTooltip>
      <ShadTooltip content="返回" side="bottom">
        <button className="extra-side-bar-buttons w-[80px] absolute right-4 top-4 bg-gray-0 z-10 rounded-r-full rounded-l-none" onClick={() => navgate('/skill/' + flow.id, { replace: true })} >
          <LogOut strokeWidth={1.5} className="side-bar-button-size mr-2 pr-[2px]" ></LogOut>退出
        </button>
      </ShadTooltip>
      <div className="side-bar-buttons-arrangement">
        <ShadTooltip content="导入" side="bottom">
          <button className="extra-side-bar-buttons" onClick={() => { uploadFlow(); }} >
            <FileUp strokeWidth={1.5} className="side-bar-button-size " ></FileUp>
          </button>
        </ShadTooltip>

        <ShadTooltip content="导出" side="bottom">
          <button className={classNames("extra-side-bar-buttons")} onClick={(event) => { openPopUp(<ExportModal />); }} >
            <FileDown strokeWidth={1.5} className="side-bar-button-size" ></FileDown>
          </button>
        </ShadTooltip>
        <ShadTooltip content="代码" side="bottom">
          <button className={classNames("extra-side-bar-buttons")} onClick={(event) => { openPopUp(<ApiModal flow={flows.find((f) => f.id === tabId)} />); }} >
            <TerminalSquare strokeWidth={1.5} className="side-bar-button-size"></TerminalSquare>
          </button>
        </ShadTooltip>

        <ShadTooltip content="保存" side="bottom">
          <button className="extra-side-bar-buttons" onClick={(event) => {
            saveFlow(flow);
            setSuccessData({ title: "保存成功" });
          }}
            disabled={!isPending}
          >
            <Save strokeWidth={1.5} className={"side-bar-button-size" + (isPending ? " " : " extra-side-bar-save-disable")} ></Save>
          </button>
        </ShadTooltip>
      </div>
      {/* <Separator /> */}
      <div className="side-bar-search-div-placement">
        <input type="text" name="search" id="search" placeholder="查找组件" className="input-search rounded-full"
          onChange={(e) => {
            handleSearchInput(e.target.value);
            setSearch(e.target.value);
          }}
        />
        <div className="search-icon">
          {/* ! replace hash color here */}
          <Search size={20} strokeWidth={1.5} className="text-primary" />
        </div>
      </div>

      <div className="side-bar-components-div-arrangement">
        {Object.keys(dataFilter)
          .sort()
          .map((d: keyof APIObjectType, i) =>
            Object.keys(dataFilter[d]).length > 0 ? (
              <TooltipProvider delayDuration={0} skipDelayDuration={200} key={i}>
                <Tooltip>
                  <TooltipTrigger>
                    <DisclosureComponent
                      openDisc={search.length == 0 ? false : true}
                      key={nodeNames[d]}
                      button={{
                        title: nodeNames[d] ?? nodeNames.unknown,
                        Icon: nodeIconsLucide[d] ?? nodeIconsLucide.unknown,
                        color: nodeColors[d] ?? nodeColors.unknown
                      }}
                    > </DisclosureComponent>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-0 rounded-md max-h-[600px] overflow-y-auto no-scrollbar" side="right" collisionPadding={20}>
                    {Object.keys(dataFilter[d])
                      .sort()
                      .map((t: string, k) => (
                        d === 'input_output' && t === 'OutputNode' ? <></> :
                          <div key={data[d][t].display_name}>
                            <div key={k} data-tooltip-id={t}>
                              <div draggable
                                className="side-bar-components-border bg-background mt-1 rounded-full"
                                style={{ borderLeftColor: nodeColors[d] ?? nodeColors.unknown, }}
                                onDragStart={(event) =>
                                  onDragStart(event, { type: t, node: data[d][t], })
                                }
                                onDragEnd={() => {
                                  document.body.removeChild(
                                    document.getElementsByClassName(
                                      "cursor-grabbing"
                                    )[0]
                                  );
                                }}
                              >
                                <div className="side-bar-components-div-form border-solid rounded-full">
                                  <span className="side-bar-components-text"> {data[d][t].display_name} </span>
                                  <Menu className="side-bar-components-icon " />
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div key={i}></div>
            )
          )}
      </div>
      {/* 高级配置l2配置 */}
      <L2ParamsModal data={flow} open={open} setOpen={setOpen} onSave={() => {
        saveFlow(flow);
        setSuccessData({ title: "保存成功" });
      }}></L2ParamsModal>
    </div >
  );
}
