import { IonIcon } from "@ionic/react"
import { barcodeOutline, cashOutline, listOutline } from "ionicons/icons"
import { useEffect, useState } from "react"
import { convertMaskToPlaceholder } from "../mask/src/utilities"
import { Store } from "../pages/Store"


export function Applications():JSX.Element {
    const [ apps, setApps ]   = useState(Store.getState().apps)
    const [ param, setParam ] = useState<any>()
    const [ page,   setPage] = useState( 0 )
    
    Store.subscribe({num: 11, type: "apps", func: ()=>{
        setApps( Store.getState().apps );
    }})

    useEffect(()=>{
        setApps( Store.getState().apps );
    },[])

    function AppCard(props):JSX.Element {
        const [ info ] = useState( props.info.info )

        console.log(info)
        let elem = <>
                <div className="borders mt-1 ml-1 mr-1 fs-08"
                onClick={()=>{
                    props.info.setParam()
                }}
            >
                <div className="flex">
                    <img src={ info.Организация.Картинка === "" ? "assets/org.png"
                        : info.Организация.Картинка    
                    } className="w-3 h-3"/>
                    <div className="ml-2">
                        <div className="mt-1"> { info.Организация.Наименование } </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { barcodeOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div> { "№ " + info.Номер + " от " + info.Дата} </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { listOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-1"> <b>{ info.Наименование }</b> </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { cashOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-2 flex fl-center w-100"> 
                        <b>
                            { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( info.Сумма ) }
                        </b> 
                    </div>
                </div>
            </div>    
        </>
        return elem
    }

    function AppsList():JSX.Element {
        let elem = <></>
        console.log("list")
        for(let i = 0;i < apps.length;i++){
            elem = <>
                { elem }
                <AppCard info={ {
                    info: apps[i].Проект,
                    setParam: ()=>{
                        setParam( apps[i] )
                    }
                } }/>
            </>
        }

        return elem
    }

    switch(page){
        case 0 : return <AppsList />
        default: return <></>
    }
    
}