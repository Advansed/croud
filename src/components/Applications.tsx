import { IonButton, IonIcon, IonInput, IonRange, IonTextarea } from "@ionic/react"
import { barcodeOutline, cashOutline, listOutline, optionsOutline } from "ionicons/icons"
import { useEffect, useState } from "react"
import ReactDaDataBox from "react-dadata-box"
import MaskedInput from "../mask/reactTextMask"
import { convertMaskToPlaceholder } from "../mask/src/utilities"
import { getData1C, Store } from "../pages/Store"


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

    async function offer( apps ){
        let res = await getData1C("Предложение",{
            Телефон:    Store.getState().login.code,
            Заявка:     apps
        })
        if(res.Код === 100) {
            
        }
    }

    function AppCard(props):JSX.Element {
        const [ info ] = useState( props.info.info.Проект )
        const [ buts , setButs] = useState( false )

        let elem = <>
            <div className="borders mt-1 ml-1 mr-1 fs-08"
                onClick={()=>{
                    setButs(!buts)
                    //props.info.setParam()
                }}
            >
                <div>
                    <div className={ buts ? "flex fl-space" : "hidden" }>
                        <IonButton 
                            fill    = "outline"
                            color   = "warning"
                            onClick={()=>{
                                props.info.setParam( info )
                                setPage( 1 );
                            }}
                        >
                            Открыть     
                        </IonButton>
                        <IonButton 
                            fill    = "outline"
                            color   = "success"
                            onClick={()=>{
                                props.info.setParam( info )
                                setPage(2);
                            }}
                        >
                            Предложить     
                        </IonButton>
                    </div>    

                </div>
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
                        <IonIcon icon= { listOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-1"> <b>{ info.Наименование }</b> </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { optionsOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-2"> <b>{ "На срок " + props.info.info.Срок + " мес. под " + props.info.info.Процент + " % "}</b> </div>
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
                    info: apps[i],
                    setParam: ()=>{
                        setParam( apps[i] )
                    }
                } }/>
            </>
        }

        return elem
    }
  
    const customFormatter = (value: number) => `${value}руб`;

    function Project1():JSX.Element {
        const [ info ] = useState( param.Проект )

        function SetOrg():JSX.Element {
            const [upd , setUpd] = useState( 0 )    
            let elem = <>
                <div className="borders mt-1 ml-1 mr-1">
                    <div className="flex">
                        <img src={ info.Организация.Картинка === "" ? "assets/org.png"
                            : info.Организация.Картинка    
                        } className="w-4 h-4"/>
                        <div className="ml-1">
                            <div className="fs-08"> { info.Организация.Наименование } </div>
                        </div>
                    </div>
                </div>            
            </>

            return elem
        }

        function SetProject():JSX.Element {
            let elem = <>
                <div className="borders mt-1 ml-1 mr-1 fs-08">
                    <div className="flex fl-space">
                        <div> Номер: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                value= { info.Номер }
                                onIonChange= {(e)=>{
                                info.Номер = e.detail.value     
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Дата: </div>
                        <div>  
                            <MaskedInput
                                mask={[ /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                className="m-input a-right"
                                autoComplete="off"
                                value = { info.Дата }
                                placeholder="__-__-____"
                                id='3'
                                type='text'
                                onChange={(e: any) => {
                                    let st = e.target.value;
                                    info.Дата = st;
                                }}
                            />               
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Наименование: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                value= { info.Наименование }
                                onIonChange= {(e)=>{
                                info.Наименование = e.detail.value     
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Сумма: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                type="number"
                                value= { info.Сумма }
                                onIonChange= {(e)=>{
                                    info.Сумма = e.detail.value
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> URL: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                value= { info.URL }
                                onIonChange= {(e)=>{
                                    info.URL = e.detail.value
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Описание: </div>
                    </div>
                    <div>  
                        <IonTextarea
                            className="t-area"
                            //autoGrow = { true }
                            rows={ 12 }
                            value= { info.Описание }
                            onIonChange= {(e)=>{
                                info.Описание = e.detail.value
                            }}
                        />
                    </div>
                </div>
            </>
            return elem
        }

        function Buttons():JSX.Element {
            let elem  = <>
                <div className="mt-1 p-div-1">
                    <div className="flex fl-space" >
                        <IonButton
                            fill="outline"
                            color = "warning"
                            onClick ={()=>{
                                setPage( 0 )
                            }}
                        >
                            Вернуться
                        </IonButton>
                        <IonButton
                            fill="outline"
                            color = "success"
                            onClick ={()=>{
                               setPage( 2 ) 
                            }}
                        >
                            Предложить
                        </IonButton>
                    </div>
                </div>            
            </>
            return elem
        }

        let elem = <>
            <SetProject />
            <Buttons />
        </>
        return elem
    }

    function Project2():JSX.Element {
        const [ info ] = useState( param.Проект )

        function Buttons():JSX.Element {
            let elem  = <>
                <div className="mt-1 p-div-1">
                    <div className="flex fl-space" >
                        <IonButton
                            fill="outline"
                            color = "warning"
                            onClick ={()=>{
                                setPage( 0 )
                            }}
                        >
                            Вернуться
                        </IonButton>
                        <IonButton
                            fill="outline"
                            color = "success"
                            onClick ={()=>{
                               offer( param ) 
                            }}
                        >
                            Предложить
                        </IonButton>
                    </div>
                </div>            
            </>
            return elem
        }

        function Offer():JSX.Element {
            const [value, setValue] = useState( 10000 )
            let elem = <>
                <div className="borders ml-1 mr-1 mt-1">
                    <div className='flex fl-space'>
                        <div> Сумма </div>    
                        <div className='fs-1'>
                            <b>
                                { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( value ) }                            
                            </b>

                        </div>
                    </div>
                    <div>
                        <div className='w-100'>
                            <IonRange 
                                min={ 10000 } 
                                max={ info.Сумма } 
                                pinFormatter={ customFormatter } 
                                pin={true}
                                step={ Store.getState().options.Шаг }
                                snaps
                                value={ value } 
                                onIonChange={e => setValue(e.detail.value as number)}
                            />
                        </div>
                        <div className="flex fl-space">
                            <div>Процент</div>
                            <div> 
                                <b>
                                    { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( value * param.Срок * (param.Процент / 100) ) }                            
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            return elem
        } 

        let elem = <>
            <div className="borders mt-1 ml-1 mr-1 fs-08">
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
                        <IonIcon icon= { listOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-1"> <b>{ info.Наименование }</b> </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { optionsOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-2"> <b>{ "На срок " + param.Срок + " мес. под " + param.Процент + " % "}</b> </div>
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
            <Offer />
            <Buttons />
        </>
        return elem
    }



    switch(page){
        case 0 : return <AppsList />
        case 1 : return <Project1 />
        case 2 : return <Project2 />
        default: return <></>
    }
    
}