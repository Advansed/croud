import { useEffect, useState } from "react";
import { getData1C, Store } from "../pages/Store";
import { IonButton, IonCardContent, IonCol, IonIcon
    , IonInput, IonLoading, IonRow, IonText } from "@ionic/react";
import { arrowBackOutline, cameraOutline, chevronForwardOutline, leafOutline } from "ionicons/icons";
import './Profile.css'
import { useHistory } from "react-router";
import { FioSuggestions } from 'react-dadata';
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

  
export function   Profile():JSX.Element {
    const [load , setLoading]   = useState(false)
    const [login, setLogin]     = useState<any>(Store.getState().login);
    const [upd,   setUpd]       = useState(0)
    let hist = useHistory()

    Store.subscribe({num: 51, type: "login", func: ()=>{
      setLogin(Store.getState().login)
    }})

    useEffect(()=>{
      setLogin(Store.getState().login)
      console.log(Store.getState().login)
    }, [])
  
    async function saveProfile(){
      setLoading(true)
  
      let login = Store.getState().login;
      getData1C("Регистрация", login)
  
      setLoading(false)
  
    }
  
    async function getFoto(){
      const imageUrl = await takePicture();
      login.Картинка = imageUrl
      setLogin(login)
      Store.dispatch({type: "login", Картинка: imageUrl})
  
    }

    function SetFIO():JSX.Element {
      const [edit, setEdit] =useState( false )

      useEffect(()=>{
        if(login.person.Имя === "" && login.person.surname === "")
          setEdit( true )    
        else setEdit( false )
      },[])

      let elem = <>
        <div>
            <div  className = { edit ? "" : "hidden" } >
              <div> Введите ФИО </div>
              <div>
                <FioSuggestions 
                    token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
                    hintText = "ФИО, Наименование"
                    onChange={(e)=>{

                      login.person.ПолноеИмя = e?.value
                      login.person.Имя      = e?.data.name
                      login.person.Фамилия  = e?.data.surname
                      login.person.Отчество = e?.data.patronymic
                        
                      console.log(login)
                      setUpd(upd + 1)
                    }} 
                />
              </div>
            </div>
            <div className="p-div-1"
              onClick={()=>{
                setEdit( !edit )
              }}
            >
              <div className="flex fl-space">
                <div>Фамилия:</div>
                <div> { login.person.Фамилия } </div>
              </div>
              <div className="flex fl-space mt-1">
                <div>Имя:</div>
                <div> { login.person.Имя } </div>
              </div>
              <div className="flex fl-space mt-1">
                <div>Отчество:</div>
                <div> { login.person.Отчество } </div>
              </div>
            </div>
        </div>
      </>
      return elem
    }
  
    function SetEmail():JSX.Element {
      const [edit, setEdit] =useState( false )

      let elem = <>
        <div className="mt-1">
            <div  className = { edit ? "" : "hidden" } >
              <div>
                <IonInput
                    type = "text"
                    placeholder = "email"

                    onKeyPress = {(e)=>{
                      if(e.key === "Enter") setEdit(false)
                    }}

                    onIonChange = {(e)=>{
                      login.email = e.detail.value;
                    }}
                />
              </div>
            </div>
            <div className="p-div-1"
              onClick={()=>{
                setEdit( !edit )
              }}
            >
              <div className="flex fl-space">
                <div>емайл:</div>
                <div> { login.email } </div>
              </div>
            </div>
        </div>
      </>
      return elem
    }
  
    function SetDocs():JSX.Element {
      const [edit,  setEdit]    = useState(false)
      const [docs,  setDocs]    = useState<any>(Store.getState().passport)
      const [upd,   setUpd]     = useState( 0 )

      useEffect(()=>{
        setDocs(Store.getState().passport)
        console.log(Store.getState().passport)
      },[])

      async function getFoto2(){
        const imageUrl = await takePicture();
        let login = Store.getState().login;
        docs.scans = [...docs.scans, imageUrl ]
        setUpd(upd + 1)
      }

      function GetScans():JSX.Element {
        let elem = <>
              <div className="p-item">
                    <IonIcon icon = { cameraOutline } class= "w-3 h-3" color="primary"/>
                    <div className="ml-1 w-100">
                        Добавить документ
                    </div>
                    <div>
                        <IonButton
                            fill ="outline"
                            onClick = {(e)=>{
                               getFoto2();     
                               e.stopPropagation()
                            }}
                        >
                            ...
                        </IonButton>
                    </div>
                </div>        
        </>

        return elem
      }
  
      function Lenta():JSX.Element {
        let elem = <>
          { docs.scans.map(e=>{
            return <>
              <img src = { e } className="w-3 h-3 ml-1 mt-1"/>
            </>
          })}
        </>
        return elem
      }
      let elem = <>
        <div className={ edit ? "hidden" : "p-div-1 mt-1" }
          onClick = { ()=> { setEdit( !edit ) }}
        >
          <div>
            { "Серия: " + docs.Серия + " Номер:" + docs.Номер }
          </div>
          <div>
            { "Когда выдан: " + docs.КогдаВыдан }
          </div>
          <div>
            { "Кем выдан: " + docs.КемВыдан }
          </div>
          <GetScans />
          <Lenta />
        </div>
        <div className={ edit ? "p-div-1 mt-1" : "hidden" }
          onKeyPress = {(e)=>{
            if(e.key === "Enter") setEdit( !edit )
          }}
        >
          <div className="flex fl-space">
            <div>Серия:</div>
            <IonInput type="number" 
                onIonChange = {(e)=>{
                  docs.Серия = e.detail.value
                  setUpd(upd + 1)
                }}
            />
          </div>
          <div className="flex fl-space">
            <div>Номер:</div>
            <IonInput type="number" 
                onIonChange = {(e)=>{
                  docs.Номер = e.detail.value
                  setUpd(upd + 1)
                }}
            />
          </div>
          <div className="flex fl-space">
            <div>Когда выдан:</div>
            <IonInput type="date" 

                onIonChange = {(e)=>{
                  docs.КогдаВыдан = e.detail.value
                  setUpd(upd + 1)
                }}
            />
          </div>
          <div className="flex fl-space">
            <div>Кем выдан:</div>
            <ReactDadataBox 
              token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
              type ="fms_unit" 
              placeholder = " Код подразделения "
              onChange={(e)=>{
                docs.КемВыдан = e.value
                setEdit(!edit)
              }}
            />
          </div>
        </div>
  
      </>
      return elem
    }

    let elem = <>
      
        <IonRow>
          <IonCol size="3">
            <IonIcon icon = { arrowBackOutline } 
                class= "back ml-1 mt-1 pr-btn2"
                onClick = {()=>{
                  hist.goBack()
                }}
              /> 
          </IonCol>
          <IonCol size="7">
            <div className="pr-header">
                <IonText><h3><b>Профиль</b></h3></IonText>
                </div>
          </IonCol>
         </IonRow>        
        <IonLoading isOpen = { load } message = "Подождите" />
          <div className="pr-container">
            <div className="ml-1 mr-2">
              <SetFIO />
              <SetEmail />
              <SetDocs />
            </div>
            <div className="flex fl-space ml-1 mr-1 mt-1">
              <IonButton
                  color= "warning"
                  fill ="outline"
                  onClick = {()=>{
                    hist.goBack()
                  }}
              > Вернуться </IonButton>    
              <IonButton
                  color= "success"
                  fill ="outline"
                  onClick = {()=>{
                    hist.goBack()
                  }}
              > Сохранить </IonButton>    
            </div>
          </div>
       
    </>
  
    return elem;
}
  
export function   Options():JSX.Element {
  // const [load,    setLoad] = useState(false)
  const [alert,   setAlert] = useState(false)

  function          Person():JSX.Element{
    let login = Store.getState().login
     
    let hist = useHistory();
    let elem = <>
      <div className="op-profile"
        onClick = {()=>{
          hist.push("Профиль")
        }}
      >
        <div className="flex fl-space">
          <img src= { login.image === "" ? "assets/person.jpg" : ""} className="p-photo"/>
          <div>
            <div className="mb-1"> { login.code }</div>
            <div> { login.name }</div>
          </div>
              <IonIcon class="w-3 h-3" icon= { chevronForwardOutline }  slot="icon-only"
                  color= "primary"
              />
        </div>    
      </div>
      <div className="op-item">
          Опции
      </div>
    </>;
    return elem
}
  
  let elem = <>
      <Person />
  </>

  return elem;
}
