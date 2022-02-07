import { useEffect, useState } from "react";
import { getData1C, Store } from "../pages/Store";
import { IonButton, IonCol, IonIcon
    , IonInput, IonLoading, IonRow, IonText } from "@ionic/react";
import { arrowBackOutline, cameraOutline, chevronForwardOutline, chevronBackOutline } from "ionicons/icons";
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

    async function saveProfile(){
      setLoading(true)
  
      getData1C("Регистрация", {
          Логин:    Store.getState().login,
          ФизЛицо:  Store.getState().person,
          Паспорт:  Store.getState().passport,
      })
  
      setLoading(false)
  
    }
  

    function SetFIO():JSX.Element {
      const [ person ] = useState(Store.getState().person)
      const [edit, setEdit] = useState( false )

      let elem = <>
        <div>
            <div  className = { edit ? "" : "hidden" } >
              <div>
                <ReactDadataBox 
                  token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
                  type ="fio" 
                  placeholder = " Введите ФИО "
                  onChange={(e)=>{

                    person.ПолноеИмя = e?.value
                    person.Имя      = e?.data.name
                    person.Фамилия  = e?.data.surname
                    person.Отчество = e?.data.patronymic
                      
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
                <div> { person.Фамилия } </div>
              </div>
              <div className="flex fl-space mt-1">
                <div>Имя:</div>
                <div> { person.Имя } </div>
              </div>
              <div className="flex fl-space mt-1">
                <div>Отчество:</div>
                <div> { person.Отчество } </div>
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
                <ReactDadataBox 
                    token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
                    type ="email" 
                    placeholder = " Введите email "
                    onChange={(e)=>{
                      login.email = e.value   
                      setUpd(upd + 1)
                      console.log(Store.getState().login)
                  }}
                />
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
              <img src = { e } alt="" className="w-3 h-3 ml-1 mt-1"/>
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
                value = { docs.Серия }
                onIonChange = {(e)=>{
                  docs.Серия = e.detail.value
                  setUpd(upd + 1)
                }}
            />
          </div>
          <div className="flex fl-space">
            <div>Номер:</div>
            <IonInput type="number" 
                value = { docs.Номер }
                onIonChange = {(e)=>{
                  docs.Номер = e.detail.value
                  setUpd(upd + 1)
                }}
            />
          </div>
          <div className="flex fl-space">
            <div>Когда выдан:</div>
            <IonInput type="date" 
                value = { docs.КогдаВыдан }
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
      
        <IonLoading isOpen = { load } message = "Подождите" />
          <div className="pr-container mt-2">
            <div className="ml-1 mr-1">
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
                    saveProfile()
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
          <img src= { login.image === "" ? "assets/person.jpg" : ""} alt="" className="p-photo"/>
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
      <div className="op-item flex fl-right">
          <IonButton
            fill = "outline"
            color = "danger"
            onClick = {()=>{
              localStorage.removeItem("croud.login")
              Store.dispatch({type: "auth", auth: false})
            }}
          >
            Удалить регистрацию
          </IonButton>
      </div>
    </>;
    return elem
}
  
  let elem = <>
      <Person />
  </>

  return elem;
}
