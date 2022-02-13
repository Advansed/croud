import { IonButton, IonCard, IonIcon, IonInput } from '@ionic/react'
import { addCircleOutline, barcodeOutline, cameraOutline, homeOutline, personCircleOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { getData1C, Store } from '../pages/Store'
import './Partners.css'
import 'react-dadata/dist/react-dadata.css';
import ReactDadataBox from 'react-dadata-box';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

defineCustomElements(window)

async function    takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    
    return imageUrl
    // Can be set to the src of an image no
  
  }

export function Partners():JSX.Element {
    const [info,    setInfo] = useState( Store.getState().partners )
    const [page,    setPage] = useState( 0 )
    const [param,   setParam] = useState<any>()

    useEffect(()=>{
        setInfo( Store.getState().partners )
    }, [])

    function Footer():JSX.Element {
        let elem = <>
            <div className="p-footer h-3 flex">
                <div className="w-3">
                    <IonButton
                        fill = "outline"
                        onClick = {()=>{
                            setParam({
                                Код:                          ""  
                              , Наименование:                 ""
                              , ИНН:                          ""
                              , КПП:                          ""
                              , Адрес:                        ""
                              , ОГРН:                         ""
                              , Руководитель:                 ""
                              , Банк:             {
                                  БИК:                        "",
                                  КоррСчет:                   "",
                                  Банк:                       "",
                                  НомерСчета:                 "",    
                              }
                              , Сканы:                        []
                          })
                            setPage( 1 )
                        }}
                    >
                        <IonIcon //class="w-2 h-2"
                            slot = "icon-only"
                            icon = { addCircleOutline }
                            // src = { "assets/defaultOrg.png" }
                        />
                        Добавить организацию
                    </IonButton>
                </div>
            </div>
        </>
    
        return elem
    }

    function Partner():JSX.Element {
        const [org1 ] = useState( param )
        const [upd,     setUpd] = useState(0)

        async function getFoto1(){
            const imageUrl = await takePicture();
            org1.Картинка = imageUrl;
            setUpd(upd + 1)   
        }

        async function getFoto2(){
            const imageUrl = await takePicture();
            org1.Сканы = [...org1.Сканы, imageUrl ]
            setUpd(upd + 1)
        }

        async function save(){
            console.log(org1)
            getData1C("СохранитьОрганизацию", {
                Телефон:        Store.getState().login.code,    
                Организация:    org1,
            })

        }

      
        function SetOrg():JSX.Element {
            const [edit,    setEdit] = useState( false )
            const [org,     setOrg] = useState( org1 )
            let elem = <>
                <div className={ edit ? "p-item mt-2" : "hidden"}
                    onDoubleClick = {()=>{
                        setEdit(!edit);
                    }}
                >
                    <div className="ml-1 mr-1 w-100">
                        <ReactDadataBox 
                            token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
                            placeholder = "ИНН, Наименование"
                            type = "party"
                            onChange={(e)=>{
                                
                                org.Наименование =     e?.data.name.full_with_opf
                                org.ИНН =              e?.data.inn
                                org.КПП =              e?.data.kpp
                                org.Адрес =            e?.data.address.value
                                org.ОГРН =             e?.data.ogrn
                                org.Руководитель =     e?.data.management.name
                                org.Картинка =         "" 
                                setOrg(org)
                                setEdit(!edit)
                            }} 
                        />
                    </div>
                </div>
                <div className={ "p-div-1" }
                    onClick = {()=>{
                        setEdit(!edit);
                    }}
                >
                    <div className="p-item">
                        <div className="ml-1">
                            { org.Наименование }
                        </div>
                    </div>
                    <div className="p-item mt-1">
                        <IonIcon icon = { barcodeOutline } class= "p-icon" color="primary"/>
                        <div className="ml-1">
                            { "ИНН: " + org.ИНН + " КПП:" + org.КПП}
                        </div>
                    </div>
                    <div className="p-item mt-1">
                        <div className="w-2">
                            <IonIcon icon = { homeOutline } class= "p-icon" color="primary"/>
                        </div>
                        <div className="ml-1">
                            { org.Адрес }
                        </div>
                    </div>
                    <div className="p-item mt-1">
                        <div className="w-2">
                            <IonIcon icon = { personCircleOutline } class= "p-icon" color="primary"/>
                        </div>
                        <div className="ml-1">
                            { org.Руководитель }
                        </div>
                    </div>
                </div>
            </>
            return elem
        }

        function SetBank():JSX.Element {
            const [edit,    setEdit] = useState( false )
            const [bank ] = useState( org1.Банк )

            let elem = <>
                <div className={ edit ? "p-item mt-2" : "hidden"}>
                    <div className="w-100 ml-1 mr-1">
                        <ReactDadataBox 
                            token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
                            placeholder = "БИК, Наименование"
                            type = "bank"
                            onChange={(e)=>{
                                bank.БИК = e.data.bic
                                bank.Банк = e.value
                                bank.КоррСчет = e.data.correspondent_account
                                setEdit(!edit)
                            }} />
                    </div>
                </div>
                <div className={ "p-div-1" }
                    onClick = {()=>{
                        setEdit(!edit);
                    }}
                >
                    <div className="p-item">
                        <div className="ml-1">
                            { bank.БИК +", " + bank.Банк }
                        </div>
                    </div>
                    <div className="p-item mt-1">
                        <IonIcon icon = { barcodeOutline } class= "p-icon" color="primary"/>
                        <div className="ml-1">
                            { "КоррСчет: " + bank.КоррСчет}
                        </div>
                    </div>
                    <div className="p-item mt-1">
                        <div className="w-2">
                            <IonIcon icon = { barcodeOutline } class= "p-icon" color="primary"/>
                        </div>
                        <div className="ml-1"> 
                            <IonInput
                                type = "number"
                                value = { bank.НомерСчета }
                                placeholder = "Номер счета"
                                onIonChange = {(e)=>{
                                    bank.НомерСчета = e.detail.value as string
                                    //setUpd(upd + 1)
                                }}
                                onClick = {(e)=>{e.stopPropagation()}}
                            />
                        </div>
                    </div>
                </div>
            </>
            return elem
        }

        function SetScan():JSX.Element {
            let elem  = <>
                <div className={ "p-div-1" }>
                    <div className="p-item">
                        <div className="ml-1 flex fl-space w-100">
                            <IonIcon icon= { cameraOutline } class="w-2 h-2" color="primary"/>
                            <div>Сканируйте документы</div>
                            <IonButton
                                fill ="outline"
                                onClick={()=>{
                                    getFoto2()
                                }}
                            >...</IonButton>
                        </div>
                    </div>
                    <div className="p-item fl-wrap mt-1">
                        { org1?.Сканы.map((e, ind) =>{
                            return <img key = { ind as number } src = { e } alt="" className="w-4 h-4 ml-1 mt-1"/>
                        })}
                    </div>
                </div>
            </>

            return elem
        }

        let elem = <>
            <SetOrg />
            <SetBank />
            <SetScan />
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
                            save();
                            if(org1.Код === "") {
                                Store.dispatch({type: "partners", partners: [...info, org1]})
                                setInfo([...info, org1])
                            }
                            setPage( 0 )
                        }}
                    >
                        Сохранить
                    </IonButton>
                </div>
            </div>
        </>

        return elem
    }
    
    let items = <></>
    for(let i = 0;i < info.length;i++){
        items = <>
            { items }
            <IonCard>
                <div className="p-item-1"
                    onClick = {()=>{
                        setParam(info[i]);
                        setPage( 2 )
                    }}
                >
                    <img src = {info[i].Картинка === "" ? "assets/org.png" : info[i].Картинка }
                        className = "w-3 h-3"
                    />
                    <div className="ml-1">
                        <div>
                            { info[i].ИНН + ( info[i].КПП !== "" ?  ("/" + info[i].КПП) : "")}
                        </div>
                        <div>
                            { info[i].Наименование }
                        </div>
                    </div>
                </div>
            </IonCard>
        </>
    }
    
    let elem = <>
        { items }
        <Footer />
    </>
    switch(page){
        case 0:     return elem; break;
        case 1:     return <Partner />
        case 2:     return <Partner />
        default :   return elem;
    }
    return elem
}


