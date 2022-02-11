import { useState } from "react";
import { Store } from "../pages/Store";

export function Deals():JSX.Element {
    const [ deals ] = useState(Store.getState().deals)
    const [page, setPage] = useState( 0 )

    function DealList():JSX.Element {
        const[ info ] = useState( deals )

        let elem = <>

        </>
        return elem
    }

    let elem = <></>

    switch(page) {
        case 0: return <DealList />
        default: return <></>
    }
     return elem;


}