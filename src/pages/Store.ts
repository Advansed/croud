import { combineReducers  } from 'redux'
import axios from 'axios'
import { Reducer } from 'react';
import { constructSharp } from 'ionicons/icons';

var reducers: Array<Reducer<any, any>>;reducers = []

export const i_state = {

    auth:                        false,
    route:                          "",
    login:                          {
        code: "", name: "",  email : "", status: false, image: "", type: "login"
    },
    person:                         {
        ПолноеИмя:          "",           
        Имя:                "",
        Отчество:           "",
        Фамилия:            "",
    },
    partners:                       [],
    scans:                          [],    
    passport:                       {
        Серия:                  "",
        Номер:                  "",
        КогдаВыдан:             "",
        КемВыдан:               "",
        Код:                    "",
        scans:                  [],  
    },   
    projects:                       [],
    offers:                         [],
    apps:                           [],
    options:                        {
        Шаг:                    10000,
    },  
}


for(const [key, value] of Object.entries(i_state)){
    reducers.push(
        function (state = i_state[key], action) {
            switch(action.type){
                case key: {
                    if(typeof(value) === "object"){
                        if(Array.isArray(value)) {
                            return action[key]
                        } else {
                            let data: object; data = {};
                            for(const key1 of Object.keys(value)){ 
                                data[key1] = action[key1] === undefined ? state[key1] : action[key1]
                            }   
                            return data
                        }

                    } else return action[key]
                }
                default: return state;
            }       
        }

    )
}


export async function   getData(method : string, params){

    let res = await axios.post(
            URL + method, params
    ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}


export async function   getData1C(method : string, params){

    let res = await axios.post(
            URL1C + method, params
    ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}


function                create_Store(reducer, initialState) {
    var currentReducer = reducer;
    var currentState = initialState;
    var listeners: Array<any>; listeners = []
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            listeners.forEach((elem)=>{
                if(elem.type === action.type){
                    elem.func();
                }
            })
            return action;
        },
        subscribe(listen: any) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === listen.num; 
            });
            if(ind >= 0){
                listeners[ind] = listen;
            }else{
                listeners = [...listeners, listen]
            }
        },
        unSubscribe(index) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === index; 
            });
            if(ind >= 0){
                listeners.splice(ind, 1)
            }        
        }
    };
}

const                   rootReducer = combineReducers({

    auth:                      reducers[0],
    route:                     reducers[1],
    login:                     reducers[2],
    person:                    reducers[3],
    partners:                  reducers[4],
    scans:                     reducers[5],
    passport:                  reducers[6],
    projects:                  reducers[7],
    offers:                    reducers[8],  
    apps:                      reducers[9], 
    options:                   reducers[10],  

})

export const Store   =  create_Store(rootReducer, i_state)

export const URL1C = "https://marketac.ru:49002/croud/hs/API/V1/"

export const URL = "https://marketac.ru:49002/node/"

export async function   getDatas(){
}

export function Phone(phone): string {
    if(phone === undefined) return ""
    if(phone === null) return ""
    let str = "+"
    for(let i = 0;i < phone.length;i++){
      let ch = phone.charCodeAt(i)
      if( ch >= 48 && ch <= 57) str = str + phone.charAt(i)
    }
    return str
}

export async function getProfile(phone){
    Store.dispatch({type: "auth", auth: true });
    let res = await getData("method", {
            method: "Профиль",
            phone:  Phone(phone),
        })
    let login = res[0];login.type = "login"
    Store.dispatch( login )
}


// let timerId;


export async function   getOrders(){
//    Orders();
    // timerId = setInterval(() => {
    //     Orders()        
    // }, 5000);
  
}

export function         stopOrders(){

  //    setTimeout(() => { clearInterval(timerId) });

}

export async function   FIO(query){
    let res = await axios.post(
        URL + "checkFIO", { fio: query }
).then(response => response.data)
    .then((data) => {
        console.log(data)
        if(data.Код === 200) console.log(data) 
        return data
    }).catch(error => {
      console.log(error)
      return {Код: 200}
    })
return res

}

async function getPartners(){

    let res = await getData1C("Организации", Store.getState().login)
    Store.dispatch({ type: "partners", partners: res})

    res = await getData1C("Проекты", Store.getState().login)
    Store.dispatch({ type: "projects", projects: res})

    res = await getData1C("Заявки", Store.getState().login)
    console.log(res);
    Store.dispatch({ type: "apps", apps: res})
}

Store.subscribe({num: 1001, type: "auth", func:()=>{
    if(Store.getState().auth) {
        getPartners()
    }
}})

async function          exec(){
   // FIO("Петров Николай Рузвельтович")
   //localStorage.removeItem("croud.login")
}

exec();
