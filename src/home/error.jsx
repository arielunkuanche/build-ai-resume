import React from 'react'
import { useRouteError } from "react-router-dom";

function Error() {
    const error = useRouteError();
    console.log(error)

    return(
        <div>
            <h1>404 Page Not Found</h1>
            <p>{error.data}</p> 
        </div>
    )
}

export default Error