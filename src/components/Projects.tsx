
import { IonButton, IonIcon, IonInput, IonRange, IonTextarea } from '@ionic/react'
import { addCircleOutline, barcodeOutline, cashOutline, chevronDownOutline, chevronUpOutline, listOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import ReactDaDataBox from 'react-dadata-box'
import { getData1C, Store } from '../pages/Store'
import './Projects.css'
import MaskedInput from "../mask/reactTextMask";


export function Projects():JSX.Element {
    const [projects, setProjects] = useState(Store.getState().projects)
    const [param, setParam] = useState<any>()
    const [page, setPage] = useState( 0 )

    Store.subscribe({num: 31, type: "projects", func: ()=>{
        setProjects(Store.getState().projects)
    }})

    useEffect(()=>{
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
                <div className={ edit ? "mt-1 ml-1 mr-1" : "hidden"}>
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
                    <div className={ "flex" }>
                        <img src={ info.Организация.Картинка === "" ? "assets/org.png"
                            : info.Организация.Картинка    
                        } alt="Логотип" className="w-4 h-4"/>
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

    async function toApps(apps){
        console.log(apps)
        let res = await getData1C("СохранитьЗаявку", {
            Телефон:    Store.getState().login.code,
            Заявка:     apps
        })
        if(res.Код === 100) {
            var ind = projects.findIndex(function(b) { 
                return b.Код === apps.Проект.Код  
            });
            if(ind >= 0){
              projects.splice(ind, 1)
              Store.dispatch({type:"projects", projects: projects})
            }       
        }
        setPage( 0 )
    }

    function ProjectCard(props):JSX.Element {
        const [ info ] = useState( props.info.info )
        const [ apps, setApps] = useState<any>()
        const [ buts, setButs ] = useState(false)

        useEffect(()=>{
            let apps = Store.getState().apps;
            var ind = apps.findIndex(function(b) { 
                return b.Проект.Код === info.Код
            });
            if(ind >= 0){ 
                setApps( apps[ind] )
            }
            
        },[info])

        let elem = <>
            <div className="borders mt-1 ml-1 mr-1 fs-08"
                onClick={()=>{
                    setButs(!buts)
                }}
            >
                <div className={ buts ? "flex fl-space" : "hidden" }>
                    <IonButton 
                        fill    = "outline"
                        color   = "warning"
                        onClick={()=>{
                            props.info.setParam( info )
                            setPage(1);
                        }}
                    >
                       Открыть     
                    </IonButton>
                    <IonButton 
                        fill    = "outline"
                        color   = "success"
                        onClick={()=>{
                            props.info.setParam( info )
                            apps === undefined ? setPage(2) : setPage(3);
                        }}
                    >
                       { apps === undefined ? "Заявить" : "Предложения"}
                    </IonButton>
                </div>    
                <div className= { !buts ? "hidden" : "flex fl-center"}><IonIcon icon={ chevronDownOutline }/></div>
                <div className= { !buts ? "flex fl-center" : "hidden"}><IonIcon icon={ chevronUpOutline }/></div>
                <div className="flex">
                    <img src={ info.Организация.Картинка === "" ? "assets/org.png"
                        : info.Организация.Картинка    
                    } alt="Логотип" className="w-3 h-3"/>
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

    function Apps():JSX.Element {
        const [ info ] = useState( param )
        const [ apps ] = useState<any>({
            Номер:      "",
            Дата:       "",
            Проект:     param,
            Процент:    1,
            Срок:       1,
        })
        const [ value, setValue] = useState(1)
        const [ value1, setValue1] = useState(1)

        const customFormatter1 = (value: number) => `${value}%`;
        const customFormatter2 = (value: number) => `${value}мес`;

        let elem = <>
            <div className="borders mt-1 ml-1 mr-1 fs-08"
                onClick={()=>{
                }}
            >
                <div className="flex">
                    <img src={ info.Организация.Картинка === "" ? "assets/org.png"
                        : info.Организация.Картинка    
                    } alt="Логотип" className="w-3 h-3"/>
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

            <div className='borders mt-1 ml-1 mr-1 fs-08'>
                <div className='flex'>
                    <div className='w-20'>Процент</div>    
                    <div className='w-60'>
                        <IonRange 
                            min={ 1 } 
                            max={ 15 } 
                            pinFormatter={ customFormatter1 } 
                            pin={true}
                            step={ 1 }
                            snaps
                            value={ value } 
                            onIonChange={e => setValue(e.detail.value as number)}
                        />
                    </div>
                    <div className='w-20 fs-2'>
                        <b>{ value + "%"} </b>
                    </div>
                </div>
                <div className='flex'>
                    <div className='w-20'>Срок</div>    
                    <div className='w-100'>
                        <IonRange 
                            min={ 1 } 
                            max={ 12 } 
                            pinFormatter={ customFormatter2 } 
                            pin={true}
                            step={ 1 }
                            snaps
                            value={ value1 } 
                            onIonChange={e => setValue1(e.detail.value as number)}
                        />
                    </div>
                    <div className='w-20 fs-2'>
                        <b>{ value1 + "мес"} </b>
                    </div>
                </div>
                <div className='flex fs-2 mt-1'>
                    <div>
                        Вернуть:
                    </div>    
                    <div className='a-center w-100'>
                       <b> { new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(info.Сумма + info.Сумма * value1 * (value / 100)) } </b>
                    </div>
                </div>
                <div className='borders flex fl-space'>
                    <IonButton
                        fill    = "outline"
                        color   = "warning"
                        onClick={()=>{
                            setPage( 0 )
                        }}

                    >
                        Вернуться
                    </IonButton>
                    <IonButton
                        fill    = "outline"
                        color   = "success"
                        onClick={()=>{
                            apps.Процент    = info
                            apps.Срок       = value1
                            apps.Процент    = value
                            toApps( apps )
                        }}

                    >
                        Заявить
                    </IonButton>
                </div>
            </div>  
        </>
        return elem
    }
    
    function Sentence():JSX.Element {
        const [ info ] = useState( param )
        const [ deals, setDeals] = useState<any>([])
        const [ detail, setDetail] = useState(false)

        useEffect(()=>{
            let dls = Store.getState().deals;
            let jarr: any = [];
            info.Собрано = 0
            dls.forEach(elem => {
                if(elem.Проект.Код === info.Код){
                    jarr = [...jarr, elem]
                    info.Собрано = info.Собрано + elem.Сумма
                }
                
            });

            setDeals( jarr )
            
        },[info])

        async function accept(){
            let res = await getData1C("ПринятьПредложения", {
                Телефон:    Store.getState().login.code,
                Проект:     info,       
            })
            if(res.Код === 100) {

                res = await getData1C("Проекты", Store.getState().login)
                Store.dispatch({ type: "projects", projects: res})            

                res = await getData1C("Сделки", Store.getState().login)
                Store.dispatch({ type: "deals", deals: res})            
            }
        }
        let elem = <>
            <div className="borders ml-1 mr-1 mt-1"
                onClick = {()=>{
                    setDetail(!detail)
                }}
            >
                <div className="flex fl-space fs-1">
                    <div>Требуемая сумма</div>
                    <div>
                        <b>{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( info.Сумма ) }</b>
                    </div>
                </div>
                <div className="flex fl-space mt-1">
                    <div>Собрано</div>
                    <div>
                        <b>{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( info.Собрано ) }</b>
                    </div>
                </div>
                <div className="flex fl-space mt-1">
                    <div>Наполненность</div>
                    <div>
                        <b> { (info.Собрано * 100 / info.Сумма).toFixed(2)  } { " %"}</b>
                    </div>
                </div>
                <div className= { detail ? "hidden" : "flex fl-center"}><IonIcon icon={ chevronDownOutline }/></div>
                <div className= { detail ? "flex fl-center" : "hidden"}><IonIcon icon={ chevronUpOutline }/></div>
                <div className={ detail ? "" : "hidden"}>
                    {
                        deals.map((e)=>{
                            return <>
                                <div className="borders mt-1">
                                <div className = "flex fl-space">
                                        <img src = { e.Пользователь.Картинка === "" ? "assets/person.jpg" : e.Пользователь.Картинка }  className="w-3 h-3" alt="Фото"/>
                                        <div className="ml-1 fs-09">
                                            <div>{ e.Пользователь.Код }</div>
                                            <div>{ e.Пользователь.Наименование }</div>
                                        </div>
                                    </div>
                                    <div className = "flex fl-space mt-1 fs-12">
                                        <div>{ "Сумма:" }</div>
                                        <div className="a-right">
                                            <b>{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format( e.Сумма ) }</b>
                                        </div>
                                    </div>
                                </div>
                            </>
                        })
                    }
                </div>
            </div>
            <div className="borders ml-1 mt-1 mr-1">
                <div className={ "flex fl-space" }>
                    <IonButton 
                        fill    = "outline"
                        color   = "warning"
                        onClick={()=>{
                            setPage( 0 );
                        }}
                    >
                        Вернуться     
                    </IonButton>
                    <IonButton 
                        fill    = "outline"
                        color   = "success"
                        onClick={()=>{
                            accept()
                        }}
                    >
                        Принять
                    </IonButton>
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
        case 2: return <Apps />;
        case 3: return <Sentence />;
        default: return elem;
    }
    
}

