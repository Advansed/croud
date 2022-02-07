import { useEffect, useState } from "react";
import { getData1C, Store } from "../pages/Store";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonButton, IonCardContent, IonCol, IonIcon
    , IonLoading, IonRow, IonText } from "@ionic/react";
import { arrowBackOutline, chevronForwardOutline, leafOutline } from "ionicons/icons";
import './Profile.css'
import { useHistory } from "react-router";
import { FioSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';



defineCustomElements(window)

async function    takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    // source: CameraSource.Photos
    });
    var imageUrl = "data:image/jpeg;base64," + image.base64String;
    
    return imageUrl
    // Can be set to the src of an image no
  
  }

  
export function   Profile():JSX.Element {
    const [load , setLoading]   = useState(false)
    const [login, setLogin]     = useState<any>(Store.getState().login);
    const [upd, setUpd] = useState(0)
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
        <IonCardContent>
          <div className="pr-container">
            <div className="ml-1 mr-2">
              <div>Введите ФИО</div>
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
              <div className="p-div-1">
                <div className="flex fl-space">
                  <div>Фамилия</div>
                  <div> { login.person.Фамилия } </div>
                </div>
                <div className="flex fl-space mt-1">
                  <div>Имя</div>
                  <div> { login.person.Имя } </div>
                </div>
                <div className="flex fl-space mt-1">
                  <div>Отчество</div>
                  <div> { login.person.Отчество } </div>
                </div>
              </div>
            </div>
          </div>
        </IonCardContent>
       
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
