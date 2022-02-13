import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation, useHistory } from 'react-router-dom';
import { briefcaseOutline, bookmarkOutline, mailOutline, mailSharp, briefcaseSharp, mailUnreadOutline
  , mailUnreadSharp, mailOpenOutline, mailOpenSharp, serverOutline, serverSharp, saveOutline, saveSharp } from 'ionicons/icons';
import './Menu.css';
import { useState } from 'react';
import { Store } from '../pages/Store'

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Проекты',
    url: '/page/Проекты',
    iosIcon: briefcaseOutline,
    mdIcon: briefcaseSharp
  },
  {
    title: 'Заявки',
    url: '/page/Заявки',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Предложения',
    url: '/page/Предложения',
    iosIcon: mailUnreadOutline,
    mdIcon: mailUnreadSharp
  },
  {
    title: 'Завершенные',
    url: '/page/Завершенные',
    iosIcon: mailOpenOutline,
    mdIcon: mailOpenSharp
  },
  {
    title: 'Организации',
    url: '/page/Организации',
    iosIcon: serverOutline,
    mdIcon: serverSharp
  },
  {
    title: 'Профиль',
    url: '/page/Личный кабинет',
    iosIcon: saveOutline,
    mdIcon: saveSharp
  }
];

const labels = ['Новости', 'Партнеры', 'Контакты', 'О нас'];

const Menu: React.FC = () => {
  const [auth, setAuth] = useState( Store.getState().auth );
  const location = useLocation();
  const hist = useHistory();

  Store.subscribe({num: 10, type: "auth", func: ()=>{
    setAuth( Store.getState().auth )
  }})

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>ГосКонтракт</IonListHeader>
          <IonNote>goskontract@gmail.com</IonNote>
          { 
            !auth ? <></> :
            appPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })
          }
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Разное</IonListHeader>
          {
            !auth ? <></> :
            labels.map((label, index) => (
              <IonItem lines="none" key={index}>
                <IonIcon slot="start" icon={bookmarkOutline} />
                <IonLabel>{label}</IonLabel>
              </IonItem>
            ))}
            <IonMenuToggle key={1001} autoHide={false}>
              <IonItem lines="none" key={ 1001 }
                onClick={()=>{
                  localStorage.removeItem("croud.login")
                  Store.dispatch({type: "auth", auth: false})
                  hist.push("Заявки")
                }}
              >
                <IonIcon slot="start" icon={bookmarkOutline} />
                <IonLabel> Удалить регистрацию </IonLabel>
              </IonItem>
            </IonMenuToggle>
        </IonList>
        <div>
          Версия 10.2
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
