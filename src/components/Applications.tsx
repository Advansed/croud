import { IonIcon } from "@ionic/react"
import { barcodeOutline, cashOutline, listOutline } from "ionicons/icons"
import { useState } from "react"
import { Store } from "../pages/Store"


export function Applications():JSX.Element {
    const [ apps, setApps]   = useState(Store.getState().Apps)
    const [ param, setParam ] = useState<any>()
    
    function AppCard(props):JSX.Element {
        const [ info ] = useState( props.info.info )
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

        for(let i = 1;i < apps.length;i++){
            elem = <>
                { elem }
                <AppCard info={ {
                    info: apps[i].project,
                    onClick: ()=>{
                        setParam( apps[i] )
                    }
                } }/>
            </>
        }

        return elem
    }
    let elem = <>

    </>

    return elem
}