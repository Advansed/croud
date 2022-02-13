import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Applications } from '../components/Applications';
import { Login } from '../components/Login';
import { Partners } from '../components/Partners';
import { Options, Profile } from '../components/Profile';
import { Projects } from '../components/Projects';
import { Sentences } from '../components/Sentences';
import './Page.css';
import { Store } from './Store';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  function Main():JSX.Element {
    const [auth, setAuth] = useState(false)
    let elem = <></>

    Store.subscribe({num: 1, type: "auth", func:()=> {
        setAuth( Store.getState().auth )
    }})

    useEffect(()=>{
      setAuth( Store.getState().auth )
    },[])

    if( auth )
      switch ( name ) {
        case "":                  elem = <></>; break;
        case "Логин":             elem = <Login />; break;
        case "Личный кабинет":    elem = <Options />; break;
        case "Профиль":           elem = <Profile />; break;
        case "Организации":       elem = <Partners />; break;
        case "Проекты":           elem = <Projects />; break;
        case "Заявки":            elem = <Applications />; break;
        case "Сделки":            elem = <Applications />; break;
        case "Предложения":       elem = <Sentences />; break;
        case "Завершенные":       elem = <></>; break;
        default: elem = <></>
      }
    else {
      elem = <Login />
    }

    return elem
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <Main />
      </IonContent>
    </IonPage>
  );
};

export default Page;
