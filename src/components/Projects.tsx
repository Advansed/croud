
import { IonButton, IonIcon, IonInput, IonTextarea } from '@ionic/react'
import { addCircleOutline, barcodeOutline, cashOutline, listOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import ReactDaDataBox from 'react-dadata-box'
import { getData1C, Store } from '../pages/Store'
import './Projects.css'
import MaskedInput from "../mask/reactTextMask";


export function Projects():JSX.Element {
    const [projects, setProjects] = useState(Store.getState().projects)
    const [param, setParam] = useState<any>()
    const [page, setPage] = useState( 0 )

    useEffect(()=>{
        console.log(Store.getState().projects)
        setProjects(Store.getState().projects)
    },[])

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
                              , Дата:                         ""
                              , Номер:                        ""
                              , Описание:                     ""
                              , Сумма:                        ""
                              , URL:                          ""
                              , Организация:                {
                                  Код:                        "",
                                  Наименование:               "",
                                  Картинка:                   "",
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
                        Добавить проект
                    </IonButton>
                </div>
            </div>
        </>
    
        return elem
    }


    function Project():JSX.Element {
        const [ info ] = useState( param )


        async function save(){

            getData1C("СохранитьПроект", {
                Телефон:        Store.getState().login.code,    
                Проект:         info,
            })
                
            console.log(info)
            if(info.Код === "") {
                Store.dispatch({type: "projects", projects: [...projects, info]})
                setProjects([...projects, info])
            }
            setPage(0)
        }

        function SetOrg():JSX.Element {
            const [edit, setEdit] = useState( false )
            const [upd , setUpd] = useState( 0 )    
            let elem = <>
                <div className={ edit ? "" : "hidden"}
                    onDoubleClick = {()=>{
                        setEdit(!edit);
                    }}
                >
                        <ReactDaDataBox 
                            token="23de02cd2b41dbb9951f8991a41b808f4398ec6e" 
                            placeholder = "ИНН, Наименование"
                            type = "party"
                            onChange={(e)=>{
                                
                                let ИНН =              e?.data.inn
                                let КПП =              e?.data.kpp

                                let partners    = Store.getState().partners
                                var ind = partners.findIndex(function(b) { 
                                    return b.ИНН === ИНН && b.КПП === КПП; 
                                });
                                if(ind >= 0){
                                    info.Организация.Код            = partners[ind].Код
                                    info.Организация.Наименование   = partners[ind].Наименование
                                    info.Организация.Картинка       = partners[ind].Картинка
                                    
                                    setUpd(upd + 1)
                                    setEdit(!edit)
                                } else {

                                }

                            }} 
                        />
                </div>
                <div className="borders mt-1 ml-1 mr-1"
                    onClick={()=>{
                        setEdit(!edit)
                    }}
                >
                    <div className="flex">
                        <img src={ info.Организация.Картинка === "" ? "assets/org.png"
                            : info.Организация.Картинка    
                        } className="w-4 h-4"/>
                        <div className="ml-1">
                            <div className="fs-08"> { info.Организация.Наименование } </div>
                        </div>
                    </div>
                </div>            
            </>

            return elem
        }

        function SetProject():JSX.Element {
            let elem = <>
                <div className="borders mt-1 ml-1 mr-1 fs-08">
                    <div className="flex fl-space">
                        <div> Номер: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                value= { info.Номер }
                                onIonChange= {(e)=>{
                                info.Номер = e.detail.value     
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Дата: </div>
                        <div>  
                            <MaskedInput
                                mask={[ /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                className="m-input a-right"
                                autoComplete="off"
                                value = { info.Дата }
                                placeholder="__-__-____"
                                id='3'
                                type='text'
                                onChange={(e: any) => {
                                    let st = e.target.value;
                                    info.Дата = st;
                                }}
                            />               
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Наименование: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                value= { info.Наименование }
                                onIonChange= {(e)=>{
                                info.Наименование = e.detail.value     
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Сумма: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                type="number"
                                value= { info.Сумма }
                                onIonChange= {(e)=>{
                                    info.Сумма = e.detail.value
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> URL: </div>
                        <div>  
                            <IonInput
                                class="a-right"
                                value= { info.URL }
                                onIonChange= {(e)=>{
                                    info.URL = e.detail.value
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex fl-space">
                        <div> Описание: </div>
                    </div>
                    <div>  
                        <IonTextarea
                            className="t-area"
                            //autoGrow = { true }
                            rows={ 12 }
                            value= { info.Описание }
                            onIonChange= {(e)=>{
                                info.Описание = e.detail.value
                            }}
                        />
                    </div>
                </div>
            </>
            return elem
        }

        function Buttons():JSX.Element {
            let elem  = <>
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
                                save()
                            }}
                        >
                            Сохранить
                        </IonButton>
                    </div>
                </div>            
            </>
            return elem
        }

        let elem = <>
            <SetOrg />
            <SetProject />
            <Buttons />
        </>
        return elem
    }

    function ProjectCard(props):JSX.Element {
        const [ info ] = useState( props.info.info )
        let elem = <>
                <div className="borders mt-1 ml-1 mr-1 fs-08"
                onClick={()=>{
                    props.info.setParam( info )
                    setPage(1);
                }}
            >
                <div className="flex">
                    <img src={ info.Организация.Картинка === "" ? "assets/org.png"
                        : info.Организация.Картинка    
                    } className="w-3 h-3"/>
                    <div className="ml-2">
                        <div className="mt-1"> { info.Организация.Наименование } </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { barcodeOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div> { "№ " + info.Номер + " от " + info.Дата} </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { listOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-1"> <b>{ info.Наименование }</b> </div>
                </div>
                <div className="flex">
                    <div className="w-3 h-3 flex fl-center">
                        <IonIcon icon= { cashOutline } color="primary" className="w-2 h-2"/>
                    </div>
                    <div className="fs-2 flex fl-center w-100"> 
                        <b>
                            { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( info.Сумма ) }
                        </b> 
                    </div>
                </div>
            </div>    
        </>
        return elem
    }

    let items = <></>
    for(let i = 0;i < projects.length;i++){
        items = <>
            { items }
            <ProjectCard info = {{
                        info: projects[i],
                        setParam: (e)=>{
                            setParam(e)
                        },
                }}
            />
        </>
    }
    let elem = <>
        <div className="pr-content">
            { items }
        </div>
        <Footer />
    </>

    switch(page){
        case 0: return elem;
        case 1: return <Project />;
        default: return elem;
    }
    
}

