import { IonButton, IonInput } from "@ionic/react";
import { useEffect, useState } from "react"
import { getData, getData1C, Store } from "../pages/Store";
import MaskedInput from "../mask/reactTextMask";
import "./Login.css"


export function Login(props):JSX.Element {
    const [ page, setPage] = useState( 0 ) 
    const [ info, setInfo] = useState<any>( Store.getState().login )

    useEffect(()=>{

        info.type = "login"

        let sav = localStorage.getItem("croud.login");
        if( sav !== null) {
            setInfo( JSON.parse(sav) )
            setPage( 1 )
        } else {
            setPage( 2 )
        }
    }, [])

    // async function LogIn(){
    //     let res = await getData1C("Логин", info)
    //     if(res.Код === 100) {
    //         Store.dispatch({ type: "auth", auth: true})
    //         Store.dispatch(res.Данные);
    //         console.log(res)
    //         localStorage.setItem("asAdmin.login", info.Логин)
    //     } else {

    //     }
    // }


    function GetPhone():JSX.Element {

         useEffect(()=>{
         },[])
    
        async function load( ){
            let res = await getData1C("ПолучитьСМС",{
                Телефон: info.code
            })
            console.log(res)
            if(res.Код === 100) {
                info.SMS = res.SMS
                setInfo(info)
                setPage( 3 )
            } 
        }
    
        let elem = <>
            <div className="l-content">
                <div className="l-div">
                    <b>Введите телефон</b>
                </div>
                <div className="l-input">
                    <div className="ml-1">+7</div>
                    <MaskedInput
                        mask={[ ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
                        className="m-input"
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
                <div className="ml-1 mr-1 mt-1">
                    <IonButton
                        expand="block"
                        color = "warning"

                        onClick={() =>{
                            load()
                        }}
                    >
                       Продолжить     
                    </IonButton>
                </div>
            </div>
        </>
        return elem
    }

    function GetSMS():JSX.Element {
        const [tires, setTires] = useState("----");
        const [value, setValue] = useState( "" )

        let elem = <>
            <div className="l-content">
                <div className="l-div">
                    <b>Введите код из SMS</b>
                </div>

                    <div className="lg-input">
                        <div className="lg-div-1">
                            <span></span>
                            { tires }
                        </div>
                        <IonInput
                            className = "lg-sms-input"
                            type = "text"
                            inputMode = "numeric"
                            maxlength = { 4 }
                            value = { value }
                            onIonChange = {(e)=>{
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
                                    let SMS = info.SMS

                                    if(SMS === val) {
                                        setPage( 4 )
                                    } else {
                                        setTires("----") ;
                                        setValue(""); 
                                    }
                                        
                                }
                                
                            }}
                        />
                    </div>

                {/* <div className="ml-1 mr-1 mt-1">
                    <IonButton
                        expand="block"
                        color = "warning"

                        onClick={() =>{
                            //load()
                        }}
                    >
                       Продолжить     
                    </IonButton>
                </div> */}
            </div>
        
        </>
        return elem
    }

    function PinCode():JSX.Element {
        const [tires, setTires] = useState("----");
        const [value, setValue] = useState( "" )

        async function load(){

            let res = await getData1C("Авторизация", info )
            if(res.Код === 100) {
                Store.dispatch( res.Данные.login )
                Store.dispatch( res.Данные.person )
                Store.dispatch( res.Данные.passport )
                Store.dispatch({type: "auth", auth: true})   
                console.log( res.Данные.person ) 
            } else {
                setValue("")
                setTires("----")
            }
        }

        let elem = <>
            <div className="l-content">
                <div className="l-div">
                    <b>Введите ПинКод</b>
                </div>

                    <div className="lg-input">
                        <div className="lg-div-1">
                            <span></span>
                            { tires }
                        </div>
                        <IonInput
                            className = "lg-sms-input"
                            type = "password"
                            inputMode = "numeric"
                            maxlength = { 4 }
                            value = { value }
                            onIonChange = {(e)=>{
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
                                    info.pincode = val;
                                    load()            
                                }
                                
                            }}
                        />
                    </div>

                {/* <div className="ml-1 mr-1 mt-1">
                    <IonButton
                        expand="block"
                        color = "warning"

                        onClick={() =>{
                            //load()
                        }}
                    >
                       Продолжить     
                    </IonButton>
                </div> */}
            </div>
        
        </>
        return elem
    }

    function SetPinCode():JSX.Element {
        const [tires, setTires] = useState("----");
        const [value, setValue] = useState( "" )
        const [pin1, setPin1] = useState( "" )
        const [pin2, setPin2] = useState( "" )

        async function load(){
            console.log(info)
            let res = await getData1C("Регистрация", {
                Логин:      info 
            } )
            if(res.Код === 100) {
                Store.dispatch( res.Данные )
                Store.dispatch({type: "auth", auth: true})
                localStorage.setItem("croud.login", JSON.stringify(res.Данные))
            }
        }

       let elem = <>
            <div className="l-content">
                <div className="l-div">
                    <b> { pin1 === "" ? "Придумайте ПинКод" : "Повторите ПинКод"} </b>
                </div>

                <div className="lg-input">
                    <div className="lg-div-1">
                            <span></span>
                            { tires }
                    </div>
                    <IonInput
                        className = "lg-sms-input"
                            type = "password"
                            inputMode = "numeric"
                            maxlength = { 4 }
                            value = { value }
                            onIonChange = {(e)=>{
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
                                    if(pin1 === "" ) {
                                        setPin1( val )
                                        setValue("")
                                        setTires("----")
                                    } else
                                    if( pin1 === val) {
                                        info.pincode = pin1;
                                        load()
                                    }
                                        
                                }
                                
                        }}
                    />
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
    return elem
}

