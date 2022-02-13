import { IonIcon } from "@ionic/react"
import { barcodeOutline, cashOutline, listOutline, addCircleOutline, removeCircleOutline } from "ionicons/icons"
import { useState } from "react"
import { Store } from "../pages/Store"


export function Sentences():JSX.Element {
    const [deals, setDeals] = useState( Store.getState().deals )


    function Deal(props):JSX.Element {
        const [ info ] = useState( props.info )

        let elem = <>
            <div className="borders ml-1 mr-1 mt-1">
                <div className="flex">
                    {/* <img src={ info.Проект.Организация.Картинка === "" ? "assets/org.png"
                        : info.Проект.Организация.Картинка    
                    } className="w-3 h-3"/> */}
                    <IonIcon icon = { info.Раздел === 1 ? addCircleOutline : removeCircleOutline} color = { info.Раздел === 1 ? "success" : "danger"}
                        className = "w-3 h-3"
                    />
                    <div className="ml-1">
                        <div> { "№ " + info.Проект.Номер + " от " + info.Проект.Дата} </div>
                        <div> { info.Проект.Наименование } </div>
                    </div>
                </div>
                <div className="flex fl-space mt-1">
                    <div>Срок</div>
                    <div> 
                        <b>
                            { info.Срок } { "  мес."}
                        </b>
                    </div>
                </div>
                <div className="flex fl-space">
                    <div>Сумма</div>
                    <div> 
                        <b>
                            { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( info.Сумма )}                            
                        </b>
                    </div>
                </div>
                <div className="flex fl-space">
                    <div>Процент</div>
                    <div> 
                        <b>
                            { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( info.Сумма * info.Срок * (info.Процент / 100) ) }                            
                        </b>
                    </div>
                </div>
                <div className="flex fl-space">
                    <div>Статус</div>
                    <div> 
                        <b>
                            { info.Статус }                            
                        </b>
                    </div>
                </div>
                
            </div>
        </>

        return elem
    }

    let elem = <></>

    for(let i=0;i < deals.length;i++){
        elem = <>
            { elem }
            <Deal info = { deals[i] }/>
        </>
    }

    return elem
}