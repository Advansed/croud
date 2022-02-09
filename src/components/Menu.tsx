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

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
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
    title: 'Заявки',
    url: '/page/Заявки',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Проекты',
    url: '/page/Проекты',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'Предложения',
    url: '/page/Favorites',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  },
  {
    title: 'Завершенные',
    url: '/page/Archived',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp
  },
  {
    title: 'Организации',
    url: '/page/Организации',
    iosIcon: trashOutline,
    mdIcon: trashSharp
  },
  {
    title: 'Профиль',
    url: '/page/Личный кабинет',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const [auth, setAuth] = useState( Store.getState().auth );
  const location = useLocation();

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
          <IonListHeader>Labels</IonListHeader>
          {
            !auth ? <></> :
            labels.map((label, index) => (
              <IonItem lines="none" key={index}>
                <IonIcon slot="start" icon={bookmarkOutline} />
                <IonLabel>{label}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
