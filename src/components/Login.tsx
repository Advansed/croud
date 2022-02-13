import { IonButton, IonInput, IonLoading } from "@ionic/react";
import { useEffect, useState } from "react"
import { getData1C, Store } from "../pages/Store";
import MaskedInput from "../mask/reactTextMask";
import "./Login.css"


export function Login(props):JSX.Element {
    const [ page, setPage] = useState( 0 ) 
    const [ info, setInfo] = useState<any>( Store.getState().login )
    const [ load, setLoad] = useState(false)

    useEffect(()=>{

        let sav = localStorage.getItem("croud.login");
        if( sav !== null) {
            setInfo( JSON.parse(sav) )
            setPage( 1 )
        } else {
            setPage( 2 )
        }
    }, [])

    async function loadSMS( ){
        console.log(info.code)
        setLoad(true)
        let res = await getData1C("ПолучитьСМС",{
            Телефон: info.code
        })
        if(res.Код === 100) {
            console.log(res)
            info.SMS = res.SMS
            setInfo(info)
            setPage( 3 )
        } 
        setLoad(false)
    }

    function GetPhone():JSX.Element {

         useEffect(()=>{
         },[])
     
        let elem = <>
            <div className="l-content">
                <div className="h-20">

                </div>
                <div className="l-div-1">
                    <div>
                        Введите телефон
                    </div>
                    <div className="l-input mt-1 fs-2">
                        <div className="ml-1 flex fl-center" >
                            <div>+7</div>
                        </div>
                        <MaskedInput
                            mask={[ ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                            className="m-input "
                            autoComplete="off"
                            placeholder="(___) ___-__-__"
                            id='1'
                            type='text'
                            onChange={(e: any) => {
                                let st = e.target.value;
                                info.code = "+7" + st;
                            }}
                        />                
                    </div>
                    <IonButton
                        className = "mt-2"
                        expand="block"
                        fill ="outline"
                        color = "primary"
                        onClick={() =>{
                            loadSMS()
                        }}
                    >
                        Продолжить     
                    </IonButton>
                </div>
            </div>
        </>
        return elem
    }

    function MyInput(props):JSX.Element {
        const [tires, setTires] = useState("----");
        const [value, setValue] = useState( "" )
        let elem = <>
            <div className="borders mt-1 " style={{ width: "13em", height: "3em"}}>
                <div className="w-100 h-100 flex  fl-right">
                    <span className="lg-SMS">{ tires }</span>
                </div>
                <div className="lg-input lg-SMS">
                    <IonInput 
                        value= { value }
                        onIonChange= {(e)=>{
                            let val = e.detail.value as string;
                            setValue( val )
                            switch (val?.length) {
                                case 0:     setTires("----");break;       
                                case 1:     setTires("---");break;       
                                case 2:     setTires("--");break;       
                                case 3:     setTires("-");break;       
                                case 4:     setTires("");break;       
                                default:    setTires("----");break;       
                            }
                            if(val?.length === 4) {
                                props.onText(val)
                                
                                setTires("----") ;
                                setValue(""); 
                                    
                            }
                }}
                    />
                </div>
            </div>
        </>
        return elem
    }

    function GetSMS():JSX.Element {

        let elem = <>
            <div className="l-content">
                <div className = "h-20"></div>
                <div className="l-div-1">
                    <b>Введите код из SMS</b>
                    <div className="flex fl-center">
                        <MyInput onText ={(val)=>{
                            
                            let SMS = info.SMS
    
                            if(SMS === val) {
                                setPage( 4 )
                            }

                        }} />
                    </div>
                    <div className="mt-1 a-right">
                        <span className="a-link">Отправить СМС повторно</span>
                    </div>
                    
                </div>
            </div>
        
        </>
        return elem
    }

    function PinCode():JSX.Element {
        
        async function load(){

            let res = await getData1C("Авторизация", info )
            if(res.Код === 100) {
                Store.dispatch( res.Данные.login )
                Store.dispatch( res.Данные.person )
                Store.dispatch( res.Данные.passport )
                Store.dispatch({type: "auth", auth: true})   
            } 
        }

        let elem = <>
            <div className="l-content">
            <div className = "h-20"></div>
                <div className="l-div-1">
                    <b>Введите ПинКод</b>
                    <div className="flex fl-center">
                        <MyInput onText ={(val)=>{
                            
                            info.pincode = val;
                            load()            

                        }} />
                    </div>
                    <div className="ml-4 mt-1 a-link"
                        onClick={()=>{
                            loadSMS()
                        }}
                    >
                        Забыли пинкод ?
                    </div>                    
                </div>
            </div>
        
        </>
        return elem
    }

    function SetPinCode():JSX.Element {
        const [pin1, setPin1] = useState( "" )

        async function load(){
            let res = await getData1C("Регистрация", {
                Логин:      info 
            } )
            if(res.Код === 100) {
                localStorage.setItem("croud.login", JSON.stringify(res.Данные))
                setPage( 1 )
            }
        }

       let elem = <>
            <div className="l-content">
                <div className = "h-20"></div>
                <div className="l-div-1">
                    <b> { pin1 === "" ? "Придумайте ПинКод" : "Повторите ПинКод"} </b>
                    <div className="flex fl-center">
                        <MyInput onText ={(val)=>{
                            if(pin1 === "" ) {
                                setPin1( val )
                            } else
                            if( pin1 === val) {
                                info.pincode = pin1;
                                load()
                            }                 
                        }}/>
                    </div>
                </div>
            </div>
        </>
        return elem
    }
    
    let elem = <></>
    switch( page ) {
        case 0 : elem = <></>; break;
        case 1 : elem = <PinCode />; break;
        case 2 : elem = <GetPhone />; break;
        case 3 : elem = <GetSMS />; break;
        case 4 : elem = <SetPinCode />; break;
        default : elem = <></>;
    }
    return <>
        <IonLoading message= "Подождите..." isOpen= { load }/>
        { elem }
    </>
}


