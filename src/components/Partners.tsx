import { IonButton, IonCard, IonIcon, IonInput } from '@ionic/react'
import { addCircleOutline, barcodeOutline, cameraOutline, flagOutline, homeOutline, personCircleOutline, save } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { getData1C, Store } from '../pages/Store'
import './Partners.css'
import { AddressSuggestions, PartySuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
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
    const [info, setInfo] = useState( Store.getState().partners )
    const [page, setPage] = useState( 0 )
    const [param, setParam] = useState<any>()

    useEffect(()=>{
        setInfo( Store.getState().partners )
        console.log( Store.getState().partners )
    }, [])

    function Footer():JSX.Element {
        let elem = <>
            <div className="p-footer h-3 flex">
                <div className="w-3">
                    <IonButton
                        fill = "outline"
                        onClick = {()=>{
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

    function AddPartner():JSX.Element {
        const [org, setOrg] = useState<any>({
              name:             ""
            , inn:              ""
            , kpp:              ""
            , address:          ""
            , ogrn:             ""
            , management:       ""
        })

        let elem = <>
            <div className="p-item">
                <img src="assets/org.png" className="h-3 w-3"/>
                    <PartySuggestions 
                        token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
                        onChange={(e)=>{
                            let org: any = {
                                  name:         e?.data.name.full_with_opf
                                , inn:          e?.data.inn
                                , kpp:          e?.data.kpp
                                , address:      e?.data.address.value
                                , ogrn:         e?.data.ogrn
                                , management:   e?.data.management?.name
                                , image:        "" 
                            }
                            setOrg(org)
                        }} />
            </div>
            <div className={ org.inn === "" ? "hidden" : ""}>
                <div className="p-item">
                    <div className="ml-1">
                        { org.name }
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { barcodeOutline } class= "w-2 h-2"/>
                    <div className="ml-1">
                        { "ИНН: " + org.inn + " КПП:" + org.kpp}
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { homeOutline } class= "w-2 h-2"/>
                    <div className="ml-1">
                        { org.address }
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { personCircleOutline } class= "w-2 h-2"/>
                    <div className="ml-1">
                        { org.management }
                    </div>
                </div>
                <div className="flex fl-space mr-1 ml-1" >
                    <IonButton
                        fill="outline"
                        color = "warning"
                        onClick ={()=>{
                            setPage( 0 )
                        }}
                    >
                        Отмена
                    </IonButton>
                    <IonButton
                        fill="outline"
                        color = "success"
                        onClick ={()=>{
                            Store.dispatch({type: "partners", partners: [...info, org]})
                            setInfo([...info, org])
                            setPage( 0 )
                        }}
                    >
                        Добавить
                    </IonButton>
                </div>
            </div>
        </>
    
        return elem
    }
    
    function OpenPartner(props):JSX.Element {
        const [org, setOrg] = useState<any>({
            name:               ""
          , inn:                ""
          , kpp:                ""
          , address:            ""
          , ogrn:               ""
          , management:         ""
        })     
        const [upd, setUpd] = useState(0)
        const [info, setInfo] = useState<any>([])


        useEffect(()=>{
            setOrg( props.info )
            let jarr: any = []
            let scans = Store.getState().scans
            scans.forEach(elem => {
                if(elem.inn === props.info.inn) 
                jarr = [...jarr, elem];
            });
            setInfo( jarr ) 
        },[])

        async function getFoto1(){
            const imageUrl = await takePicture();
            org.image = imageUrl;
            setOrg(org);setUpd(upd + 1)   
          }

        async function getFoto2(){
            const imageUrl = await takePicture();
            Store.dispatch({type: "scans", scans: [...info, {inn: org.inn, image: imageUrl}]})
            setInfo([...info, {inn: org.inn, kpp: org.kpp, image: imageUrl}])
        }

        async function save(){
            let res = getData1C("СохранитьОрганизацию",{
                Телефон:                Store.getState().login.code,
                ИНН:                    org.inn,
                КПП:                    org.kpp,
                Наименование:           org.name,
                ПолноеНаименование:     org.name,
                Адрес:                  org.address,
                Руководитель:           org.management,
                ОГРН:                   org.ogrn,
                Картинка:               org.image, 
            })
            res = getData1C("СохранитьДокументы",{
                Массив:         info,
            })
        }

      
        let elem = <>
            <div>
                <div className="p-item">
                    <img src = { org.image === "" ? "assets/org.png" : org.image} className="w-4 h-4" />
                    <div className="ml-1">
                        { org.name }
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { barcodeOutline } class= "w-2 h-2" color="primary"/>
                    <div className="ml-1">
                        { "ИНН: " + org.inn + " КПП:" + org.kpp}
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { homeOutline } class= "w-2 h-2" color="primary"/>
                    <div className="ml-1">
                        { org.address }
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { personCircleOutline } class= "w-2 h-2" color="primary"/>
                    <div className="ml-1">
                        { org.management }
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { cameraOutline } class= "w-3 h-3" color="primary"/>
                    <div className="ml-1 w-100">
                        Добавить логотип
                    </div>
                    <div>
                        <IonButton
                            fill ="outline"
                            onClick = {()=>{
                                getFoto1();
                            }}
                        >
                            ...
                        </IonButton>
                    </div>
                </div>
                <div className="p-item">
                    <IonIcon icon = { cameraOutline } class= "w-3 h-3" color="primary"/>
                    <div className="ml-1 w-100">
                        Добавить документ
                    </div>
                    <div>
                        <IonButton
                            fill ="outline"
                            onClick = {()=>{
                               getFoto2();     
                            }}
                        >
                            ...
                        </IonButton>
                    </div>
                </div>
                <div className="flex fl-wrap">
                    { info.map((e)=>{
                        return <img src = { e.image } className="w-4 h-4 ml-1 mt-1"/>
                    })}
                </div>
            </div>
            <div className="p-footer flex fl-space">
                <IonButton
                    fill = "outline"
                    expand = "block"
                    color = "warning"
                    onClick ={() => {
                        setPage(0)        
                    }}
                >
                    Вернуться
                </IonButton>        
                <IonButton
                    fill = "outline"
                    expand = "block"
                    color = "succes"
                    onClick ={() => {
                        save()
                        setPage(0)        
                    }}
                >
                    Сохранить
                </IonButton>        
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
                    <img src = {info[i].image === "" ? "assets/org.png" : info[i].image }
                        className = "w-3 h-3"
                    />
                    <div className="ml-1">
                        <div>
                            { info[i].inn + ( info[i].kpp !== "" ?  ("/" + info[i].kpp) : "")}
                        </div>
                        <div>
                            { info[i].name }
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
        case 1:     return <AddPartner />
        case 2:     return <OpenPartner  info = { param } />
        default :   return elem;
    }
    return elem
}


